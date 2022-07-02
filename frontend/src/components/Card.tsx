import { Draggable } from "@react-forked/dnd";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Card } from "react-bootstrap";
import { ICard } from "../store/CardStore";
import { DateTime } from "luxon";

interface TaskCardProps {
  card: ICard;
  index: number;
}

const TaskCard: FC<TaskCardProps> = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="myCard"
        >
          <Card.Body>
            <Card.Title>{card.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Author: @{card.authorLogin}
            </Card.Subtitle>
            {card.categoryTitle ? (
              <Card.Subtitle className="mb-2">
                Category: {card.categoryTitle}
              </Card.Subtitle>
            ) : null}
            {card.deadline ? (
              <Card.Subtitle className="mb-1">
                Deadline:{" "}
                {DateTime.fromISO(card.deadline).toFormat("dd.MM.yyyy")}
              </Card.Subtitle>
            ) : null}
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

export default observer(TaskCard);
