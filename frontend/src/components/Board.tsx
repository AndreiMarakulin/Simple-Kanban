import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Card, Container } from "react-bootstrap";
import { Store, useStore } from "../store";
import { ICard } from "../store/cardStore";

const Board: FC = () => {
  const store: Store = useStore();

  return (
    <Container className="cardList">
      {store.CardStore.lists.map((list, idx) => (
        <div key={idx} className="list">
          <div className="listTitle">{list}</div>
          {store.CardStore.cards
            ?.filter((card) => card.listTitel === list)
            .map((card: ICard) => (
              <Card draggable className="myCard" key={card.id} >
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Author: @{card.authorLogin}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2">
                  Category: {card.categoryTitle}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-1">
                  Deadline: {card.deadline}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            ))}
        </div>
      ))}
    </Container>
  );
};

export default observer(Board);
