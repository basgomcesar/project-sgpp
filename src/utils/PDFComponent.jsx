import React from 'react';
import {
  Page, Text, View, Document, StyleSheet, PDFDownloadLink
} from '@react-pdf/renderer';

// Estilos
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  section: { marginVertical: 10 },
  table: { display: "table", width: "auto", marginTop: 10 },
  tableRow: { flexDirection: "row" },
  tableColHeader: { width: "25%", backgroundColor: "#eee", padding: 4, fontWeight: "bold", border: '1px solid #000' },
  tableCol: { width: "25%", padding: 4, border: '1px solid #000' },
  footer: { marginTop: 20, textAlign: 'center' },
});

const data = [
  ["3°", "Niños Héroes", "30DTV0062C", "26 de octubre al 18 de noviembre de 2022", "72"],
  ["4°", "Ejército Mexicano", "30DTV1781R", "17 de abril al 02 de junio de 2023", "120"],
  ["5°", "Ricardo Flores Magón", "30DTV0065S", "2 de octubre al 08 diciembre de 2023", "120"],
  ["6°", "Héroe de Nacozari", "30DTV0275E", "22 de abril al 14 de junio de 2024", "120"],
  ["7°", "18 de Marzo", "30DTV0812N", "21 de agosto al 24 de noviembre de 2024", "270"],
  ["8°", "18 de Marzo", "30DTV0812N", "18 al 24 de febrero de 2025", "30"]
];

const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      <Text style={{ textAlign: 'right' }}>DIRECCIÓN/LEAT/ED/523/2025</Text>
      <Text style={styles.title}>A QUIEN CORRESPONDA</Text>

      <Text style={styles.section}>
        El que suscribe, Director de la Benemérita Escuela Normal Veracruzana “Enrique C. Rébsamen”, con clave 30ENL0003V, por este medio
      </Text>

      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>
        H A C E &nbsp;&nbsp; C O N S T A R
      </Text>

      <Text>
        Que la C. AGUIRRE NAMORADO ANDREIA estudiante del 8º semestre de la Licenciatura en Enseñanza y Aprendizaje en Telesecundaria,
        cuenta con Experiencia Docente como se detalla a continuación:
      </Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>SEMESTRE</Text>
          <Text style={styles.tableColHeader}>ESCUELA</Text>
          <Text style={styles.tableColHeader}>CCT</Text>
          <Text style={styles.tableColHeader}>PERIODO DE REALIZACIÓN</Text>
          <Text style={styles.tableColHeader}>NO. DE HORAS</Text>
        </View>
        {data.map((row, i) => (
          <View style={styles.tableRow} key={i}>
            {row.map((col, j) => (
              <Text key={j} style={styles.tableCol}>{col}</Text>
            ))}
          </View>
        ))}
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableCol, width: '75%', fontWeight: 'bold' }}>TOTAL DE HORAS</Text>
          <Text style={{ ...styles.tableCol, fontWeight: 'bold' }}>732</Text>
        </View>
      </View>

      <Text style={styles.section}>
        La Experiencia Docente la realizó en los Servicios de Educación Telesecundaria al que fueron adscritos.
      </Text>

      <Text style={styles.section}>
        Para los fines legales que convengan a la interesada, se extiende la presente en la ciudad de Xalapa-Enríquez, Veracruz,
        a los veinticuatro días del mes de febrero del año dos mil veinticinco.
      </Text>

      <Text style={styles.footer}>
        DR. GERARDO GÓMEZ SALAS{"\n"}DIRECTOR
      </Text>
    </Page>
  </Document>
);

const PDFComponent = () => (
  <div>
    <PDFDownloadLink document={<MyDocument />} fileName="constancia.pdf">
      {({ loading }) => loading ? "Generando..." : "Descargar Constancia PDF"}
    </PDFDownloadLink>
  </div>
);

export default PDFComponent;
