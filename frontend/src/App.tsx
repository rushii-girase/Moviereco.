import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './routes/HomePage';
import { DiscoverPage } from './routes/DiscoverPage';
import { MovieDetailsPage } from './routes/MovieDetailsPage';
import { WishlistPage } from './routes/WishlistPage';
import { LoginPage } from './routes/LoginPage';
import { TopListsPage } from './routes/TopListsPage';
import { FilmMovementsPage } from './routes/FilmMovementsPage';
import { AwardsPage } from './routes/AwardsPage';
import { CustomListsPage } from './routes/CustomListsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/top-lists" element={<TopListsPage />} />
              <Route path="/film-movements" element={<FilmMovementsPage />} />
              <Route path="/awards" element={<AwardsPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/watchlist" element={<WishlistPage />} />
              <Route path="/my-lists" element={<CustomListsPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
