import React from "react";
import {  Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import StudentsPage from "./pages/StudentsPage";

const BrowserRouters = () => {
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentsPage/>} />
        <Route path="/teachers" element={<h1>Pagina de maestros</h1>} />
        <Route path="/groups" element={<GroupsPage/>} />
        <Route path="/highschool" element={<h1>Pagina de secundaria</h1>} />
      </Routes>
  );
};

export default BrowserRouters;
