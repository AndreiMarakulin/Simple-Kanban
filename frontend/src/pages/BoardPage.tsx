import React, { FC } from "react";
import { Row, Col, Container } from "react-bootstrap";
import BoardsList from "../components/BoardsList";
import Board from "../components/Board";
import { useStore } from "../store";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const BoardPage:FC = () => {
  const { AuthStore } = useStore();

  if (!AuthStore.isAuth) {
    return <Navigate to="/auth" replace />;
  }

  return (
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
  );
};

export default observer(BoardPage);
