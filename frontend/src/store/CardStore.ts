import { DraggableLocation } from "@react-forked/dnd";
import { flow, makeAutoObservable } from "mobx";
import { getAPI, postAPI } from "../utils/api";

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
  deadline: string | undefined;
}

export interface IList {
  id: number;
  title: string;
  cardOrder: number[];
}

export class CardStore {
  cards: ICard[] = [];
  lists: IList[] = [
    { id: 1, title: "ToDo", cardOrder: [] },
    { id: 2, title: "In Progress", cardOrder: [] },
    { id: 3, title: "Done", cardOrder: [] },
  ];

  constructor() {
    makeAutoObservable(this, {
      getCards: flow,
      createCard: flow,
    });
  }

  *getCards(
    boardId: number | undefined
  ): Generator<Promise<ICard[]>, void, ICard[]> {
    if (!boardId) return;
    const result = yield getAPI("cards", { boardId: boardId.toString() });
    this.cards = result;
    this.getCardOrder();
  }

  getCardOrder(): void {
    this.lists.forEach((list) => {
      this.cards
        .filter((card) => card.listId === list.id)
        .map((card) => list.cardOrder.push(card.id));
    });
  }

  changeCardOrder(
    destination: DraggableLocation,
    source: DraggableLocation,
    draggableId: string
  ): void {
    const sourceList = this.lists.find((list) => list.id === Number(source.droppableId));
    if (sourceList === undefined) {
      throw new TypeError("sourceList is undefined");
    }
    const destinationList = this.lists.find((list) => list.id === Number(destination.droppableId));
    if (destinationList === undefined) {
      throw new TypeError("destinationList is undefined");
    }
    sourceList.cardOrder.splice(source.index, 1);
    destinationList.cardOrder.splice(destination.index, 0, Number(draggableId));
  }

  *createCard(newCard: INewCard): Generator<Promise<ICard>, void, ICard> {
    const result = yield postAPI("cards", newCard);
    console.log(result);
    if (result) {
      // TODO Почему при push mobx не перерисовывает компонент??
      this.cards.push({
        ...result,
        boardId: newCard.boardId,
        authorLogin: "admin",
      });
    }
  }
}
