import { DraggableLocation } from "@react-forked/dnd";
import { flow, makeAutoObservable, runInAction } from "mobx";
import { getAPI, postAPI, putAPI } from "../utils/api";

export interface ICard {
  id: number;
  title: string;
  authorLogin: string;
  description: string | undefined;
  listId: number;
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
  deadline: number;
}

export interface IList {
  id: number;
  title: string;
  cardOrder: number[];
}

export class CardStore {
  cards: ICard[] = [];
  lists: IList[] = [];

  constructor() {
    makeAutoObservable(this, {
      createCard: flow,
    });
  }

  async getCardsAndOrder(boardId: number) {
    if (!boardId) return;
    const [cards, lists] = await Promise.all([
      getAPI("cards", { boardId: boardId.toString() }) as Promise<ICard[]>,
      getAPI(`boards/${boardId}/cardOrder`) as Promise<IList[]>,
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
    await putAPI(`boards/${boardId}/cardOrder`, {
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

  *createCard(newCard: INewCard): Generator<Promise<ICard>, void, ICard> {
    const result = yield postAPI("cards", newCard);
    if (result) {
      this.cards.push({
        ...result,
        listId: newCard.listId,
        boardId: newCard.boardId,
        authorLogin: "admin",
      });
      this.lists
        .find((list) => list.id === newCard.listId)!
        .cardOrder.push(result.id);
    }
  }
}
