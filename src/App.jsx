import React, { useState } from "react";//Esto lo que hace es importar la libreria de react y el hook useState
import { Helmet } from "react-helmet";
import { ThemeProvider } from "styled-components";
//import { invoke } from "@tauri-apps/api/core";
import Layout from "./components/Layout/Layout";
import { GlobalStyle } from "./styles/globalStyles";
import { darkTheme, lightTheme } from "./styles/theme";
import BrowserRouters from "./BrowserRouters";

export const ThemeContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? lightTheme : darkTheme;
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
