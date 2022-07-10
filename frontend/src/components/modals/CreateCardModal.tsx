import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import {
  Button,
  Form,
  Modal,
  FloatingLabel,
  InputGroup,
} from "react-bootstrap";
import { IList, INewCard } from "../../store/CardStore";
import { useStore } from "../../store";
import { DateTime } from "luxon";

interface ModalProps {
  currentList: IList;
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
  deadline: Number(new Date()),
};

const CreateCard: FC<ModalProps> = ({ currentList, isShown, onHide }) => {
  const { BoardStore, CardStore, AuthStore } = useStore();
  const [newCard, setNewCard] = useState<INewCard>(defaultCard);
  const [enterDeadline, setEnterDeadline] = useState(false);

  const closeModal = () => {
    setNewCard(defaultCard);
    setEnterDeadline(false);
    onHide();
  };

  return (
    <Modal show={isShown} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Новая задача</Modal.Title>
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
          <FloatingLabel
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              console.log(e.target.value);
              setNewCard({
                ...newCard,
                listId: e.target.value !== "" ? Number(e.target.value) : NaN,
              })
            }
            }
            className="mb-3"
            label="Статус задачи"
          >
            <Form.Select>
              <option key={currentList.id} value={currentList.id}>
                {currentList.title}
              </option>
              {CardStore.lists
                .filter((list) => list.id !== currentList.id)
                .map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
            </Form.Select>
          </FloatingLabel>

          {/* <FloatingLabel className="mb-3" label="Категория">
            <Form.Control
              disabled
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
          </FloatingLabel> */}
          {/* TODO форматирование даты */}
          <InputGroup className="mb-3">
            <InputGroup.Text >Срок исполнения</InputGroup.Text>
            <InputGroup.Checkbox
              checked={enterDeadline}
              onChange={()=> setEnterDeadline(!enterDeadline)}
              aria-label="enterDeadline"
            />
            <Form.Control
              disabled={!enterDeadline}
              type="date"
              min="2000-01-01"
              max="2099-12-31"
              placeholder="Enter deadline"
              onChange={(e) => {
                setNewCard({
                  ...newCard,
                  deadline:
                    e.target.value !== ""
                      ? DateTime.fromISO(e.target.value).toMillis()
                      : newCard.deadline,
                });
              }}
              value={DateTime.fromMillis(newCard.deadline).toFormat(
                "yyyy-MM-dd"
              )}
            />
          </InputGroup>
          <FloatingLabel className="mb-3" label="Автор задачи">
            <Form.Control
              disabled
              type="text"
              value={"@" + AuthStore.user?.login}
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
            // FIXME проверка на текущей доски на правильность данных
            CardStore.createCard({
              ...newCard,
              boardId: BoardStore.currentBoard ? BoardStore.currentBoard.id : 0,
              deadline: enterDeadline ? newCard.deadline : NaN,
              listId: newCard.listId ? newCard.listId : currentList.id,
              authorId: AuthStore.user ? AuthStore.user.id : 0,
            });
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
