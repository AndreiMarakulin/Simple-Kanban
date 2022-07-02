import { flow, makeAutoObservable } from "mobx";
import Api from "../utils/ApiHttp";
import { AuthStore } from "./AuthStore";

export interface IBoard {
  id: number;
  title: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface INewBoard {
  title: string;
  description: string | undefined;
  owner_id: number;
}

export class BoardStore {
  AuthStore: AuthStore;
  boards: IBoard[] = [];
  currentBoard: IBoard | undefined;

  constructor(AuthStore: AuthStore) {
    makeAutoObservable(this, {
      getBoards: flow,
      createBoard: flow,
      deleteBoard: flow,
    });
    this.AuthStore = AuthStore;
  }

  *getBoards(): Generator<Promise<Object | void>, void, IBoard[]> {
    const result = yield new Api(this.AuthStore).get("/api/boards");
    this.boards = result;
  }

  *createBoard(
    newBoard: INewBoard
  ): Generator<Promise<Object | void>, void, IBoard> {
    const result = yield new Api(this.AuthStore).post("/api/boards", newBoard);
    if (result) {
      this.boards.push(result);
    }
  }

  *deleteBoard(
    boardId: number
  ): Generator<Promise<Object | void>, void, boolean> {
    const result = yield new Api(this.AuthStore).delete(`/api/boards/${boardId}`);
    if (result) {
      this.boards = this.boards.filter((board) => board.id !== boardId);
    }
  }

  setCurrentBoard(board: IBoard) {
    this.currentBoard = board;
  }
}
