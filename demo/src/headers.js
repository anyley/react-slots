import React, { useState } from 'react'
import { render } from 'react-dom'
import { createSlot } from '../../src'
import './styles.css'
import { Header, Breadcrambs } from './'
import { Link } from '@reach/router'


export const HeadersPage = () => {
  const [show, setShow] = useState(false)

  return (
    <div>
      <Breadcrambs.Portal order={1}>
        <Link to="headers">Headers page</Link>
      </Breadcrambs.Portal>

      <Breadcrambs.Portal order={2}>
        Closed headers
      </Breadcrambs.Portal>

      <Header.Portal>
        <h1>Headers page</h1>
      </Header.Portal>

      <button onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'} component with other headers
      </button>

      {show && <ComponentWithHeader />}
    </div>
  )
}

const ComponentWithHeader = ({ header }) => (
  <div>
    <Breadcrambs.Portal order={2}>
      Opened headers
    </Breadcrambs.Portal>

    <Header.Portal>Заголовок 1</Header.Portal>

    <h2>1. Start editing to see some magic happen!</h2>

    <Header.Portal order={2} render={() => <div>Заголовок 2</div>} />

    <h2>2. Start editing to see some magic happen!</h2>

    <Header.Portal order={3}>
      {props => <div>Заголовок {props.value}</div>}
    </Header.Portal>
  </div>
)
