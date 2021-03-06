import { DraggableLocation } from "react-beautiful-dnd";
import { flow, makeAutoObservable, runInAction } from "mobx";
import Api from "../utils/ApiHttp";
import { AuthStore } from "./AuthStore";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from ".";

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
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  currentBoardId: number | undefined;
  cards: ICard[] = [];
  lists: IList[] = [];

  constructor(AuthStore: AuthStore, socket: Socket) {
    makeAutoObservable(this, {
      createCard: flow,
    });
    this.AuthStore = AuthStore;
    this.socket = socket;

    this.socket.on("changeCardOrder", ({boardId, sourceList, destinationList}) => {
      if (boardId === this.currentBoardId) {
        runInAction(() => {
          this.lists.find((list) => list.id === sourceList.id)!.cardOrder = sourceList.cardOrder;
          this.lists.find((list) => list.id === destinationList.id)!.cardOrder = destinationList.cardOrder;
        });
      }
    })
  }

  async getCardsAndOrder(boardId: number) {
    if (!boardId) return;
    this.currentBoardId = boardId;
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
    this.socket.emit("changeCardOrder", {
      boardId: boardId,
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
        authorLogin: this.AuthStore.user ? this.AuthStore.user.login : "",
        deadline: newCard.deadline
          ? new Date(newCard.deadline).toISOString()
          : undefined,
      });
      this.lists
        .find((list) => list.id === newCard.listId)!
        .cardOrder.push(result.id);
    }
  }
}
