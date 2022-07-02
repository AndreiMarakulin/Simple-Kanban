import { createContext, useContext } from "react";
import { AuthStore } from "./AuthStore";
import { BoardStore } from "./BoardStore";
import { CardStore } from "./CardStore";

class Store {
    BoardStore: BoardStore;
    CardStore: CardStore;
    AuthStore: AuthStore;

    constructor() {
        this.AuthStore = new AuthStore();
        this.BoardStore = new BoardStore(this.AuthStore);
        this.CardStore = new CardStore(this.AuthStore);
    }
}

const StoreContext = createContext<Store>(new Store());


const useStore = () => {
    return useContext(StoreContext);
  };

export {Store, StoreContext, useStore};