console.log('OBSERVER')

class Subject {
  constructor() {
    this.observers = []
  }
  suscribe(o) {
    this.observers.push(o)
  }
  unsuscribe(o) {
    this.observers = this.observers.filter((e) => e !== 0)
  }
  notify(model) {
    this.observers.forEach((observer) => {
      observer.notify(model)
    })
  }
}

export class InputSubject extends Subject {
  constructor() {
    super()
    this.value = ''
  }
  notify(value) {
    this.value = value
    super.notify(this)
  }
}

export class BtnGenerateSubject {
  notify(obj) {
    console.log({ obj })
  }
}
