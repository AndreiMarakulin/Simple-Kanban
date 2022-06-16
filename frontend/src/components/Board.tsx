import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Store, useStore } from "../store";
import CreateCardModal from "./modals/CreateCardModal";
import { DragDropContext, Droppable, DropResult } from "@react-forked/dnd";
import List from "./List";

const Board: FC = () => {
  const store: Store = useStore();
  // FIXME задваивание модальных окон
  const [createCardVisible, setCreateCardVisible] = useState(false);

  const onDragEnd = (result: DropResult): void => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    store.CardStore.changeCardOrder(destination, source, draggableId)
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container className="cardList">
        {store.CardStore.lists.map((list) => (
          <div key={list.id} className="list">
            <div className="listTitle">{list.title}</div>
            <Droppable droppableId={list.id.toString()}>
              {(provided, snapshot) => (
                <List provided={provided} snapshot={snapshot} list={list} />
              )}
            </Droppable>
            <Button variant="light" onClick={() => setCreateCardVisible(true)}>
              + Добавить новую карточку
            </Button>
            <CreateCardModal
              key={list.id}
              isShown={createCardVisible}
              onHide={() => setCreateCardVisible(false)}
            />
          </div>
        ))}
      </Container>
    </DragDropContext>
  );
};

export default observer(Board);
