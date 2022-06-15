import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { Button, Form, Modal, FloatingLabel } from "react-bootstrap";
import { INewCard } from "../../store/CardStore";
import { Store, useStore } from "../../store";

interface ModalProps {
  isShown: boolean;
  onHide: () => void;
}

const defaultCard: INewCard = {
  title: "",
  authorId: NaN,
  boardId: NaN,
  description: undefined,
  categoryId: undefined,
  listId: NaN,
  deadline: undefined,
};

const CreateCard: FC<ModalProps> = ({ isShown, onHide }) => {
  const store: Store = useStore();
  const [newCard, setNewCard] = useState<INewCard>(defaultCard);

  const closeModal = () => {
    setNewCard(defaultCard);
    onHide();
  };

  return (
    <Modal show={isShown} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Новая карточка</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <FloatingLabel className="mb-3" label="Название задачи">
            <Form.Control
              type="text"
              placeholder="Enter title"
              onChange={(e) =>
                setNewCard({ ...newCard, title: e.target.value })
              }
              value={newCard.title}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Описание задачи">
            <Form.Control
              as="textarea"
              style={{ height: "100px" }}
              placeholder="Enter description"
              onChange={(e) => {
                setNewCard({
                  ...newCard,
                  description:
                    e.target.value !== "" ? e.target.value : undefined,
                });
              }}
              value={newCard.description || ""}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="AuthorId">
            <Form.Control
              type="text"
              placeholder="Enter AuthorId"
              onChange={(e) =>
                setNewCard({
                  ...newCard,
                  authorId:
                    e.target.value !== "" ? Number(e.target.value) : NaN,
                })
              }
              value={isNaN(newCard.authorId) ? "" : newCard.authorId}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="listId">
            <Form.Control
              type="text"
              placeholder="Enter listId"
              onChange={(e) =>
                setNewCard({
                  ...newCard,
                  listId: e.target.value !== "" ? Number(e.target.value) : NaN,
                })
              }
              value={isNaN(newCard.listId) ? "" : newCard.listId}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Категория">
            <Form.Control
              type="text"
              placeholder="Enter categoryId"
              onChange={(e) => {
                setNewCard({
                  ...newCard,
                  categoryId:
                    e.target.value !== "" ? Number(e.target.value) : undefined,
                });
              }}
              value={newCard.categoryId || ""}
            />
          </FloatingLabel>
          {/* TODO форматирование даты */}
          <FloatingLabel className="mb-3" label="deadline">
            <Form.Control
              type="text"
              placeholder="Enter deadline"
              onChange={(e) => {
                setNewCard({
                  ...newCard,
                  deadline: e.target.value !== "" ? e.target.value : undefined,
                });
              }}
              value={newCard.deadline || ""}
            />
          </FloatingLabel>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Отмена
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            console.log({...newCard, boardId: store.BoardStore.currentBoard ? store.BoardStore.currentBoard.id : 0});
            // FIXME проверка на текущей доски на правильность данных
            store.CardStore.createCard({...newCard, boardId: store.BoardStore.currentBoard ? store.BoardStore.currentBoard.id : 0});
            closeModal();
          }}
        >
          Создать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(CreateCard);
