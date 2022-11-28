import React, { useState, useEffect } from "react";
import "../css/commonClass.css";
import "../css/singleFunctionClasses.css";
import { NavBar } from "../components/NavBar";
import { ArchivePageSwap } from "../components/itemViewer";

function AdminScreen() {
  // Hosting Detection
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";

  return (
    <div id="volatile">
      <NavBar />
      <ArchivePageSwap />
    </div>
  );
}

export default AdminScreen;
