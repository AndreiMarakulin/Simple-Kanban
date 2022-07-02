import React, { FC, useEffect } from "react";
import MyNavbar from "./components/Navbar";
import { Row, Col, Container } from "react-bootstrap";
import BoardsList from "./components/BoardsList";
import Board from "./components/Board";
import "./style.css";
import { useStore } from "./store";
import { observer } from "mobx-react-lite";

// TODO Лоудер при загрузке страницы
// TODO Порядок карточек / листов при загрузке

const App: FC = () => {
  const { AuthStore } = useStore();

  // FIXME Насколько уместна такая проверка
  useEffect(() => {
    AuthStore.refresh();
  }, [AuthStore]);

  return (
    <div>
      <MyNavbar />
      {AuthStore.isAuth ? (
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
      ) : (
        <h3 className="center" >Не авторизован</h3>
      )}
    </div>
  );
};

export default observer(App);
