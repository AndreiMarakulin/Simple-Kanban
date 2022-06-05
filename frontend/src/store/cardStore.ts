import { flow, makeAutoObservable } from "mobx";
import { getAPI } from "../utils/api";

export interface ICard {
  id: number;
  title: string;
  authorLogin: string;
  description: string | null;
  listTitel: string | null;
  boardId: number;
  categoryTitle: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export class CardStore {
  cards: ICard[] = [];

  constructor() {
    makeAutoObservable(this, {
      getCards: flow,
    });
  }

  *getCards(boardId: number): Generator<Promise<ICard[]>, void, ICard[]> {
    const result = yield getAPI("cards", { boardId: boardId.toString() });
    this.cards = result;
  }
}
