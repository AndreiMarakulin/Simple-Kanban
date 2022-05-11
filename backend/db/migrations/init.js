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
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable();
  });

  await knex.schema.createTable("board", (table) => {
    table.increments("id").primary;
    table.string("title", 2048).notNullable().unique();
    table.string("description");
    table.integer("owner_id").references("user.id");
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable();
  });

  await knex.schema.createTable("list", (table) => {
    table.increments("id").primary;
    table.string("title", 2048).notNullable();
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable();
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
    table.integer("category_id").references("category.id");
    table.timestamp("deadline", { useTz: false });
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable();
  });
  
  await knex.schema.createTable("user_board", (table) => {
    table.increments("id").primary;
    table.integer("user_id").references("user.id");
    table.integer("board_id").references("board.id");
  });
  
  await knex.schema.createTable("board_list", (table) => {
    table.increments("id").primary;
    table.integer("board_id").references("board.id");
    table.integer("list_id").references("list.id");
  });
  
  await knex.schema.createTable("list_card", (table) => {
    table.increments("id").primary;
    table.integer("list_id").references("list.id");
    table.integer("card_id").references("card.id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.raw(`DROP TABLE "user" CASCADE`);
  await knex.raw(`DROP TABLE "board" CASCADE`);
  await knex.raw(`DROP TABLE "list" CASCADE`);
  await knex.raw(`DROP TABLE "card" CASCADE`);
  await knex.raw(`DROP TABLE "category" CASCADE`);
  await knex.schema.dropTable("user_board");
  await knex.schema.dropTable("board_list");
  await knex.schema.dropTable("list_card");
};
