import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useStore } from "../store";
import CreateCardModal from "./modals/CreateCardModal";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import List from "./List";
import { IList } from "../store/CardStore";

const Board: FC = () => {
  const {BoardStore, CardStore} = useStore();
  const [createCardVisible, setCreateCardVisible] = useState(false);
  const [currentList, setCurrentList] = useState<IList | null>(null);

  const setCreateCardVisiblity = (flag:boolean, list: IList): void => {
    setCurrentList(list);
    setCreateCardVisible(flag);
  }
  
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
    if (BoardStore.currentBoard) {
      CardStore.changeCardOrder(destination, source, draggableId, BoardStore.currentBoard.id)
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container className="cardList">
        {CardStore.lists.map((list, index) => (
          <div key={list.id} className="list">
            <div className="listTitle">{list.title}</div>
            <Droppable droppableId={list.id.toString()}>
              {(provided, snapshot) => (
                <List provided={provided} snapshot={snapshot} list={list} />
              )}
            </Droppable>
            <Button variant="light" onClick={() => {setCreateCardVisiblity(true, list)}}>
              + Добавить новую карточку
            </Button>
          </div>
        ))}
        {currentList ? 
        <CreateCardModal
          currentList={currentList}
          isShown={createCardVisible}
          onHide={() => {setCreateCardVisible(false)}}
        /> : null}
      </Container>
    </DragDropContext>
  );
};


// TODO https://egghead.io/lessons/react-persist-list-reordering-with-react-beautiful-dnd-using-the-ondragend-callback
export default observer(Board);
