import React, { useState } from 'react'
import { render } from 'react-dom'
import { Router, Link } from '@reach/router'
import { createSlot } from '../../src'
import './styles.css'
import { HeadersPage } from './headers'

export const Breadcrambs = createSlot()
export const Header = createSlot()


function App() {
  return (
    <div className="App">
      <Breadcrambs.Slot className="breadcrambs" multiple divider=" > " />

      <Breadcrambs.Portal order={0}>
        <Link to="/">Home page</Link>
      </Breadcrambs.Portal>

      <Header.Slot className="header" multiple divider={<hr />} value="3">
        Header place...
      </Header.Slot>

      <Router>
        <HomePage default />
        <HeadersPage path="headers" />
        <OtherPage path="other" />
      </Router>

      <ul>
        <li>
          <Link to="headers">Headers page</Link>
        </li>
        <li>
          <Link to="other">Other page</Link>
        </li>
      </ul>
    </div>
  )
}

const HomePage = () => (
  <div>
    <Header.Portal>
      <h1>Home page</h1>
    </Header.Portal>
  </div>
)

const OtherPage = () => (
  <div>
    <Breadcrambs.Portal order={1}>
      <Link to="/other">Other page</Link>
    </Breadcrambs.Portal>

    <Header.Portal>
      <h1>Other page</h1>
    </Header.Portal>
  </div>
)


const rootElement = document.querySelector('#demo')
render(<App />, rootElement)
