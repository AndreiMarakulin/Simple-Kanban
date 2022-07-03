import React, { FC, useState } from "react";
import { Form, Row, Button, Modal } from "react-bootstrap";
import { useStore } from "../../store";

interface ModalProps {
  isShown: boolean;
  onHide: () => void;
}

const LoginModal: FC<ModalProps> = ({ isShown, onHide }) => {
  const { AuthStore } = useStore();
  const [loginForm, setloginForm] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const closeModal = () => {
    setLogin("");
    setPassword("");
    setloginForm(true);
    onHide();
  };

  const submit = async () => {
    try {
      if (loginForm) {
        const loginSuccess = await AuthStore.login(login, password);
        if (loginSuccess) closeModal();
      } else {
        const registrationSuccess = await AuthStore.registration(
          login,
          password
        );
        if (registrationSuccess) closeModal();
      }
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <Modal show={isShown} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{loginForm ? "Авторизация" : "Регистрация"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш логин..."
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш пароль..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Row className="mt-3">
            {loginForm ? (
              <div>
                Нет аккаунта?{" "}
                <Button
                  onClick={() => {
                    setloginForm(false);
                  }}
                >
                  Зарегистрируйся!
                </Button>
              </div>
            ) : (
              <div>
                Есть аккаунт?{" "}
                <Button onClick={() => setloginForm(true)}>Войдите!</Button>
              </div>
            )}
            <Button
              variant={"outline-success"}
              onClick={submit}
              className="mt-3"
            >
              {loginForm ? "Войти" : "Регистрация"}
            </Button>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
