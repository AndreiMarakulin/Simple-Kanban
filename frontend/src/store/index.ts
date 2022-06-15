import { createContext, useContext } from "react";
import { BoardStore } from "./BoardStore";
import { CardStore } from "./CardStore";

class Store {
    BoardStore: BoardStore;
    CardStore: CardStore;

    constructor() {
        this.BoardStore = new BoardStore();
        this.CardStore = new CardStore();
    }
}

const StoreContext = createContext<Store>(new Store());


const useStore = () => {
    return useContext(StoreContext);
  };

export {Store, StoreContext, useStore};