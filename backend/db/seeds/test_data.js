const bcrypt = require("bcrypt");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

cards = [];

async function getCardOrder(cards) {
  const cardOrder = [];
  for (let card of cards) {
    const boardList = cardOrder.find((elem) => elem.board_id === card.boardId && elem.list_id === card.listId)
    if (boardList) {
      boardList.order.push(card.cardId);
    } else {
      cardOrder.push({ board_id: card.boardId, list_id: card.listId, order: [card.cardId] });
    }
  }
  return cardOrder
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex.raw(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE "board" RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE "card" RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE "list" RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE "category" RESTART IDENTITY CASCADE`);

  await knex("user").insert([
    {
      login: "admin",
      password: await bcrypt.hash("admin", 5),
      name: "admin",
      role: "ADMIN",
      status: "ACTIVE",
    },
    {
      login: "user",
      password: await bcrypt.hash("user", 5),
      name: "user",
      role: "USER",
      status: "ACTIVE",
    },
    {
      login: "andrei",
      password: await bcrypt.hash("andrei", 5),
      name: "andrei",
      role: "ADMIN",
      status: "ACTIVE",
    },
  ]);

  await knex("board").insert([
    {
      title: "Demo",
      description: "Demo",
      owner_id: 3,
      created_at: new Date().toUTCString(),
    },
    {
      title: "Sample board 2",
      description: "Sample board 2",
      owner_id: 1,
      created_at: new Date().toUTCString(),
    },
  ]);

  await knex("user_board").insert([
    { user_id: 1, board_id: 1 },
    { user_id: 1, board_id: 2 },
    { user_id: 2, board_id: 2 },
    { user_id: 3, board_id: 1 },
    { user_id: 3, board_id: 2 },
  ]);

  await knex("list").insert([
    { title: "ToDo" },
    { title: "In Progress" },
    { title: "Done" },
  ]);

  await knex("category").insert([
    { title: "Backend" },
    { title: "Frontend" },
    { title: "Deploy" },
  ]);

  await knex("card").insert(
    Array.from({ length: 18 }).map((_, idx) => {
      const listId = getRndInteger(1, 4);
      cards.push({ boardId: 2, listId, cardId: idx + 1 });
      return {
        title: `Task ${idx + 1}`,
        description: `This is sample task ${idx + 1}`,
        author_id: getRndInteger(1, 4),
        list_id: listId,
        category_id: getRndInteger(1, 4),
        deadline: new Date(
          new Date().getTime() + getRndInteger(1, 20) * 24 * 60 * 60 * 1000
        ).toUTCString(),
        created_at: new Date().toUTCString(),
      };
    })
  );

  await knex("board_card").insert(
    cards.map((card) => {
      return {
        card_id: card.cardId,
        board_id: card.boardId,
      };
    })
  );

  const CardOrder = await getCardOrder(cards);
  await knex("card_order").insert(
    await CardOrder.map((item) => {
      return item;
    })
  );
};
