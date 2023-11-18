import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { routes } from '../../Routes/routes'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Product from 'App/Models/Product'
import Category from 'App/Models/Category'
import Tag from 'App/Models/Tag'
import Attribute from 'App/Models/Attribute'
import AttributeOption from 'App/Models/AttributeOption'

export default class ProductsController {
  public async showProducts({ view }: HttpContextContract) {
    const title = 'Tienda | Productos'
    const products = await Product.all()
    return view.render('admin/usecases/products/products', { title, routes, products })
  }

  public async addProductShow({ view }: HttpContextContract) {
    const title = 'Tienda | Agregar una categoría'
    const categories = await Category.all()
    const tags = await Tag.all()
    const attributes = await Attribute.all()
    const attributesOption = await AttributeOption.all()

    // for (const attr of attributes) {
    //   const attributeOptions = await AttributeOption.query().where('id_attribute', attr.id)
    //   attr.$extras.values = { ...attributeOptions }
    // }

    return view.render('admin/usecases/products/products-add', {
      title,
      routes,
      categories,
      tags,
      attributes,
      attributesOption,
    })
  }
}
