import {makeAutoObservable} from 'mobx';

export interface IBoard {
  id: number;
  title: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string | null;
}

export class BoardStore {
  boards: IBoard[] = [
    {
      id: 1,
      title: "board1",
      description: "Sample board 1",
      owner_id: 1,
      created_at: "2022-05-15T07:45:33.000Z",
      updated_at: null,
    },
    {
      id: 2,
      title: "board2",
      description: "Sample board 2",
      owner_id: 2,
      created_at: "2022-05-15T07:45:33.000Z",
      updated_at: null,
    },
    {
      id: 3,
      title: "Change title",
      description: "New descriptioghfhgfn",
      owner_id: 2,
      created_at: "2022-05-15T16:16:46.646Z",
      updated_at: "2022-05-15T11:50:34.027Z",
    },
  ];
  currentBoard: IBoard | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setBoards(boards: IBoard[]) {
    this.boards = boards;
  }

  setCurrentBoard(board: IBoard) {
    this.currentBoard = board;
  }
}