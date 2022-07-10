import { computed, flow, makeAutoObservable } from "mobx";
import Api from "../utils/ApiHttp";
import { IUser } from "./AdminStore";

export interface IUserData {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export class AuthStore {
  token: string | undefined = undefined;
  user: IUser | undefined;

  constructor() {
    makeAutoObservable(this, {
      login: flow,
      logout: flow,
      registration: flow,
      isAuth: computed,
      isAdmin: computed,
    });
  }

  get isAuth(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    return this.user?.role === "ADMIN";
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
        this.user = this.parseToken(this.token);
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
        this.user = this.parseToken(this.token);
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
      this.user = undefined;
    } catch (err) {
      console.log(err);
    }
  }

  *refresh(): Generator<Promise<Object | void>, boolean, IUserData> {
    try {
      const response = yield new Api().get("/api/auth/refresh");
      if (response?.accessToken) {
        this.token = response.accessToken;
        this.user = this.parseToken(this.token);
      }
    } catch (err) {
      console.log(err);
    }
    return this.isAuth;
  }

  parseToken(token: string): IUser {
    const [, payload, ] = token.split(".");
    const userData = JSON.parse(atob(payload));
    return userData;
  }
}
