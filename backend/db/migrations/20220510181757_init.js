/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable("user", (table) => {
    table
      .increments("id")
      .primary;
    table
      .string("login", 256)
      .notNullable()
      .unique();
    table
      .string("password", 2048)
      .notNullable;
    table
      .string("name", 2048);
    table
      .timestamp("created_at", { useTz: false })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at", { useTz: false })
      .nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTable("user");
};
