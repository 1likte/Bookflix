import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import ReaderPage from './pages/ReaderPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<HomePage />} />
        <Route path="/my-list" element={<LibraryPage />} />
        <Route path="/languages" element={<HomePage />} />
        <Route path="/reader/:bookId" element={<ReaderPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;