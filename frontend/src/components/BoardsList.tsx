import { observer } from "mobx-react-lite";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useStore, Store } from "../store";
import { IBoard } from "../store/boardStore";

const BoardsList = observer(() => {
  const store: Store = useStore();

  return (
    <div>
      <ListGroup>
        {store.BoardStore?.boards.map((board: IBoard) => (
          <ListGroupItem
            active={board === store.BoardStore.currentBoard}
            key={board.id}
            onClick={() => {
              store.BoardStore.setCurrentBoard(board);
            }}
          >
            {board.title}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
});

export default BoardsList;
