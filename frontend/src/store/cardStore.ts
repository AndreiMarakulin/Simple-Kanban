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
  lists: string[] = [];

  constructor() {
    makeAutoObservable(this, {
      getCards: flow,
    });
  }

  *getCards(boardId: number | undefined): Generator<Promise<ICard[]>, void, ICard[]> {
    if (!boardId) return;
    const result = yield getAPI("cards", { boardId: boardId.toString() });
    this.cards = result;
    this.lists = this.getLists();
  }

  getLists(): string[] {
    const listSet = new Set<string>();
    this.cards.forEach((card) => {
      if (card.listTitel) {
        listSet.add(card.listTitel);
      }
    });
    return Array.from(listSet);
  }
}
