import React, { useState, useEffect } from "react";//Esto lo que hace es importar la libreria de react y el hook useState
import { Helmet } from "react-helmet";
import { ThemeProvider } from "styled-components";
//import { invoke } from "@tauri-apps/api/core";
import Layout from "./components/Layout/Layout";

import { GlobalStyle } from "./styles/globalStyles";
import { darkTheme, lightTheme } from "./styles/theme";
import BrowserRouters from "./BrowserRouters";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



export const ThemeContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? lightTheme : darkTheme;
  useEffect(() => {
    if (window.__TAURI__) {
      console.log("Tauri está activo");
    } else {
      console.warn("Tauri no está disponible (modo navegador)");
    }
  }, []);
  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <GlobalStyle />
        <Helmet>
          <title>Sidebar - Code Focus</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <>
          <Layout>
            <BrowserRouters />
          </Layout>
        </>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
