import React from "react";
import {  Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupsPage";
import StudentsPage from "./pages/StudentsPage";
import StudentDetailsPage from "./components/StudentPageDetails/StudentDetailsPage";
import HighSchoolsPage from "./pages/HighSchoolsPage";
import NewSchoolPage from "./pages/NewSchoolPage";
import SchoolDetailsPage from "./components/SchoolDetailsPage/SchoolDetailsPage";
import TeachersPage from "./pages/TeachersPage";

const BrowserRouters = () => {
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentsPage/>} />
        <Route path="/students/:id" element={<StudentDetailsPage/>} />
        <Route path="/students/:id/edit" element={<StudentDetailsPage/>} />
        <Route path="/teachers" element={<TeachersPage/>} />
        <Route path="/groups" element={<GroupsPage/>} />
        <Route path="/highschool" element={<HighSchoolsPage/>} />
        <Route path="/highschools/:id" element={<SchoolDetailsPage/>} />
        <Route path="/highschools/new" element={<NewSchoolPage/>} />
      </Routes>
  );
};

export default BrowserRouters;
