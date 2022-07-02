import { AuthStore, IUserData } from "../store/AuthStore";

export default class Api {
  token?: string;
  AuthStore?: AuthStore;

  constructor(AuthStore?: AuthStore) {
    this.token = AuthStore?.token;
    this.AuthStore = AuthStore;
  }

  get headers(): Headers {
    return new Headers({
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      "Content-Type": "application/json",
    });
  }

  async send(request: Request): Promise<Object | void> {
    let response = await fetch(request);
    if (response.status === 401 && !request.url.includes("/api/auth/refresh")) {
      response = await this.refreshResend(request);
    }

    if (!response.headers.get("Content-Type")?.includes("application/json")) {
      return;
    }
    const body = (await response.json()) as Object;

    if (response.status >= 400 && response.status !== 401) {
      console.log(body);
      return body;
    }
    return body;
  }

  async refreshResend(request: Request) {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "GET",
        headers: this.headers,
        credentials: "include",
      });
      if (response.status === 200) {
        const body = (await response.json()) as IUserData;
        this.token = body.accessToken;
        this.AuthStore?.changeToken(body.accessToken);
        request.headers.set("Authorization", `Bearer ${body.accessToken}`);
      }
    } catch (err) {
      console.log(err);
    }
    return await fetch(request);
  }

  async get(
    path: string,
    fields?: Record<string, string>
  ): Promise<Object | void> {
    const params = new URLSearchParams({
      ...(fields ? fields : {}),
    });

    return this.send(
      new Request(`${path}?${params.toString()}`, {
        method: "GET",
        headers: this.headers,
        credentials: "include",
      })
    );
  }

  async post(path: string, payload: Object): Promise<Object | void> {
    return this.send(
      new Request(path, {
        method: "POST",
        headers: this.headers,
        credentials: "include",
        body: JSON.stringify(payload),
      })
    );
  }

  async put(path: string, payload: Object): Promise<Object | void> {
    return this.send(
      new Request(path, {
        method: "PUT",
        headers: this.headers,
        credentials: "include",
        body: JSON.stringify(payload),
      })
    );
  }

  async delete(path: string): Promise<Object | void> {
    return this.send(
      new Request(path, {
        method: "DELETE",
        headers: this.headers,
        credentials: "include",
      })
    );
  }
}
