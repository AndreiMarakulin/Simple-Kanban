import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { Store, useStore } from "../store";
import { ICard } from "../store/CardStore";
import CreateCardModal from "./modals/CreateCardModal";

const Board: FC = () => {
  const store: Store = useStore();
  // FIXME задваивание модальных окон
  const [createCardVisible, setCreateCardVisible] = useState(false);

  return (
    <Container className="cardList">
      {store.CardStore.lists.map((list, idx) => (
        <div key={idx} className="list">
          <div className="listTitle">{list}</div>
          {store.CardStore.cards
            ?.filter((card) => card.listTitel === list)
            .map((card: ICard) => (
              <Card draggable className="myCard" key={card.id}>
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
          <Button variant="light" onClick={() => setCreateCardVisible(true)}>
            + Добавить новую карточку
          </Button>
          <CreateCardModal
            key={idx}
            isShown={createCardVisible}
            onHide={() => setCreateCardVisible(false)}
          />
        </div>
      ))}
    </Container>
  );
};

export default observer(Board);
