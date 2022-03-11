import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'mind-ar/dist/mindar-image-three.prod.js'

import Experience from 'pages/Experience/Experience'
// import Demo from 'pages/Demo/Demo'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Demo />} /> */}
        <Route
          path="/"
          component={() => {
            window.location.href = 'https://plynth.com'
            return null
          }}
        />
        <Route path="/:id" element={<Experience />} />
      </Routes>
    </Router>
  )
}

export default App
