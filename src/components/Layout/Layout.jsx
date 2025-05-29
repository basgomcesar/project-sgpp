import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { SLayout,SContent, SMain } from "./styles";

const Layout = ({ children }) => {
    return (
        <SLayout>
            <Sidebar />
            <SContent>
                <Topbar />
            <SMain>{children}</SMain>
            </SContent>
        </SLayout>
    );
};

export default Layout;