import { watchEffect } from './dep.js'
export function h(tag, props, children) {
  return {
    tag,
    props,
    children
  }
}

export function mount(vnode, container) {
  const { tag, props, children } = vnode
  const el = vnode.el = document.createElement(tag)
  // props
  // 省略了判断应该把某个属性当成 props / attribute
  if (props) {
    for (const prop in props) {
      if (prop.startsWith('on')) {
        el.addEventListener(prop.slice(2).toLocaleLowerCase(), props[prop])
      } else {
        el.setAttribute(prop, props[prop])
      }
    }
  }
  // children
  if (typeof children === 'string') {
    el.textContent = children
  } else {
    children.forEach(child => {
      mount(child, el)
    })
  }
  container.appendChild(el)
}

export function patch(n1, n2) {
  const el = n2.el = n1.el
  if (n1.tag === n2.tag) {
    // props
    const newProps = n2.props || {}
    const oldProps = n1.props || {}
    for (const key in newProps) {
      const oldVal = oldProps[key]
      const newVal = newProps[key]
      if (newVal !== oldVal) {
        el.setAttribute(key, newVal)
      }
    }
    for (const key in oldProps) {
      if (!key in newProps) {
        el.removeAttribute(key)
      }
    }

    // children
    const oldChildren = n1.children
    const newChildren = n2.children
    if (typeof newChildren === 'string') {
      if (typeof oldChildren === 'string') {
        if (oldChildren !== newChildren) {
          el.textContent = newChildren
        }
      } else {
        el.textContent = newChildren
      }
    } else {
      if (typeof oldChildren === 'string') {
        el.innerHtml = ''
        newChildren.forEach(child => {
          mount(child, el)
        })
      } else {
        const min = Math.min(oldChildren.length, newChildren.length)
        for (let i = 0; i < min.length; i++) {
          patch(oldChildren[i], newChildren[i])
        }
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach(child => {
            mount(child, el)
          })
        }
        if (newChildren.length < oldChildren.length) {
          oldChildren.slice(newChildren.length).forEach(child => {
            el.removeChild(child.el)
          })
        }
      }
    }
  } else {
    // replace
    el.innerHtml = ''
    mount(n2, el)
  }
}

export function mountApp(comp, container) {
  let isMounted = false
  let vdom
  watchEffect(() => {
    if (!isMounted) {
      vdom = comp.render()
      isMounted = true
      mount(vdom, container)
    } else {
      const newVdom = comp.render()
      patch(vdom, newVdom)
      vdom = newVdom
    }
  })
}