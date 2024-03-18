import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "./NavBar";
import { HomePage } from "./HomePage";
import SignUp from "./Signup";
import Login from "./Login";
import { Header } from "./Header";

function App() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cashtracker" element={<Header />} />
      </Route>
    </Routes>
  );
}

export default App;
