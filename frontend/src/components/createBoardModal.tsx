import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Store, useStore } from "../store";

const CreateBoard = () => {
  const store: Store = useStore();
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [authorId, setAuthorId] = useState("")

  return (
    <Modal
      show={store.BoardStore.createBoardVisibility}
      onHide={() => store.BoardStore.hideCreateBoardForm()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Создание канбан-доски</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} value={title}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAuthorId">
            <Form.Label>Author ID</Form.Label>
            <Form.Control type="text" placeholder="AuthorId" onChange={(e) => setAuthorId(e.target.value)} value={authorId}/>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => store.BoardStore.hideCreateBoardForm()}
        >
          Отмена
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            store.BoardStore.createBoard({title, description, authorId});
            store.BoardStore.hideCreateBoardForm();
          }}
        >
          Создать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(CreateBoard);
