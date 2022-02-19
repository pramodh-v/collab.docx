import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import ProtectedRoute from './components/protectedRoutes/protectedRoutes';
import Home from './components/home/home';
import TextEditor from './components/quill/quill';
import Login from './components/login/login';
import Register from './components/register/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route exact path="/home" element={<ProtectedRoute />}>
          <Route exact path="" element={<Home />}/>
        </Route>
        <Route exact path="/doc/:id/:userId" element={<ProtectedRoute />}>
          <Route exact path="" element={<TextEditor />}/>
        </Route>
        {/* <ProtectedRoute path="/doc/:id/:userId" component={<TextEditor />}/> */}
      </Routes>
    </Router>
  );
}

export default App;
