import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PDFReader from '../components/reader/PDFReader';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';

const ReaderPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { getBookById } = useBooks();
  const { currentUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/login');
      return;
    }
    
    if (bookId) {
      getBookById(bookId);
    }
  }, [bookId, currentUser, isAuthLoading, navigate, getBookById]);
  
  if (!bookId) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Book not found</p>
      </div>
    );
  }
  
  return (
    <div className="h-screen">
      <PDFReader bookId={bookId} />
    </div>
  );
};

export default ReaderPage;