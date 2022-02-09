import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './components/home/home';
import TextEditor from './components/quill/quill';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/doc/:id/:userId" element={<TextEditor />}/>
      </Routes>
    </Router>
  );
}

export default App;
