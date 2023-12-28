import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { FileProvider } from './FileContext'

import Config from './Config'
import Source from './Source'
import DiffPrivacy from './DiffPrivacy'


function App() {
    return (
        <FileProvider>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Source />} />
                    <Route path="/source" element={<Source />} />
                    <Route path="/configure" element={<Config />} />
                    <Route path="/anonymizer" element={<DiffPrivacy />} />
                </Routes>
            </Router>
        </FileProvider>
    );
}

export default App;