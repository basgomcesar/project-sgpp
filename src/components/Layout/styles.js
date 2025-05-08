import styled from "styled-components";

import { v } from "../../styles/variables";

export const SLayout = styled.div`
    display: flex;
`;

export const SMain = styled.main`
    flex: 1;
    width: 100%;
    padding: calc(${v.smSpacing} * 2);
    h1 {
        font-size: 14px;
    }
`;