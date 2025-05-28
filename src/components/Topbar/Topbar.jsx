import styled from "styled-components";

const STopbar = styled.header`
    width: 100%;
    background-color: #1976d2;
    color: #fff;
    padding: 16px 0;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    min-height: 56px;
`;

const Topbar = () => {
    return (
        <STopbar>
            Sistema de gestión de prácticas en escuelas telesecundarias
        </STopbar>
    );
};

export default Topbar;