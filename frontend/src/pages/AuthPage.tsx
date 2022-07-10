import React, { FC, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const AuthPage: FC = () => {
  const { AuthStore } = useStore();
  const [loginForm, setloginForm] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      if (loginForm) {
        const loginSuccess = await AuthStore.login(login, password);
        if (loginSuccess) navigate(`/board`);
      } else {
        const registrationSuccess = await AuthStore.registration(
          login,
          password
        );
        if (registrationSuccess) navigate(`/board`);
      }
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <Form className="login">
      <h2 className="m-auto">{loginForm ? "Авторизация" : "Регистрация"}</h2>
      <Form.Control
        className="mt-3 login-item"
        placeholder="Введите ваш логин..."
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <Form.Control
        className="mt-3 login-item"
        placeholder="Введите ваш пароль..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <div className="login-button mt-3">
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
        <Button variant={"outline-success"} onClick={submit}>
          {loginForm ? "Войти" : "Регистрация"}
        </Button>
      </div>
    </Form>
  );
};

export default AuthPage;
