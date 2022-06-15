import { flow, makeAutoObservable } from "mobx";
import { getAPI, postAPI } from "../utils/api";

export interface ICard {
  id: number;
  title: string;
  authorLogin: string;
  description: string | undefined;
  listTitel: string;
  boardId: number;
  categoryTitle: string | undefined;
  deadline: number | undefined;
  createdAt: string;
  updatedAt: string | undefined;
}

export interface INewCard {
  title: string;
  authorId: number;
  boardId: number;
  description: string | undefined;
  categoryId: number | undefined;
  listId: number;
  deadline: string | undefined;
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

  *createCard(newCard: INewCard): Generator<Promise<ICard>, void, ICard> {
    const result = yield postAPI("cards", newCard);
    console.log(result);
    if (result) {
      this.cards.push({...result, listTitel: "Done", boardId: newCard.boardId, authorLogin: "admin"});
    }
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
