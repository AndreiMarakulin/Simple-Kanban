import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { Button, Form, Modal, FloatingLabel } from "react-bootstrap";
import { Store, useStore } from "../../store";
import { INewBoard } from "../../store/BoardStore";

interface ModalProps {
  isShown: boolean;
  onHide: () => void;
}

const defaultBoard: INewBoard = {
  title: "",
  description: undefined,
  owner_id: NaN,
};

const CreateBoard: FC<ModalProps> = ({ isShown, onHide }) => {
  const store: Store = useStore();
  const [newBoard, setNewBoard] = useState<INewBoard>(defaultBoard);

  const closeModal = () => {
    setNewBoard(defaultBoard);
    onHide();
  };

  return (
    <Modal show={isShown} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Создание канбан-доски</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <FloatingLabel className="mb-3" label="Название канбан-доски">
            <Form.Control
              type="text"
              placeholder="Enter title"
              onChange={(e) =>
                setNewBoard({ ...newBoard, title: e.target.value })
              }
              value={newBoard.title}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Описание канбан-доски">
            <Form.Control
              as="textarea"
              style={{ height: "100px" }}
              placeholder="Enter вescription"
              onChange={(e) => {
                if (e.target.value !== "")
                  setNewBoard({
                    ...newBoard,
                    description:
                      e.target.value !== "" ? e.target.value : undefined,
                  });
              }}
              value={newBoard.description || ""}
            />
          </FloatingLabel>
          {/* TODO убрать после перехода на систему авторизации */}
          <FloatingLabel className="mb-3" label="AuthorId">
            <Form.Control
              type="text"
              placeholder="Enter AuthorId"
              onChange={(e) =>
                setNewBoard({
                  ...newBoard,
                  owner_id:
                    e.target.value !== "" ? Number(e.target.value) : NaN,
                })
              }
              value={isNaN(newBoard.owner_id) ? "" : newBoard.owner_id}
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
            store.BoardStore.createBoard(newBoard);
            closeModal();
          }}
        >
          Создать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(CreateBoard);
