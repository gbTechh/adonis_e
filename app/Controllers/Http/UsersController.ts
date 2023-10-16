import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { routes } from '../../Routes/routes'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async showUsers({ view }: HttpContextContract) {
    const title = 'Tienda | Usuarios'
    const users = await this.findAllUsers(User)
    return view.render('admin/usecases/users/users', { title, routes, users })
  }
  public async addUserShow({ view }: HttpContextContract) {
    const title = 'Tienda | Agregar Usuarios'
    const users = await this.findAllUsers(User)
    return view.render('admin/usecases/users/users-add', { title, routes, users })
  }
  public async addUser(ctx: HttpContextContract) {
    const { request, session, response } = ctx

    session.flash('name', request.body().name)
    session.flash('email', request.body().email)

    const userSchema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(2)]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string([rules.minLength(8), rules.confirmed()]),
    })

    const data = await request.validate({
      schema: userSchema,
      messages: {
        'name.minLength': 'Escribe un nombre correcto',
        'name.required': 'Escribe un nombre correcto',
        'email.required': 'Escribe un email correcto',
        'email.unique': 'Ya existe un usuario registrado con ese email',
        'password.required': 'Escribe una contraseña correcta',
        'password.minLength': 'La contraseña debe ser tener mas de 8 caracteres',
        'password_confirmation.confirmed': 'Las contraseñas no coinciden',
      },
    })
    const user = await User.create(data)
    if (user) {
      session.flash('isAddedUser', true)
    }
    return response.redirect().toRoute('admin_show_users')
  }

  public async findAllUsers(User) {
    const user = await User.all()
    return user
  }
  public async findById(id = 'id', value = '') {
    const user = await User.findBy(id, value)
    return user
  }
  public async editUserShow({ params, view }: HttpContextContract) {
    const { id } = params
    const title = 'Tienda | Editar Usuarios'
    const user = await this.findById('id', id)
    return view.render('admin/usecases/users/users-edit', { title, routes, user })
  }
  public async editUser({ params, response, request, session }: HttpContextContract) {
    const { id } = params
    const { name, email, password } = request.all()
    const user = await this.findById('id', id)
    if (user) {
      user.name = user.name ? name : user.name
      user.email = user.email ? email : user.email
      if (password) {
        user.password = password
      }

      const userSchema = schema.create({
        name: schema.string([rules.minLength(2)]),
        email: schema.string([
          rules.unique({
            table: 'users',
            column: 'email',
            whereNot: { id },
          }),

          rules.email(),
        ]),
        password: schema.string.optional([rules.minLength(8), rules.confirmed()]),
      })
      session.flash('name', request.body().name)
      session.flash('email', request.body().email)
      await request.validate({
        schema: userSchema,
        messages: {
          'name.minLength': 'Escribe un nombre correcto',
          'name.required': 'El nombre es requerido',
          'email.required': 'El email es requerido',
          'email.email': 'Escribe un email correcto',
          'email.unique': 'Ese email ya esta siendo usado',
          'password.minLength': 'La contraseña debe ser tener mas de 8 caracteres',
          'password_confirmation.confirmed': 'Las contraseñas no coinciden',
        },
      })
      await user.save()
      if (user) {
        session.flash('success', true)
      }
    }
    return response.redirect().toRoute('admin_show_users')
  }
  public async destroy({ params, session, response }) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.delete()
    if (user) {
      session.flash('succesDelete', true)
    }
    return response.redirect().toRoute('admin_show_users')
  }
}
