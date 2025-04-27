import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import BookCard from '../components/library/BookCard';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';

const FavoritesPage: React.FC = () => {
  const { books, readingProgress, deleteBook } = useBooks();
  const { currentUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isAuthLoading, navigate]);

  // Filter favorite books
  const favoriteBooks = books.filter(book => 
    currentUser?.favorites?.includes(book.id)
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Heart size={24} className="text-red-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
              <p className="text-slate-400">
                {favoriteBooks.length} {favoriteBooks.length === 1 ? 'book' : 'books'} in your favorites
              </p>
            </div>
          </div>
          
          {/* Books Grid */}
          {favoriteBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {favoriteBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  progress={readingProgress?.bookId === book.id ? readingProgress : undefined}
                  onDelete={deleteBook}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-slate-400 mb-6">
                Add books to your favorites while browsing
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;