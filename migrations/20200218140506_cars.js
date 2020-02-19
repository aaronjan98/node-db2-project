
exports.up = function(knex) {
  return knex.schema.createTable('cars', tbl => {

      tbl.string('VIN', 17).primary().notNullable();
      tbl.string('make', 255).notNullable().index();
      tbl.string('model', 255).notNullable().index();
      tbl.string('mileage').notNullable();

      tbl.string('transmission', 255);
      tbl.string('status', 255);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cars');
};
