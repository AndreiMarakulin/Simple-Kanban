import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Store, useStore } from "../store";
import { IBoard } from "../store/boardStore";
import CreateBoard from "./createBoardModal";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";

const BoardsList = () => {
  const store: Store = useStore();
  useEffect(() => {
    const test = async () => {
      await store.BoardStore.getBoards();
      store.BoardStore.setCurrentBoard(store.BoardStore.boards[0]);
      store.CardStore.getCards(store.BoardStore.currentBoard?.id);
    };
    test();
  }, [store.BoardStore, store.CardStore]);

  return (
    <div>
      <ListGroup>
        {store.BoardStore?.boards.map((board: IBoard) => (
          <ListGroupItem
            active={board === store.BoardStore.currentBoard}
            key={board.id}
            onClick={() => {
              store.BoardStore.setCurrentBoard(board);
              store.CardStore.getCards(board.id);
            }}
            className="boardList__board"
          >
            {board.title}
            <DeleteIcon
              className={
                board === store.BoardStore.currentBoard
                  ? "boardList__deleteIcon_active"
                  : "boardList__deleteIcon_inactive"
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                store.BoardStore.deleteBoard(board.id);
              }}
            />
          </ListGroupItem>
        ))}
      </ListGroup>
      <ListGroupItem
        className="newBoard"
        onClick={() => store.BoardStore.showCreateBoardForm()}
      >
        Новая доска
      </ListGroupItem>
      <CreateBoard />
    </div>
  );
};

export default observer(BoardsList);
