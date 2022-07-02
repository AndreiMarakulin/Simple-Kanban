import { DraggableLocation } from "@react-forked/dnd";
import { flow, makeAutoObservable, runInAction } from "mobx";
import Api from "../utils/ApiHttp";
import { AuthStore } from "./AuthStore";

export interface ICard {
  id: number;
  title: string;
  authorLogin: string;
  description: string | undefined;
  listId: number;
  boardId: number;
  categoryTitle: string | undefined;
  deadline: string | undefined;
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
  deadline: number;
}

export interface IList {
  id: number;
  title: string;
  cardOrder: number[];
}

export class CardStore {
  AuthStore: AuthStore;
  cards: ICard[] = [];
  lists: IList[] = [];

  constructor(AuthStore: AuthStore) {
    makeAutoObservable(this, {
      createCard: flow,
    });
    this.AuthStore = AuthStore;
  }

  async getCardsAndOrder(boardId: number) {
    if (!boardId) return;
    const [cards, lists] = await Promise.all([
      new Api(this.AuthStore).get("/api/cards", {
        boardId: boardId.toString(),
      }) as Promise<ICard[]>,
      new Api(this.AuthStore).get(
        `/api/boards/${boardId}/cardOrder`
      ) as Promise<IList[]>,
    ]);
    runInAction(() => {
      this.cards = cards;
      this.lists = lists;
    });
  }

  async changeCardOrder(
    destination: DraggableLocation,
    source: DraggableLocation,
    draggableId: string,
    boardId: number
  ): Promise<void> {
    const sourceList = this.lists.find(
      (list) => list.id === Number(source.droppableId)
    );
    if (sourceList === undefined) {
      throw new TypeError("sourceList is undefined");
    }
    const destinationList = this.lists.find(
      (list) => list.id === Number(destination.droppableId)
    );
    if (destinationList === undefined) {
      throw new TypeError("destinationList is undefined");
    }
    sourceList.cardOrder.splice(source.index, 1);
    destinationList.cardOrder.splice(destination.index, 0, Number(draggableId));
    // TODO Переделать на WS
    await new Api(this.AuthStore).put(`/api/boards/${boardId}/cardOrder`, {
      sourceList: {
        id: sourceList.id,
        cardOrder: sourceList.cardOrder,
      },
      destinationList: {
        id: destinationList.id,
        cardOrder: destinationList.cardOrder,
      },
    });
  }

  *createCard(
    newCard: INewCard
  ): Generator<Promise<Object | void>, void, ICard> {
    const result = yield new Api(this.AuthStore).post("/api/cards", newCard);
    if (result) {
      this.cards.push({
        ...result,
        listId: newCard.listId,
        boardId: newCard.boardId,
        authorLogin: "admin",
        deadline: newCard.deadline ? new Date(newCard.deadline).toISOString() : undefined,
      });
      this.lists
        .find((list) => list.id === newCard.listId)!
        .cardOrder.push(result.id);
    }
  }
}
