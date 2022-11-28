import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Screens
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import UserProfile from "./screens/UserProfileSceen";
import InventoryScreen from "./screens/InventoryScreen";
import Market from "./screens/MarketScreen";
import ArchiveScreen from "./screens/ArchiveScreen";

// Error Screens
import UnAuthScreen from "./screens/errorPage/UnAuthScreen";
import NotFound from "./screens/errorPage/NotFound";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token != null) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [isAuth]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<HomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/marketplace"
            element={isAuth ? <Market /> : <UnAuthScreen />}
          />
          <Route
            path="/explore"
            element={isAuth ? <GameScreen /> : <UnAuthScreen />}
          />
          <Route
            path="/profile/:userId"
            element={isAuth ? <UserProfile /> : <UnAuthScreen />}
          />
          <Route path="/inventory/:userId" element={<InventoryScreen />} />
          <Route
            path="/ItemViewer"
            element={isAuth ? <ArchiveScreen /> : <UnAuthScreen />}
          />

          {/* Error Page Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
