import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Create from './components/Create';
import TaskPage from './components/TaskPage';
import Nav from './components/Nav';
import Home from './components/Home';
import { ActionProvider } from './contexts/ActionContext';

function App() {
  return (
    <Router>
      <Nav />
      <ActionProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/tasks" element={<TaskPage />} />
        </Routes>
      </ActionProvider>
    </Router>
  );
}

export default App;
