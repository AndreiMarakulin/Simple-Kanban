import { flow, makeAutoObservable } from "mobx";
import { deleteAPI, getAPI, postAPI } from "../utils/api";
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

  *getBoards(): Generator<Promise<IBoard[]>, void, IBoard[]> {
    const result = yield getAPI("boards", {}, this.AuthStore.token);
    this.boards = result;
  }

  *createBoard(newBoard: INewBoard): Generator<Promise<IBoard>, void, IBoard> {
    const result = yield postAPI("boards", newBoard);
    if (result) {
      this.boards.push(result);
    }
  }

  *deleteBoard(boardId: number): Generator<Promise<boolean>, void, boolean> {
    if (yield deleteAPI(`boards/${boardId}`)) {
      this.boards = this.boards.filter((board) => board.id !== boardId);
    }
  }

  setCurrentBoard(board: IBoard) {
    this.currentBoard = board;
  }
}
