import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('slug', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    options.errorReporter.report(
      options.pointer,
      'slug',
      'slug validation failed',
      options.arrayExpressionPointer
    )
  }
})
