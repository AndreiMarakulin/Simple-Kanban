import React, { FC } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const MyNavbar: FC = () => {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand>Knaban Board</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link>
            Login
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
