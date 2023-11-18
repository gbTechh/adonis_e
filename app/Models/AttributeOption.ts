import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Attribute from 'App/Models/Attribute'

export default class AttributeOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public value: string

  @column()
  public id_attribute: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Attribute, {
    foreignKey: 'id_attribute',
  })
  public attribute: BelongsTo<typeof Attribute>
}
