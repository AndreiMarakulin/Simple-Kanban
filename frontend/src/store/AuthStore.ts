import { computed, flow, makeAutoObservable } from "mobx";
import { getAPI, postAPI } from "../utils/api";

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

  *login(
    login: string,
    password: string
  ): Generator<Promise<IUserData>, boolean, IUserData> {
    try {
      const response = yield postAPI("auth/login", { login, password });
      if (response.accessToken) {
        this.token = response.accessToken;
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.log(err);
    }
    return this.isAuth
  }

  *registration(
    login: string,
    password: string
  ): Generator<Promise<IUserData>, boolean, IUserData> {
    try {
      const response = yield postAPI("auth/registration", { login, password });
      if (response.accessToken) {
        this.token = response.accessToken;
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.log(err);
    }
    return this.isAuth
  }

  *logout(): Generator<Promise<void>, void, void> {
    try {
      yield getAPI("auth/logout", {}, this.token);
      this.token = undefined;
    } catch (err) {
      console.log(err);
    }
  }

  *refresh(): Generator<Promise<IUserData>, void, IUserData> {
    try {
      const response = yield getAPI("auth/refresh");
      if (response.accessToken) {
        this.token = response.accessToken;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
