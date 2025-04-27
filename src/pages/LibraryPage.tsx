import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Library, Bookmark } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import BookCard from '../components/library/BookCard';
import BookUploader from '../components/library/BookUploader';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';

const LibraryPage: React.FC = () => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'bookmarks'>('all');
  const { books, readingProgress, deleteBook, fetchBooks } = useBooks();
  const { currentUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isAuthLoading, navigate]);
  
  // Handle book deletion
  const handleDeleteBook = async (bookId: string) => {
    await deleteBook(bookId);
  };
  
  // Filter books based on active tab
  const filteredBooks = () => {
    if (activeTab === 'recent') {
      // Sort by last read (most recent first)
      return [...books].sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return bDate - aDate;
      }).slice(0, 10); // Only show 10 most recent
    } else if (activeTab === 'bookmarks') {
      // Show only books with bookmarks
      return books.filter(book => {
        const progress = readingProgress;
        return progress && progress.bookmarks.length > 0 && progress.bookId === book.id;
      });
    } else {
      // Show all books
      return books;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Library</h1>
              <p className="text-slate-400">
                {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
              </p>
            </div>
            
            <Button
              onClick={() => setIsUploaderOpen(true)}
              className="mt-4 md:mt-0"
              leftIcon={<Upload size={18} />}
            >
              Upload Book
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-slate-700 mb-8">
            <button
              className={`py-3 px-4 border-b-2 font-medium ${
                activeTab === 'all'
                  ? 'border-blue-600 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <Library size={18} className="inline-block mr-2" />
              All Books
            </button>
            <button
              className={`py-3 px-4 border-b-2 font-medium ${
                activeTab === 'recent'
                  ? 'border-blue-600 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('recent')}
            >
              <Upload size={18} className="inline-block mr-2" />
              Recently Added
            </button>
            <button
              className={`py-3 px-4 border-b-2 font-medium ${
                activeTab === 'bookmarks'
                  ? 'border-blue-600 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('bookmarks')}
            >
              <Bookmark size={18} className="inline-block mr-2" />
              Bookmarked
            </button>
          </div>
          
          {/* Books Grid */}
          {books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBooks().map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  progress={readingProgress?.bookId === book.id ? readingProgress : undefined}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Library size={48} className="mx-auto text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
              <p className="text-slate-400 mb-6">
                Upload your first book to start reading
              </p>
              <Button 
                onClick={() => setIsUploaderOpen(true)}
                leftIcon={<Plus size={18} />}
              >
                Upload Book
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Book Uploader Modal */}
      {isUploaderOpen && (
        <BookUploader
          onClose={() => setIsUploaderOpen(false)}
          onSuccess={() => {
            setIsUploaderOpen(false);
            fetchBooks();
          }}
        />
      )}
    </div>
  );
};

export default LibraryPage;