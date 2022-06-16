const bcrypt = require("bcrypt");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

cards = [];

// TODO - refactor this function
async function getCardOrder(cards) {
  temp = {};
  cards.map((card) => {
    if (!temp[card.boardId]) {
      temp[card.boardId] = {};
    }
    if (!temp[card.boardId][card.listId]) {
      temp[card.boardId][card.listId] = [];
    }
    temp[card.boardId][card.listId].push(card.cardId);
  });
  result = [];
  Object.keys(temp).map((boardId) => {
    Object.keys(temp[boardId]).map((listId) => {
      result.push({
        board_id: boardId,
        list_id: listId,
        order: temp[boardId][listId],
      });
    });
  });
  return result;
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
      login: "user1",
      password: await bcrypt.hash("user1", 5),
      name: "user1",
      role: "USER",
      status: "ACTIVE",
    },
    {
      login: "user2",
      password: await bcrypt.hash("user2", 5),
      name: "user2",
      role: "USER",
      status: "ACTIVE",
    },
  ]);

  await knex("board").insert([
    {
      title: "board1",
      description: "Sample board 1",
      owner_id: 1,
      created_at: new Date().toUTCString(),
    },
    {
      title: "board2",
      description: "Sample board 2",
      owner_id: 2,
      created_at: new Date().toUTCString(),
    },
  ]);

  await knex("user_board").insert([
    { user_id: 1, board_id: 1 },
    { user_id: 1, board_id: 2 },
    { user_id: 2, board_id: 1 },
    { user_id: 2, board_id: 2 },
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
    Array.from({ length: 30 }).map((_, idx) => {
      const listId = getRndInteger(1, 4);
      cards.push({ boardId: getRndInteger(1, 3), listId, cardId: idx + 1 });
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
