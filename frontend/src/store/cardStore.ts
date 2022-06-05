import { makeAutoObservable } from "mobx";

export interface ICard {
  id: number;
  title: string;
  authorLogin: string;
  description: string | null;
  listTitel: string | null;
  categoryTitle: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export class CardStore {
  constructor() {
    makeAutoObservable(this);
  }

  cards: ICard[] = [
    {
      id: 1,
      title: "Task 1",
      authorLogin: "user2",
      description: "This is sample task 1",
      listTitel: "ToDo",
      categoryTitle: "Deploy",
      deadline: "2022-05-24T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 2,
      title: "Card title changed by API",
      authorLogin: "user2",
      description: "New text",
      listTitel: "ToDo",
      categoryTitle: "Backend",
      deadline: "2023-06-18T10:32:17.856Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: "2022-05-18T11:24:27.369Z",
    },
    {
      id: 3,
      title: "Task 3",
      authorLogin: "user2",
      description: "This is sample task 3",
      listTitel: "ToDo",
      categoryTitle: "Frontend",
      deadline: "2022-05-22T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 9,
      title: "Task 9",
      authorLogin: "admin",
      description: "This is sample task 9",
      listTitel: "ToDo",
      categoryTitle: "Backend",
      deadline: "2022-05-22T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 11,
      title: "Task 11",
      authorLogin: "user2",
      description: "This is sample task 11",
      listTitel: "ToDo",
      categoryTitle: "Deploy",
      deadline: "2022-05-22T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 12,
      title: "Task 12",
      authorLogin: "user2",
      description: "This is sample task 12",
      listTitel: "ToDo",
      categoryTitle: "Frontend",
      deadline: "2022-05-31T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 17,
      title: "Task 17",
      authorLogin: "admin",
      description: "This is sample task 17",
      listTitel: "ToDo",
      categoryTitle: "Deploy",
      deadline: "2022-05-31T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 20,
      title: "Task 20",
      authorLogin: "user1",
      description: "This is sample task 20",
      listTitel: "ToDo",
      categoryTitle: "Backend",
      deadline: "2022-05-18T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 21,
      title: "Task 21",
      authorLogin: "admin",
      description: "This is sample task 21",
      listTitel: "ToDo",
      categoryTitle: "Deploy",
      deadline: "2022-05-20T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 29,
      title: "Task 29",
      authorLogin: "user1",
      description: "This is sample task 29",
      listTitel: "ToDo",
      categoryTitle: "Deploy",
      deadline: "2022-05-17T07:45:33.000Z",
      createdAt: "2022-05-15T07:45:33.000Z",
      updatedAt: null,
    },
    {
      id: 32,
      title: "Card title changed by API",
      authorLogin: "user1",
      description: "New text",
      listTitel: "ToDo",
      categoryTitle: "Backend",
      deadline: "2023-06-18T10:32:17.856Z",
      createdAt: "2022-05-18T15:33:42.436Z",
      updatedAt: "2022-05-18T11:02:20.333Z",
    },
  ];
}
