import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { FileProvider } from './FileContext'

import Anonymize from './Anonymize'
import ConfigPage from './Config'
import Source from './Source'
import SourceNext from './SourceNext'
import DiffPrivacy from './DiffPrivacy'


function App() {
    return (
        <FileProvider>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Source />} />
                    <Route path="/source" element={<Source />} />
                    <Route path="/sourcenext" element={<SourceNext />} />
                    <Route path="/configure" element={<ConfigPage />} />
                    <Route path="/anonymizer" element={<DiffPrivacy />} />
                </Routes>
            </Router>
        </FileProvider>
    );
}

export default App;