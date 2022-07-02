import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useStore } from "../store";
import LoginModal from "./modals/LoginModal";

const MyNavbar: FC = () => {
  const { AuthStore } = useStore();
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand>Knaban Board</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Container >
            {AuthStore.isAuth ? ("@" + AuthStore.userLogin) : null}
          </Container>
          <Nav.Link>
            {AuthStore.isAuth ? (
              <Button
                variant="outline-primary"
                onClick={() => AuthStore.logout()}
              >
                Выйти
              </Button>
            ) : (
              <Button
                variant="outline-primary"
                onClick={() => setLoginVisible(true)}
              >
                Войти
              </Button>
            )}
          </Nav.Link>
          <LoginModal 
          isShown={loginVisible}
          onHide={() => {setLoginVisible(false)}}/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default observer(MyNavbar);
