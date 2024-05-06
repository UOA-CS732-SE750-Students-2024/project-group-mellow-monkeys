import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Layout from "./layouts/Layout";
import UserInfoPage from "./Pages/UserInfoPage/UserInfoPage";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Homepage from "./Pages/Homepage/Homepage";
import SurveyPage from "./Pages/Surveypage/Surveypage";

function App() {
  // const { auth } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Routes*/}
      <Route element={<ProtectedRoute redirectPath="/login" />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/user-info" element={<UserInfoPage />} />
          <Route path="/survey" element={<SurveyPage />} />
        </Route>
      </Route>

      {/* Catch-all Route */}
      <Route
        path="*"
        element={
          <h1 className="bg-dark d-flex align-items-center justify-content-center w-100 h-100 p-5">
            There's nothing here: 404!
          </h1>
        }
      />
    </Routes>
  );
}

export default App;
