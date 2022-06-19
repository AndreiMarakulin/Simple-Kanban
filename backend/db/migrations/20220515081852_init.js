/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("login", 256).notNullable().unique().index();
    table.string("password", 2048).notNullable();
    table.string("name", 2048);
    table.string("role", 256).notNullable();
    table.string("status", 256).notNullable();
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable();
    table.timestamp("deleted_at", { useTz: false }).nullable().index();
  });

  await knex.schema.createTable("token", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("user.id");
    table.string("token").notNullable().unique().index();
  })

  await knex.schema.createTable("board", (table) => {
    table.increments("id").primary;
    table.string("title", 2048).notNullable();
    table.string("description");
    table.integer("owner_id").references("user.id");
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable();
    table.timestamp("deleted_at", { useTz: false }).nullable().index();
  });

  await knex.schema.createTable("list", (table) => {
    table.increments("id").primary;
    table.string("title", 2048).notNullable();
  });

  await knex.schema.createTable("category", (table) => {
    table.increments("id").primary;
    table.string("title", 2048).notNullable();
  });

  await knex.schema.createTable("card", (table) => {
    table.increments("id").primary;
    table.string("title", 2048).notNullable();
    table.integer("author_id").references("user.id");
    table.string("description");
    table.integer("list_id").references("list.id");
    table.integer("category_id").references("category.id");
    table.timestamp("deadline", { useTz: false });
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable();
    table.timestamp("deleted_at", { useTz: false }).nullable().index();
  });

  await knex.schema.createTable("user_board", (table) => {
    table.increments("id").primary;
    table.integer("user_id").references("user.id");
    table.integer("board_id").references("board.id");
  });

  await knex.schema.createTable("board_card", (table) => {
    table.increments("id").primary;
    table.integer("board_id").references("board.id");
    table.integer("card_id").references("card.id");
  });

  // TODO как правильно хранить порядок карточек в листе?
  await knex.schema.createTable("card_order", (table) => {
    table.increments("id").primary;
    table.integer("board_id").references("board.id").index();
    table.integer("list_id").references("list.id").index();
    table.specificType("order", "INT[]");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTable("card_order");
  await knex.schema.dropTable("board_card");
  await knex.schema.dropTable("user_board");
  await knex.schema.dropTable("card");
  await knex.schema.dropTable("category");
  await knex.schema.dropTable("list");
  await knex.schema.dropTable("board");
  await knex.schema.dropTable("user");
};
