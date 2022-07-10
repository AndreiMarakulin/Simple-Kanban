import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import AuthPage from "../pages/AuthPage";
import BoardPage from "../pages/BoardPage";

const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BoardPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/board" element={<BoardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route
        path="*"
        element={
          <main className="center-screen">
            <h1>
              Ошибка 404! <br /> Запрашиваемой страницы не существует
            </h1>
          </main>
        }
      />
    </Routes>
  );
};

export default observer(AppRouter);
