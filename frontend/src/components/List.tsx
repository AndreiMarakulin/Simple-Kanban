import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import { Store, useStore } from "../store";
import { IList } from "../store/CardStore";
import TaskCard from "./Card";
import { DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";

interface ListProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  list: IList;
}

const List: FC<ListProps> = ({ provided, snapshot, list }) => {
  const store: Store = useStore();

  return (
    <div ref={provided.innerRef} {...provided.droppableProps}>
      {list.cardOrder.map((cardId, index) => (
        <TaskCard
          key={cardId}
          card={store.CardStore.cards.filter((card) => card.id === cardId)[0]}
          index={index}
        />
      ))}
      {provided.placeholder}
    </div>
  );
};

export default observer(List);
