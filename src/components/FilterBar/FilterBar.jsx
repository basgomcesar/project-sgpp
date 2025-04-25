import React, { useState } from 'react';
import { Navbar, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const FilterBar = ({onFilter}) => {
    const [filtros, setFiltros] = useState({
        grupo: '',
        semestre: '',
        escuela: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Filtros aplicados:', filtros);
        if (onFilter) {
            onFilter(filtros); 
        }
    };

    const handleReset = () => {
        setFiltros({
            grupo: '',
            semestre: '',
            escuela: '',
        });
        if (onFilter) {
            onFilter({
                grupo: '',
                semestre: '',
                escuela: '',
            });
        }
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Navbar.Brand href="#">Filtrar</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Form onSubmit={handleSubmit} className="w-100">
                    <Row className="align-items-center">
                        <Col md={4}>
                            <Form.Group controlId="formNivel">
                                <Form.Label>Curso</Form.Label>
                                <Form.Select
                                    name="grupo"
                                    value={filtros.grupo}
                                    onChange={handleChange}
                                >
                                    <option defaultValue="">Selecciona un curso</option>
                                    <option value="cursoObs">Observación y análisis de prácticas y contextos escolares</option>
                                    <option value="cursoMediacion">Mediación pedagógica y trabajo docente</option>
                                    <option value="cursoProyecto">Proyecto de intervención docente</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group controlId="formEscuela">
                            <Form.Label>Escuela</Form.Label>
                            <Form.Select
                                name="escuela"
                                value={filtros.escuela}
                                onChange={handleChange}
                            >
                                <option defaultValue="">Selecciona una escuela</option>
                                <option value="escuela1">Francisco Javier Clavijero</option>
                                <option value="escuela2">Jaime Torres Bodet</option>
                                <option value="escuela3">Adolfo Ruiz Cortines</option>
                            </Form.Select>
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formSemestre">
                                <Form.Label>Semestre</Form.Label>
                                <Form.Select
                                    name="semestre"
                                    value={filtros.semestre}
                                    onChange={handleChange}
                                >
                                    <option value="">Todos</option>
                                    <option value="1">Primer Semestre</option>
                                    <option value="2">Segundo Semestre</option>
                                    <option value="3">Tercer Semestre</option>
                                    <option value="4">Cuarto Semestre</option>
                                    <option value="5">Quinto Semestre</option>
                                    <option value="6">Sexto Semestre</option>
                                    <option value="7">Septimo Semestre</option>
                                    <option value="8">Octavo Semestre</option>
                                    <option value="9">Noveno Semestre</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                            <Button variant="primary" type="submit" className="me-2">
                                Aplicar Filtros
                            </Button>
                            <Button variant="outline-secondary" onClick={handleReset}>
                                Limpiar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default FilterBar;