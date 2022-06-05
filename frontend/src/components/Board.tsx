import React, { FC } from "react";
import { Card } from "react-bootstrap";
import { Store, useStore } from "../store";
import { ICard } from "../store/cardStore";
import './Board.css'

const Board: FC = () => {
  const store: Store = useStore();

  return (
    <div className="cardList">
      {store.CardStore.cards?.map((card: ICard) => (
        <Card className='myCard' key={card.id}>
          <Card.Body>
            <Card.Title>{card.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              @{card.authorLogin}
            </Card.Subtitle>
            <Card.Text>
             {card.description}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Board;
