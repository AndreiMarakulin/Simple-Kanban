import React, { FC, useEffect, useState } from "react";
import MyNavbar from "./components/Navbar";
import "./style.css";
import { useStore } from "./store";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { Spinner } from "react-bootstrap";

const App: FC = () => {
  const { AuthStore } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      await AuthStore.refresh();
    };
    refresh().then(() => {
      setLoading(false);
    });
  }, [AuthStore]);

  if (loading) {
    return (
      <div className="center-screen">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <MyNavbar />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
