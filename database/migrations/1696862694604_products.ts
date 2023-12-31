import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.string('short_description', 50).notNullable()
      table.string('description', 50).notNullable()
      table.string('slug', 50).notNullable()
      table.boolean('published').notNullable().defaultTo(0)
      table.integer('id_categoria').unsigned().references('categories.id').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
