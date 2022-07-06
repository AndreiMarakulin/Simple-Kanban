import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";

import { AuthStore } from "./AuthStore";
import { BoardStore } from "./BoardStore";
import { CardStore } from "./CardStore";

interface IChangeCardOrder {
  sourceList: { id: number; cardOrder: number[] };
  destinationList: { id: number; cardOrder: number[] };
}

interface ServerToClientEvents {
  message: () => void;
  changeCardOrder: (item: IChangeCardOrder) => void;
}

interface ClientToServerEvents {
  message: () => void;
}

class Store {
  BoardStore: BoardStore;
  CardStore: CardStore;
  AuthStore: AuthStore;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.AuthStore = new AuthStore();
    this.socket = io("", {
      transports: ["websocket"],
    });

    this.BoardStore = new BoardStore(this.AuthStore);
    this.CardStore = new CardStore(this.AuthStore, this.socket);

    this.socket.on("connect", () => {
      console.log(this.socket.id);
    });
  }
}

const StoreContext = createContext<Store | undefined>(undefined);

const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("StoreContext must be within StoreContext.Provider");
  }
  return context;
};

export { Store, StoreContext, useStore };
