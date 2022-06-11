import {flow, makeAutoObservable} from 'mobx';
import { deleteAPI, getAPI, postAPI } from '../utils/api';

export interface IBoard {
  id: number;
  title: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string | null;
}

export class BoardStore {
  boards: IBoard[] = [];
  currentBoard: IBoard | undefined;
  createBoardVisibility: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      getBoards: flow,
      createBoard: flow,
      deleteBoard: flow,
    });
  }

  *getBoards(): Generator<Promise<IBoard[]>, void, IBoard[]> {
    const result = yield getAPI("boards");
    this.boards = result;
  }

  // FIXME types
  *createBoard(data: any): Generator<Promise<IBoard>, void, IBoard> {
    const result = yield postAPI("boards", {
      title: data.title,
      description: data.description,
      owner_id: data.authorId,
    });
    if (result) {
      this.boards.push(result);
    }
  }

  *deleteBoard(boardId: number): Generator<Promise<boolean>, void, boolean> {
    if (yield deleteAPI(`boards/${boardId}`)) {
      this.boards = this.boards.filter(board => board.id !== boardId);
    }
  }

  setCurrentBoard(board: IBoard) {
    this.currentBoard = board;
  }

  showCreateBoardForm(): void {
    this.createBoardVisibility = true;
  }

  hideCreateBoardForm(): void {
    this.createBoardVisibility = false;
  }
}