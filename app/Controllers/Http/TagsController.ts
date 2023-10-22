import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { routes } from '../../Routes/routes'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Tag from 'App/Models/Tag'

export default class TagsController {
  public async showTags({ view }: HttpContextContract) {
    const title = 'Tienda | Tags'
    const tags = await Tag.all()
    return view.render('admin/usecases/tags/tags', { title, routes, tags })
  }

  public async addTag(ctx: HttpContextContract) {
    const { request, session, response } = ctx

    session.flash('name', request.body().name)

    const tagSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'tags', column: 'name', caseInsensitive: true }),
      ]),
    })

    const data = await request.validate({
      schema: tagSchema,
      messages: {
        'name.minLength': 'Escribe un nombre correcto',
        'name.required': 'El nombre es requerido',
        'name.unique': 'Ya existe un tag con este nombre',
      },
    })

    const tag = await Tag.create(data)
    if (tag) {
      session.flash('isAddedTag', true)
    }
    return response.redirect().toRoute('admin_show_tags')
  }
  public async editTagShow({ view, params, response }: HttpContextContract) {
    const { id } = params
    const title = 'Tienda | Editar Categoría'
    const tag = await Tag.findBy('id', id)

    if (!tag) {
      return response.redirect().toRoute('404', { path: 'pagina-no-encontrada' })
    }

    return view.render('admin/usecases/tags/tags-edit', {
      title,
      routes,
      tag,
    })
  }
  public async editTag({ params, response, request, session }: HttpContextContract) {
    const { id } = params
    if (Number(id) < 0) {
      return response.redirect().toRoute('admin_show_tags')
    }
    const { name } = request.all()
    console.log({ name })
    const tag = await Tag.findBy('id', id)
    if (tag) {
      tag.name = name

      session.flash('name', request.body().name)
      const tagSchema = schema.create({
        name: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.unique({ table: 'tags', column: 'name', whereNot: { id } }),
        ]),
      })

      await request.validate({
        schema: tagSchema,
        messages: {
          'name.minLength': 'Escribe un nombre correcto',
          'name.required': 'El nombre es requerido',
          'name.unique': 'Ya existe un tag con este nombre',
        },
      })
      const editTag = await tag.save()
      if (editTag) {
        session.flash('successEditTag', true)
      }
    }
    return response.redirect().toRoute('admin_show_tags')
  }
  public async destroy({ params, session, response }) {
    try {
      const { id } = params
      const category = await Tag.findOrFail(id)
      await category.delete()
      if (category) {
        session.flash('succesDelete', true)
      }
    } catch (error) {
      session.flash('errorDelete', 'No se pudo eliminar la tag')
    }
    return response.redirect().toRoute('admin_show_tags')
  }
}
