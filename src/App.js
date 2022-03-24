import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import 'mind-ar/dist/mindar-image-three.prod.js'

import Experience from 'pages/Experience/Experience'

const ExternalRedirect = ({ url }) => {
  window.location.href = url
  return <></>
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ExternalRedirect url="https://plynth.com" />}
        />
        <Route path="/:id" element={<Experience />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
