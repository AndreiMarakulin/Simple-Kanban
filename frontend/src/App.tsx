import React from "react";
import MyNavbar from "./components/Navbar";
import { Row, Col, Container } from "react-bootstrap";
import BoardsList from "./components/BoardsList";
import Board from "./components/Board";
import "./style.css";

// TODO Лоудер при загрузке страницы
// TODO Порядок карточек / листов при загрузке

const App = () => {
  return (
    <div>
      <MyNavbar />

      <Container style={{ margin: 10 }}>
        <Row>
          <Col md={2}>
            <BoardsList />
          </Col>
          <Col md={10}>
            <Board />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
