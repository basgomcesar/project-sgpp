// Versión mejorada: agrega el encabezado como imagen JPG desde la carpeta public/ y alinea el contenido.

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import download from 'downloadjs';

// Utiliza la ruta pública relativa del encabezado, por ejemplo: "/encabezado.jpg"
const HEADER_IMAGE_PATH = "/IMAGEN_ENCABEZADO.jpg";

const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

const cleanText = (text) => {
  if (!text) return '';
  return text.toString().replace(/\n/g, ' ').replace(/[^\x00-\xFF]/g, '').trim();
};

const formatPeriod = (initialDate, finalDate) => {
  const init = new Date(initialDate);
  const end = new Date(finalDate);
  if (init.getFullYear() === end.getFullYear()) {
    if (init.getMonth() === end.getMonth()) {
      return `${init.getDate()} al ${end.getDate()} de ${init.toLocaleString('es-MX', { month: 'long' })} de ${init.getFullYear()}`;
    }
    return `${init.getDate()} de ${init.toLocaleString('es-MX', { month: 'long' })} al ${end.getDate()} de ${end.toLocaleString('es-MX', { month: 'long' })} de ${init.getFullYear()}`;
  }
  return `${formatDate(initialDate)} al ${formatDate(finalDate)}`;
};

const generateCertificate = async (student, practices) => {
  try {
    if (!student?.full_name || !student?.semester_id || !Array.isArray(practices)) throw new Error('Datos incompletos');

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]); // A4

    // Cargar encabezado como imagen JPG desde /public/
    const headerImageResponse = await fetch(HEADER_IMAGE_PATH);
    if (!headerImageResponse.ok) throw new Error('No se pudo cargar la imagen de encabezado');
    const headerImageBuffer = await headerImageResponse.arrayBuffer();
    const headerImage = await pdfDoc.embedJpg(headerImageBuffer);

    // Tamaño y posición del encabezado (ajusta según el tamaño de tu JPG)
    const headerWidth = 495;
    const headerHeight = 65;
    const headerX = (595 - headerWidth) / 2;
    const headerY = 842 - 60 - headerHeight; // 60 px de margen superior

    page.drawImage(headerImage, {
      x: headerX,
      y: headerY,
      width: headerWidth,
      height: headerHeight
    });

    // Márgenes y estilos
    const pageWidth = 595;
    const margin = 60;
    const tableWidth = pageWidth - 2 * margin;
    const colProps = [0.12, 0.32, 0.13, 0.30, 0.13];
    const tableCols = colProps.map(p => Math.round(tableWidth * p));
    const rowHeight = 24;
    const tableFontSize = 11;
    const mainFontSize = 12;

    const fonts = {
      bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      normal: await pdfDoc.embedFont(StandardFonts.Helvetica)
    };

    // Dibuja el texto administrativo debajo del encabezado
    let y = headerY - 15;
    page.drawText('DIRECCIÓN/LEAT/ED/523/2025', {
      x: pageWidth - margin - 170, y: y, font: fonts.normal, size: 9
    });

    // Título centrado
    y -= 38;
    const center = (text, font, size) => (pageWidth - font.widthOfTextAtSize(text, size)) / 2;
    page.drawText('A QUIEN CORRESPONDA', {
      x: center('A QUIEN CORRESPONDA', fonts.bold, 16), y, font: fonts.bold, size: 16
    });

    y -= 2 * mainFontSize + 2;
    const introLines = [
      'El que suscribe, Director de la Benemérita Escuela Normal Veracruzana',
      '"Enrique C. Rébsamen", con clave 30ENL0003V, por este medio'
    ];
    introLines.forEach(line => {
      page.drawText(line, { x: margin, y, font: fonts.normal, size: mainFontSize });
      y -= mainFontSize + 4;
    });

    y -= 2 * mainFontSize + 4;
    page.drawText('H A C E   C O N S T A R', {
      x: center('H A C E   C O N S T A R', fonts.bold, 16), y, font: fonts.bold, size: 16
    });

    y -= 2 * mainFontSize + 2;
    const paraLines = [
      `Que la C. ${student.full_name.toUpperCase()} estudiante del ${student.semester_id}º semestre de la`,
      `Licenciatura en Enseñanza y Aprendizaje en Telesecundaria, cuenta con Experiencia Docente`,
      `como se detalla a continuación:`
    ];
    paraLines.forEach(line => {
      page.drawText(line, { x: margin, y, size: mainFontSize, font: fonts.normal });
      y -= mainFontSize + 4;
    });

    // Tabla
    y -= 24;
    const tableX = margin;
    let tableY = y;

    // Encabezados (fondo gris claro)
    let colX = tableX;
    const headers = ['SEMESTRE', 'ESCUELA', 'CCT', 'PERIODO DE REALIZACIÓN', 'NO. DE HORAS'];
    for (let i = 0; i < tableCols.length; i++) {
      page.drawRectangle({
        x: colX, y: tableY, width: tableCols[i], height: rowHeight,
        color: rgb(0.92, 0.92, 0.92),
        borderWidth: 1, borderColor: rgb(0.7,0.7,0.7)
      });
      const text = headers[i];
      let fontSize = tableFontSize;
      let textWidth = fonts.bold.widthOfTextAtSize(text, fontSize);
      // Reduce font size if text is too wide for the cell
      while (textWidth > tableCols[i] - 4 && fontSize > 7) {
        fontSize -= 0.5;
        textWidth = fonts.bold.widthOfTextAtSize(text, fontSize);
      }
      page.drawText(text, {
        x: colX + (tableCols[i] - textWidth) / 2,
        y: tableY + 7,
        font: fonts.bold,
        size: fontSize
      });
      colX += tableCols[i];
    }

    // Filas de la tabla
    tableY -= rowHeight;
    practices.forEach((row) => {
      let colX = tableX;
      const vals = [
        `${row.semester || 'N/A'}°`,
        cleanText(row.school_name),
        cleanText(row.school_code || row.cct || 'N/A'),
        formatPeriod(row.initial_date, row.final_date),
        `${row.practice_hours}`
      ];
      for (let i = 0; i < vals.length; i++) {
        // Borde de celda
        page.drawRectangle({
          x: colX, y: tableY, width: tableCols[i], height: rowHeight,
          borderWidth: 0.5, borderColor: rgb(0.7,0.7,0.7)
        });
        // Texto
        const val = vals[i];
        const font = fonts.normal;
        const textWidth = font.widthOfTextAtSize(val, tableFontSize);
        page.drawText(val, {
          x: colX + (tableCols[i] - textWidth) / 2,
          y: tableY + 7,
          font,
          size: tableFontSize
        });
        colX += tableCols[i];
      }
      tableY -= rowHeight;
    });

    // Total de horas
    let colX2 = tableX;
    const totalHours = practices.reduce((acc, r) => acc + (parseFloat(r.practice_hours) || 0), 0);
    for (let i = 0; i < headers.length; i++) {
      let txt = '';
      let font = fonts.normal;
      if (i === 3) {
        txt = 'TOTAL DE HORAS';
        font = fonts.bold;
      }
      if (i === 4) {
        txt = `${totalHours}`;
        font = fonts.bold;
      }
      // Fondo gris solo para "TOTAL DE HORAS"
      if (i === 3) {
        page.drawRectangle({
          x: colX2, y: tableY, width: tableCols[i], height: rowHeight,
          color: rgb(0.92, 0.92, 0.92),
          borderWidth: 0.5, borderColor: rgb(0.7,0.7,0.7)
        });
      } else {
        page.drawRectangle({
          x: colX2, y: tableY, width: tableCols[i], height: rowHeight,
          borderWidth: 0.5, borderColor: rgb(0.7,0.7,0.7)
        });
      }
      const textWidth = font.widthOfTextAtSize(txt, tableFontSize);
      page.drawText(txt, {
        x: colX2 + (tableCols[i] - textWidth) / 2,
        y: tableY + 7,
        font,
        size: tableFontSize
      });
      colX2 += tableCols[i];
    }

    // Texto final
    y = tableY - (rowHeight + 12);
    const closingLines = [
      'La Experiencia Docente la realizó en los Servicios de Educación Telesecundaria',
      'al que fueron adscritos.',
      '',
      'Para los fines legales que convengan a la interesada, se extiende la presente en la ciudad',
      'de Xalapa-Enríquez, Veracruz, a los ' +
        `${new Date().getDate()} días del mes de ` +
        `${new Date().toLocaleString('es-MX', { month: 'long' })} del año dos mil ` +
        `${new Date().getFullYear().toString().slice(2)}.`
    ];
    closingLines.forEach(line => {
      page.drawText(line, { x: margin, y, font: fonts.normal, size: mainFontSize });
      y -= mainFontSize + 6;
    });

    // Firma centrada
    y -= 2 * mainFontSize;
    const firma = [
      { text: 'DR. GERARDO GÓMEZ SALAS', bold: true },
      { text: 'DIRECTOR', bold: true }
    ];
    firma.forEach((f, idx) => {
      const font = f.bold ? fonts.bold : fonts.normal;
      const tWidth = font.widthOfTextAtSize(f.text, 14);
      page.drawText(f.text, {
        x: (pageWidth - tWidth) / 2,
        y: y - idx * (mainFontSize + 4),
        font,
        size: 14
      });
    });

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, `Constancia_${student.full_name.replace(/\s+/g, '_')}.pdf`, 'application/pdf');
  } catch (e) {
    console.error('Error generando certificado:', e);
    throw e;
  }
};

export default generateCertificate;