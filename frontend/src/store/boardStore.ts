import {flow, makeAutoObservable} from 'mobx';
import { getAPI } from '../utils/api';

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

  constructor() {
    makeAutoObservable(this, {
      getBoards: flow,
    });
    this.getBoards();
    // TODO получить доску по умолчанию после загрузки приложения
    // this.currentBoard = this.boards[0];
  }

  *getBoards(): Generator<Promise<IBoard[]>, void, IBoard[]> {
    const result = yield getAPI("boards");
    this.boards = result;
  }

  setCurrentBoard(board: IBoard) {
    this.currentBoard = board;
  }
}