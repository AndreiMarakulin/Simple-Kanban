import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useStore } from "../store";

const AdminPage: FC = () => {
  const { AuthStore, AdminStore } = useStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (AuthStore.isAuth && AuthStore.isAdmin) {
      AdminStore.getUsers();
      const getUsers = async () => {
        await AuthStore.refresh();
      };
      getUsers().then(() => {
        setLoading(false);
      });
    }
  }, [AdminStore, AuthStore]);

  if (!AuthStore.isAuth) {
    return <Navigate to="/auth" replace />;
  }

  if (!AuthStore.isAdmin) {
    return (
      <main className="center-screen">
        <h1>
          Ошибка 403! <br /> Для доступа к панели администратора, <br /> войдите
          в учетную запись с правами администратора!
        </h1>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="center-screen">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

  return (
    <main className="center">
      <Table className="adminPanel">
        <thead>
          <tr>
            <th>Id</th>
            <th>Логин</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Бан</th>
          </tr>
        </thead>
        <tbody>
          {AdminStore.users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.login}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    AdminStore.changeUserStatus(
                      user.id,
                      user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
                    )
                  }
                >
                  {user.status === "ACTIVE" ? "Забанить" : "Разбанить"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
};

export default observer(AdminPage);
