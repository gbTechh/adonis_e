import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { routes } from '../../Routes/routes'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    const title = 'Tienda | Dashboard'

    return view.render('admin/dashboard', { title, routes })
  }
}
