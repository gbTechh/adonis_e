import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/register', 'AuthController.registerShow').as('admin_register_show')
  Route.post('/register', 'AuthController.register').as('admin_register_post')
  Route.get('/login', 'AuthController.loginShow').as('admin_login_show')
  Route.post('/login', 'AuthController.login').as('admin_login_post')
  Route.get('/logout', 'AuthController.logout').as('admin_logout')

  Route.group(() => {
    // Rutas y controladores para la gestión de usuarios
    // Ejemplo:
    Route.get('/', 'DashboardController.index')
  }).prefix('dashboard')

  Route.group(() => {
    Route.get('/', 'UsersController.showUsers').as('admin_show_users')
    Route.get('/add', 'UsersController.addUserShow').as('admin_add_user')
    Route.post('/add', 'UsersController.addUser').as('admin_add_user_post')

    Route.get('/:id', 'UsersController.editUserShow').as('admin_edit_user')
    Route.post('/:id', 'UsersController.editUser').as('admin_edit_user_post')

    Route.post('/:id/delete', 'UsersController.destroy').as('admin_delete_user')
  }).prefix('users')

  Route.group(() => {
    Route.get('/', 'CategoriesController.showCategories').as('admin_show_categories')
    Route.get('/add', 'CategoriesController.addCategoryShow').as('admin_add_category')
    Route.post('/add', 'CategoriesController.addCategory').as('admin_add_category_post')

    Route.get('/:id', 'CategoriesController.editCategoryShow').as('admin_edit_category')
    Route.put('/:id', 'CategoriesController.editCategory').as('admin_edit_category_post')

    Route.delete('/:id', 'CategoriesController.destroy').as('admin_delete_category')
  }).prefix('categories')

  Route.group(() => {
    Route.get('/', 'ProductsController.showProducts').as('admin_show_products')
    Route.get('/add', 'ProductsController.addProductShow').as('admin_add_product')
    Route.post('/add', 'ProductsController.addProduct').as('admin_add_product_post')

    Route.get('/:id', 'ProductsController.editProductShow').as('admin_edit_product')
    Route.put('/:id', 'ProductsController.editProduct').as('admin_edit_product_post')

    Route.delete('/:id', 'ProductsController.destroy').as('admin_delete_product')
  }).prefix('products')
  Route.get('/404', 'ErrorHandlersController.notFound').as('404')
}).prefix('/admin')
