import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import Tag from 'App/Models/Tag'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public short_description: number

  @column()
  public description: string

  @column()
  public price_discount: number

  @column()
  public price_normal: number

  @column()
  public stock: number

  @column()
  public sku: string

  @column()
  public img_thumbnail: string

  @column()
  public gallery: string

  @column()
  public slug: string

  @column()
  public published: boolean

  @belongsTo(() => Category)
  public id_categoria: BelongsTo<typeof Category>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Tag, {
    pivotForeignKey: 'id_product',
    pivotRelatedForeignKey: 'id_tag',
  })
  public tags: ManyToMany<typeof Tag>
}
