import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ErrorHandlersController {
  public async notFound({ view }: HttpContextContract) {
    return view.render('admin/404')
  }
}
