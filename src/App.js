import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Create from './pages/Create';
import Home from './pages/Home';
import Board from './pages/Board';
import Chat from './pages/Chat';
import Setting from './pages/Setting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/home" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
