import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { routes } from '../../Routes/routes'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'

interface PropsData {
  name: string
  thumbnail: string
  slug: string
  parent_id: number
}

export default class CategoriesController {
  public async listCategoriesParenId() {
    const categories = await Category.all()
    return categories.map((category) => {
      const modifiedCategory = category.toJSON()
      modifiedCategory.parent_name =
        modifiedCategory.parent_id === 0 ? '--' : this.recursiveParent(categories, category).trim()

      return modifiedCategory
    })
  }
  public async showCategories({ view }: HttpContextContract) {
    const title = 'Tienda | Categorías'
    const cat = await this.listCategoriesParenId()
    return view.render('admin/usecases/categories/categories', { title, routes, categories: cat })
  }

  public recursiveParent = (data, element) => {
    if (element?.parent_id === 0) {
      return element.name
    }

    const parent = data.find((e) => e.id === element?.parent_id)!

    const str: string = this.recursiveParent(data, parent)
    return `${str} >> ${element?.name}`
  }

  public async addCategoryShow({ view }: HttpContextContract) {
    const title = 'Tienda | Agregar una categoría'
    const categories = await Category.all()
    const cat = categories.map((category) => {
      const modifiedCategory = category.toJSON()
      modifiedCategory.name = this.recursiveParent(categories, category).trim()

      return modifiedCategory
    })
    return view.render('admin/usecases/categories/categories-add', {
      title,
      routes,
      categories: cat,
    })
  }

  public async addCategory(ctx: HttpContextContract) {
    const { request, session, response } = ctx
    const thumbnail = request.file('thumbnail', {
      size: '2mb',
      extnames: ['jpg', 'png', 'gif', 'webp', 'jpeg'],
    })
    let filename = new Date().getTime().toString() + `.${thumbnail?.extname}`
    if (thumbnail) {
      if (!thumbnail.isValid) {
        session.flash('thumbnail', thumbnail.errors[0].message)
        return response.redirect().back()
      }
      await thumbnail.move(Application.publicPath('uploads/category'), {
        name: filename,
      })
    }

    session.flash('name', request.body().name)
    session.flash('slug', request.body().slug)
    session.flash('parent_id', request.body().slug)

    const categorySchema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(2)]),
      slug: schema.string({ trim: true }, [
        rules.slug(),
        rules.unique({ table: 'categories', column: 'slug', caseInsensitive: true }),
      ]),
      parent_id: schema.number(),
    })

    const data = (await request.validate({
      schema: categorySchema,
      messages: {
        'name.minLength': 'Escribe un nombre correcto',
        'name.required': 'El nombre es requerido',
        'slug.required': 'El slug es requerido',
        'slug.unique': 'Ya existe una categoría registrada con ese slug',
        'slug.slug': 'Escribe un slug correcto',
        'parent_id.number': 'Escoja una categoría correcta',
      },
    })) as PropsData
    if (thumbnail) {
      data.thumbnail = `uploads/category/${filename}`
    }
    const category = await Category.create(data)
    if (category) {
      session.flash('isAddedCategory', true)
    }
    return response.redirect().toRoute('admin_show_categories')
  }
  public async editCategoryShow({ params, view, response }: HttpContextContract) {
    const { id } = params
    const title = 'Tienda | Editar Categoría'
    const category = await this.findById('id', id)

    if (!category) {
      return response.redirect().toRoute('404', { path: 'pagina-no-encontrada' })
    }
    const categories = await Category.all()
    const cat = categories.map((category) => {
      const modifiedCategory = category.toJSON()
      modifiedCategory.name = this.recursiveParent(categories, category).trim()

      return modifiedCategory
    })
    return view.render('admin/usecases/categories/categories-edit', {
      title,
      routes,
      category,
      selected: category?.parent_id === 0 ? 0 : category?.id,
      categories: cat,
    })
  }
  public async editCategory({ params, response, request, session }: HttpContextContract) {
    const { id } = params

    const { name, slug, parent_id } = request.all()
    const category = await this.findById('id', id)
    let filename
    const thumbnail = request.file('thumbnail', {
      size: '2mb',
      extnames: ['jpg', 'png', 'gif', 'webp', 'jpeg'],
    })
    if (category?.id) {
      category.name = category.name ? name : category.name
      category.slug = category.slug ? slug : category.slug
      category.parent_id =
        Number(parent_id) === Number(category.id) ? category.parent_id : parent_id

      if (thumbnail) {
        const isDeleted = await this.deleteUploadedFile('public/' + category.thumbnail)
        filename = new Date().getTime().toString() + `.${thumbnail?.extname}`

        if (!thumbnail.isValid) {
          session.flash('thumbnail', thumbnail.errors[0].message)
          return response.redirect().back()
        }
        if (isDeleted) {
          await thumbnail.move(Application.publicPath('uploads/category'), {
            name: filename,
          })
          category.thumbnail = `uploads/category/${filename}`
        }
      }
      session.flash('name', request.body().name)
      session.flash('slug', request.body().slug)
      session.flash('parent_id', request.body().slug)

      const categorySchema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(2)]),
        slug: schema.string({ trim: true }, [
          rules.slug(),
          rules.unique({
            table: 'categories',
            column: 'slug',
            whereNot: { id },
          }),
        ]),
        parent_id: schema.number(),
      })

      const data = (await request.validate({
        schema: categorySchema,
        messages: {
          'name.minLength': 'Escribe un nombre correcto',
          'name.required': 'El nombre es requerido',
          'slug.required': 'El slug es requerido',
          'slug.unique': 'Ya existe una categoría registrada con ese slug',
          'slug.slug': 'Escribe un slug correcto',
          'parent_id.number': 'Escoja una categoría correcta',
        },
      })) as PropsData

      await category.save()
      if (category) {
        session.flash('isEditedCategory', true)
      }
    } else {
      if (!category) {
        return response.redirect().toRoute('404')
      }
    }
    return response.redirect().toRoute('admin_show_categories')
  }
  public async findById(id = 'id', value = '') {
    const user = await Category.findBy(id, value)
    return user
  }
  public async deleteUploadedFile(filePath) {
    try {
      await fs.promises.unlink(filePath)
      return 1
    } catch (error) {
      console.log({ error })
      return error
    }
  }

  public async destroy({ params, session, response }) {
    try {
      const { id } = params
      const category = await Category.findOrFail(id)
      await Category.query()
        .where('parent_id', category.id)
        .update({ parent_id: category.parent_id })
      await category.delete()
      if (category) {
        session.flash('succesDelete', true)
      }
    } catch (error) {
      session.flash('errorDelete', 'No se pudo eliminar la categoría')
    }
    return response.redirect().toRoute('admin_show_categories')
  }
}
