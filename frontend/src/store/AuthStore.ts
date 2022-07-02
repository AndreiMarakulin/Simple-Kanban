import { computed, flow, makeAutoObservable } from "mobx";
import Api from "../utils/ApiHttp";

interface IUser {
  id: number;
  login: string;
  name: string;
  role: string;
}

export interface IUserData {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export class AuthStore {
  token: string | undefined = undefined;
  userLogin: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this, {
      login: flow,
      logout: flow,
      registration: flow,
      isAuth: computed,
    });
  }

  get isAuth(): boolean {
    return !!this.token;
  }
  
  changeToken(token: string) {
    this.token = token;
  }

  *login(
    login: string,
    password: string
  ): Generator<Promise<Object | void>, boolean, IUserData> {
    try {
      const response = yield new Api().post("/api/auth/login", {
        login,
        password,
      });
      if (response.accessToken) {
        this.token = response.accessToken;
        this.userLogin = response.user.login;
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.log(err);
    }
    return this.isAuth;
  }

  *registration(
    login: string,
    password: string
  ): Generator<Promise<Object | void>, boolean, IUserData> {
    try {
      const response = yield new Api().post("/api/auth/registration", {
        login,
        password,
      });
      if (response.accessToken) {
        this.token = response.accessToken;
        this.userLogin = response.user.login;
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.log(err);
    }
    return this.isAuth;
  }

  *logout(): Generator<Promise<Object | void>, void, void> {
    try {
      yield new Api().get("/api/auth/logout");
      this.token = undefined;
      this.userLogin = undefined;
    } catch (err) {
      console.log(err);
    }
  }

  *refresh(): Generator<Promise<Object | void>, void, IUserData> {
    try {
      const response = yield new Api().get("/api/auth/refresh");
      if (response?.accessToken) {
        this.token = response.accessToken;
        this.userLogin = response.user.login;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
