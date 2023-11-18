import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { routes } from '../../Routes/routes'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Attribute from 'App/Models/Attribute'
import AttributeOption from 'App/Models/AttributeOption'

export default class AttributesController {
  public async showAttributes({ view }: HttpContextContract) {
    const title = 'Tienda | Attributos'
    const attributes = await Attribute.all()
    const attrs = [] as any
    for (const attr of attributes) {
      const atributeRow = {} as any
      const attributeOptions = await attr.related('attributeOptions').query()
      if (attributeOptions.length) {
        atributeRow.values = attributeOptions.map((e) => e.value).join(', ')
      } else {
        atributeRow.values = '---'
      }
      atributeRow.id = attr.id
      atributeRow.name = attr.name
      attrs.push(atributeRow)
    }
    return view.render('admin/usecases/attributes/attributes', { title, routes, attributes: attrs })
  }
  public async getAllAttributes() {
    const attributes = await Attribute.all()
    const attrs = [] as any
    for (const attr of attributes) {
      const atributeRow = {} as any
      const attributeOptions = await attr.related('attributeOptions').query()
      if (attributeOptions.length) {
        atributeRow.values = attributeOptions.map((e) => e.value).join(', ')
      } else {
        atributeRow.values = '---'
      }
      atributeRow.id = attr.id
      atributeRow.name = attr.name
      attrs.push(atributeRow)
    }
    return { attributes: attrs }
  }
  public async addAttribute(ctx: HttpContextContract) {
    const { request, session, response } = ctx
    const values = request.body().values // Obtén la cadena de valores
    const valueArray = values && values.split('|') // Divide la cadena en un array de valores

    const attrSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.minLength(2),
        rules.unique({ table: 'attributes', column: 'name', caseInsensitive: true }),
      ]),
    })

    const data = await request.validate({
      schema: attrSchema,
      messages: {
        'name.minLength': 'Escribe un atributo con nombre correcto',
        'name.required': 'El nombre del atributo es requerido',
        'name.unique': 'Ya existe un atributo con este nombre',
      },
    })

    const attr = await Attribute.create(data)
    if (attr && values) {
      // Crear las opciones de etiqueta basadas en el array de valores
      for (const value of valueArray) {
        await attr.related('attributeOptions').create({ id_attribute: attr.id, value })
      }

      session.flash('isAddedAttribute', true)
    }
    return response.redirect().toRoute('admin_show_attributes')
  }
  public async editAttributeShow({ view, params, response }: HttpContextContract) {
    const { id } = params
    const title = 'Tienda | Editar Categoría'
    const attribute = await Attribute.findBy('id', id)
    const attributeData = {} as any

    if (!attribute) {
      return response.redirect().toRoute('404', { path: 'pagina-no-encontrada' })
    } else {
      const attributeOptions = await attribute?.related('attributeOptions').query()
      if (attributeOptions.length) {
        attributeData.values = attributeOptions.map((e) => e.value).join('|')
      } else {
        attributeData.values = ''
      }
      attributeData.id = attribute.id
      attributeData.name = attribute.name
    }

    return view.render('admin/usecases/attributes/attributes-edit', {
      title,
      routes,
      attributeData,
    })
  }
  public async editAttribute({ params, response, request, session }: HttpContextContract) {
    const { id } = params
    if (Number(id) <= 0) {
      return response.redirect().toRoute('admin_show_attributes')
    }
    const name = request.body().name // Obtén la cadena de valores
    const values = request.body().values // Obtén la cadena de valores
    const valueArray = values ? values.split('|') : []
    console.log({ valueArray })
    const attr = await Attribute.findBy('id', id)
    if (attr) {
      attr.name = name

      session.flash('name', request.body().name)
      const attrSchema = schema.create({
        name: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.unique({
            table: 'attributes',
            column: 'name',
            caseInsensitive: true,
            whereNot: { id },
          }),
        ]),
      })

      await request.validate({
        schema: attrSchema,
        messages: {
          'name.minLength': 'Escribe un atributo con nombre correcto',
          'name.required': 'El nombre del atributo es requerido',
          'name.unique': 'Ya existe un atributo con este nombre',
        },
      })
      const editAttribute = await attr.save()
      if (editAttribute) {
        await AttributeOption.query().where('id_attribute', id).delete()
        for (const value of valueArray) {
          await attr.related('attributeOptions').create({ id_attribute: id, value })
        }
        session.flash('successEditAttribute', true)
      }
    }
    return response.redirect().toRoute('admin_show_attributes')
  }
  public async destroy({ params, session, response }) {
    try {
      const { id } = params
      await AttributeOption.query().where('id_attribute', id).delete()
      const attr = await Attribute.findOrFail(id)
      await attr.delete()
      if (attr) {
        session.flash('succesDelete', true)
      }
    } catch (error) {
      session.flash('errorDelete', 'No se pudo eliminar la tag')
    }
    return response.redirect().toRoute('admin_show_attributes')
  }
}
