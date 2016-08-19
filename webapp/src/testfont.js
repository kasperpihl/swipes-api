import './components/global-styles/reset.scss'


import React from 'react'
import { render } from 'react-dom'

render(
  <h1 style={{
    fontSize: '15px',
    padding: '20px',
    letterSpacing: '.5px',
    fontWeight: '500'
  }}>Invoice</h1>
  , document.getElementById('content')
)
