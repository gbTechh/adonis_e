import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'product_variations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_product').unsigned().references('products.id')
      table.double('price_normal', 50).notNullable()
      table.double('price_discount', 50).notNullable()
      table.integer('stock', 50).notNullable()
      table.string('sku', 50).notNullable()
      table.string('image', 150)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
