import { flow, makeAutoObservable } from "mobx";
import Api from "../utils/ApiHttp";
import { AuthStore } from "./AuthStore";

export interface IUser {
  id: number;
  login: string;
  name: string;
  role: string;
  status?: string;
}

export class AdminStore {
  AuthStore: AuthStore;
  users: IUser[] = [];

  constructor(AuthStore: AuthStore) {
    makeAutoObservable(this, {
      getUsers: flow,
    });
    this.AuthStore = AuthStore;
  }

  *getUsers(): Generator<Promise<Object | void>, IUser[], IUser[]> {
    const result = yield new Api(this.AuthStore).get("/api/users");
    this.users = result;
    return result;
  }

  *changeUserStatus(
    userId: number,
    status: string
  ): Generator<Promise<Object | void>, void, IUser> {
    const result = yield new Api(this.AuthStore).put(`/api/users/${userId}`, {
      status,
    });
    this.users.find((user) => user.id === userId)!.status = result.status;
  }
}
