import Dep from './dep.js'

const targetMap = new WeakMap()

function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}

function isObject(val) {
  return val !== null && typeof val === 'object'
}

const reactiveHandles = {
  get(target, key, receiver) {
    const dep = getDep(target, key)
    dep.depend()
    const val = Reflect.get(target, key, receiver)
    if (isObject(val)) {
      return reactive(val)
    } else {
      return val
    }
  },
  set(target, key, value, receiver) {
    const dep = getDep(target, key)
    const res = Reflect.set(target, key, value, receiver)
    dep.notify()
    return res
  }
}

export default function reactive(obj) {
  return new Proxy(obj, reactiveHandles)
}