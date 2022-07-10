import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";

const MyNavbar: FC = () => {
  const { AuthStore } = useStore();
  const navigate = useNavigate();

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Knaban Board
        </Navbar.Brand>
        <Navbar.Collapse className="navbar">
          <h5>{AuthStore.isAuth ? "@" + AuthStore.user?.login : null}</h5>
          {AuthStore.isAdmin ? (
            <Button
              variant="outline-primary"
              onClick={() => navigate("/admin")}
            >
              Панель администратора
            </Button>
          ) : null}
          {AuthStore.isAuth ? (
            <Button
              variant="outline-primary"
              onClick={() => {
                AuthStore.logout();
                navigate("/auth");
              }}
            >
              Выйти
            </Button>
          ) : (
            <Button variant="outline-primary" onClick={() => navigate("/auth")}>
              Войти
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default observer(MyNavbar);
