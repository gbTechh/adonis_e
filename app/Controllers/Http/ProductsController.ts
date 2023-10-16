import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { routes } from '../../Routes/routes'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Product from 'App/Models/Product'
import Category from 'App/Models/Category'

export default class ProductsController {
  public async showProducts({ view }: HttpContextContract) {
    const title = 'Tienda | Productos'
    const products = await Product.all()
    return view.render('admin/usecases/products/products', { title, routes, products })
  }

  public async addProductShow({ view }: HttpContextContract) {
    const title = 'Tienda | Agregar una categoría'
    const categories = await Category.all()
    return view.render('admin/usecases/products/products-add', {
      title,
      routes,
      categories,
    })
  }
}
