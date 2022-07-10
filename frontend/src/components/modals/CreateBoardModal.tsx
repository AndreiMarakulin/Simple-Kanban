import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { Button, Form, Modal, FloatingLabel } from "react-bootstrap";
import { useStore } from "../../store";
import { INewBoard } from "../../store/BoardStore";

interface ModalProps {
  isShown: boolean;
  onHide: () => void;
}

const CreateBoard: FC<ModalProps> = ({ isShown, onHide }) => {
  const { BoardStore, AuthStore } = useStore();
  
  const defaultBoard: INewBoard = {
    title: "",
    description: undefined,
    owner_id: AuthStore.user ? AuthStore.user.id : 0,
  };

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
          <FloatingLabel className="mb-3" label="Создатель доски">
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
            BoardStore.createBoard(newBoard);
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
