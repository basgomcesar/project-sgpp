import React from "react";
import styled from "styled-components";
import { v } from "../../styles/variables";

const TopbarContainer = styled.header`
    height: 60px;
    background: #082645;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${v.lgSpacing};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    color: white;
    font-size: 22px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Topbar = () => {
    return (
        <TopbarContainer>
            <Title>
                Benemérita Escuela Normal Veracruzana Enrique C. Rébsamen
            </Title>
            <div style={{ color: "white", fontSize: "16px" }}>
                Sistema de Gestión de Practicas Profesionales 
            </div>
        </TopbarContainer>
    );
};

export default Topbar;
