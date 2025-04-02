import React, { useState } from 'react';

const StudentTable = () => {
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (rowId) => {
        setSelectedRow(rowId);
        console.log('Row clicked:', rowId);
    };

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Matricula</th>
                    <th scope="col">Semestre</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    className={selectedRow === 1 ? 'table-active' : ''}
                    onClick={() => handleRowClick(1)}
                >
                    <th scope="row">1</th>
                    <td>Cesar Basilio Gomez</td>
                    <td>zs21013897</td>
                    <td>3</td>
                </tr>
                <tr
                    className={selectedRow === 2 ? 'table-active' : ''}
                    onClick={() => handleRowClick(2)}
                >
                    <th scope="row">2</th>
                    <td>Rodolfo Fernandez Rodriguez</td>
                    <td>zs21023461</td>
                    <td>4</td>
                </tr>
                <tr
                    className={selectedRow === 3 ? 'table-active' : ''}
                    onClick={() => handleRowClick(3)}
                >
                    <th scope="row">3</th>
                    <td>Abraham Cruz Carmona</td>
                    <td>zs21013533</td>
                    <td>7</td>
                </tr>
            </tbody>
        </table>
    );
};

export default StudentTable;