import React from 'react'

export const createSlot = () => {
  const slot = {
    counter: 0,
    Slot: props => <Slot {...props} />,
    Portal: props => <Portal {...props} />,
    update: null,
    unmount: null,
    portals: {},
  }

  class Slot extends React.Component {
    _props = {}

    constructor(props) {
      super(props)
      this.init()
      this.restorePortals()
    }

    restorePortals = () =>
      Object.entries(slot.portals).forEach(([id, portal]) =>
        slot.update(portal, false)
      )

    hasPortals = () => Object.keys(this._props).length > 0

    init = () => {
      slot.unmount = props => {
        const newProps = Object.entries(this._props)
          .filter(([i]) => i !== String(props.order || 0))
          .reduce((acc, [i, p]) => ({ ...acc, [i]: p }), {})

        this._props = newProps
        this.updater.isMounted(this) && this.setState({})
      }

      slot.update = (props, forceUpdate = true) => {
        this._props = {
          ...this._props,
          [props.order || '0']: props,
        }
        forceUpdate && this.updater.isMounted(this) && this.setState({})
      }
    }

    componentWillUnmount() {
      slot.update = null
      slot.unmount = null
    }

    render() {
      const {
        divider,
        multiple,
        replace = true,
        children,
        style,
        ...props
      } = this.props
      const orders = Object.keys(this._props).sort((a, b) => +a - +b)
      let lastStyle = {}
      let childList = orders.map((ord, i) => {
        const {
          style: portalStyle,
          render,
          children: portalChildren,
        } = this._props[ord]
        lastStyle = portalStyle
        const child =
          typeof portalChildren === 'function' ? (
            portalChildren({ ...this.props, key: ord })
          ) : render ? (
            render({ ...this.props, key: ord })
          ) : (
            portalChildren
          )
        return <React.Fragment key={ord}>{child}</React.Fragment>
      })

      const lastChild = childList.slice(-1)[0] || {}
      let dividerKey = -1

      if (divider && multiple && childList.length > 1) {
        childList = childList.reduce((acc, child, index) => {
          acc.push(child)
          if (index !== childList.length - 1) {
            acc.push(<React.Fragment key={dividerKey--}>{divider}</React.Fragment>)
          }
          return acc
        }, [])
      }

      return (
        <div {...props} {...lastChild.props} style={{ ...style, ...lastStyle }}>
          {(!replace || !this.hasPortals()) && children}
          {children && this.hasPortals() && !replace
            ? <React.Fragment key={dividerKey--}>{divider}</React.Fragment>
            : null
          }
          {multiple
            ? childList
            : childList.slice(-1)
          }
        </div>
      )
    }
  }

  class Portal extends React.Component {
    id = ++slot.counter

    componentWillUnmount() {
      slot.unmount && slot.unmount(this.props)
      delete slot.portals[this.id]
    }

    update = () => slot.update && slot.update(this.props)

    componentDidMount() {
      slot.portals[this.id] = this.props
      this.update()
    }

    componentDidUpdate() {
      this.update()
    }

    render() {
      return null
    }
  }

  return slot
}
