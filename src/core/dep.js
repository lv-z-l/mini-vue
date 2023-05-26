let activeEffect

export default class Dep {
  constructor() {
    this.subscribers = new Set()
  }

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }
  notify() {
    this.subscribers.forEach(effect => effect())
  }
}

export function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}