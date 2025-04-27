import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { booksAtom, currentBookAtom, currentUserAtom, readingProgressAtom } from '../store/atoms';
import { Book, ReadingProgress } from '../types';

export const useBooks = () => {
  const [books, setBooks] = useAtom(booksAtom);
  const [currentBook, setCurrentBook] = useAtom(currentBookAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const [readingProgress, setReadingProgress] = useAtom(readingProgressAtom);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's books
  const fetchBooks = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Query books by user
      const q = query(
        collection(db, 'books'), 
        where('addedBy', '==', currentUser.id)
      );
      
      const snapshot = await getDocs(q);
      const fetchedBooks: Book[] = [];
      
      snapshot.forEach((doc) => {
        const bookData = doc.data() as Omit<Book, 'id'>;
        fetchedBooks.push({
          id: doc.id,
          ...bookData,
          createdAt: bookData.createdAt instanceof Date 
            ? bookData.createdAt 
            : new Date(bookData.createdAt.seconds * 1000)
        });
      });
      
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get book by ID
  const getBookById = async (bookId: string) => {
    try {
      setIsLoading(true);
      
      const bookRef = doc(db, 'books', bookId);
      const bookDoc = await getDoc(bookRef);
      
      if (bookDoc.exists()) {
        const bookData = bookDoc.data() as Omit<Book, 'id'>;
        const book: Book = {
          id: bookDoc.id,
          ...bookData,
          createdAt: bookData.createdAt instanceof Date 
            ? bookData.createdAt 
            : new Date(bookData.createdAt.seconds * 1000)
        };
        
        setCurrentBook(book);
        
        // Get reading progress
        await getReadingProgress(bookId);
        
        return book;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting book:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload PDF and add book
  const addBook = async (
    file: File, 
    title: string, 
    author: string, 
    description: string, 
    coverURL: string,
    categories: string[] = ['Other']
  ) => {
    if (!currentUser) return null;
    
    try {
      setIsLoading(true);
      
      // Upload PDF to Firebase Storage
      const storageRef = ref(storage, `books/${currentUser.id}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      
      // Get PDF URL
      const pdfURL = await getDownloadURL(storageRef);
      
      // Add book to Firestore
      const newBook: Omit<Book, 'id'> = {
        title,
        author,
        coverURL,
        description,
        categories,
        pdfURL,
        totalPages: 1, // Will be updated when the book is opened
        createdAt: new Date(),
        addedBy: currentUser.id
      };
      
      const bookRef = await addDoc(collection(db, 'books'), newBook);
      
      const bookWithId: Book = {
        id: bookRef.id,
        ...newBook
      };
      
      setBooks([...books, bookWithId]);
      
      return bookWithId;
    } catch (error) {
      console.error('Error adding book:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete book
  const deleteBook = async (bookId: string) => {
    if (!currentUser) return false;
    
    try {
      setIsLoading(true);
      
      // Get book to delete
      const bookRef = doc(db, 'books', bookId);
      const bookDoc = await getDoc(bookRef);
      
      if (bookDoc.exists()) {
        const bookData = bookDoc.data() as Book;
        
        // Check if current user is the owner
        if (bookData.addedBy !== currentUser.id) {
          throw new Error('Not authorized to delete this book');
        }
        
        // Delete PDF from Storage
        const storageRef = ref(storage, bookData.pdfURL);
        await deleteObject(storageRef);
        
        // Delete reading progress
        const progressRef = doc(db, 'readingProgress', `${currentUser.id}_${bookId}`);
        await deleteDoc(progressRef);
        
        // Delete book from Firestore
        await deleteDoc(bookRef);
        
        // Update local state
        setBooks(books.filter((book) => book.id !== bookId));
        
        if (currentBook?.id === bookId) {
          setCurrentBook(null);
          setReadingProgress(null);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get reading progress
  const getReadingProgress = async (bookId: string) => {
    if (!currentUser) return null;
    
    try {
      const progressRef = doc(db, 'readingProgress', `${currentUser.id}_${bookId}`);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        const progress = progressDoc.data() as ReadingProgress;
        setReadingProgress(progress);
        return progress;
      } else {
        // Create new reading progress
        const newProgress: ReadingProgress = {
          bookId,
          userId: currentUser.id,
          currentPage: 1,
          lastReadAt: new Date(),
          bookmarks: []
        };
        
        await setDoc(progressRef, newProgress);
        setReadingProgress(newProgress);
        return newProgress;
      }
    } catch (error) {
      console.error('Error getting reading progress:', error);
      return null;
    }
  };

  // Update reading progress
  const updateReadingProgress = async (
    bookId: string, 
    currentPage: number, 
    totalPages?: number
  ) => {
    if (!currentUser || !readingProgress) return false;
    
    try {
      const progressRef = doc(db, 'readingProgress', `${currentUser.id}_${bookId}`);
      
      const updatedProgress: Partial<ReadingProgress> = {
        currentPage,
        lastReadAt: new Date()
      };
      
      await setDoc(progressRef, updatedProgress, { merge: true });
      
      setReadingProgress({
        ...readingProgress,
        ...updatedProgress
      });
      
      // Update total pages if provided
      if (totalPages && currentBook) {
        const bookRef = doc(db, 'books', bookId);
        await setDoc(bookRef, { totalPages }, { merge: true });
        
        setCurrentBook({
          ...currentBook,
          totalPages
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating reading progress:', error);
      return false;
    }
  };

  // Add bookmark
  const addBookmark = async (bookId: string, pageNumber: number) => {
    if (!currentUser || !readingProgress) return false;
    
    try {
      // Don't add duplicate bookmarks
      if (readingProgress.bookmarks.includes(pageNumber)) {
        return true;
      }
      
      const progressRef = doc(db, 'readingProgress', `${currentUser.id}_${bookId}`);
      
      const updatedBookmarks = [...readingProgress.bookmarks, pageNumber].sort((a, b) => a - b);
      
      await setDoc(
        progressRef, 
        { bookmarks: updatedBookmarks }, 
        { merge: true }
      );
      
      setReadingProgress({
        ...readingProgress,
        bookmarks: updatedBookmarks
      });
      
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return false;
    }
  };

  // Remove bookmark
  const removeBookmark = async (bookId: string, pageNumber: number) => {
    if (!currentUser || !readingProgress) return false;
    
    try {
      const progressRef = doc(db, 'readingProgress', `${currentUser.id}_${bookId}`);
      
      const updatedBookmarks = readingProgress.bookmarks.filter(
        (bookmark) => bookmark !== pageNumber
      );
      
      await setDoc(
        progressRef, 
        { bookmarks: updatedBookmarks }, 
        { merge: true }
      );
      
      setReadingProgress({
        ...readingProgress,
        bookmarks: updatedBookmarks
      });
      
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
  };

  // Load books on mount
  useEffect(() => {
    if (currentUser && books.length === 0) {
      fetchBooks();
    }
  }, [currentUser]);

  return {
    books,
    currentBook,
    readingProgress,
    isLoading,
    fetchBooks,
    getBookById,
    addBook,
    deleteBook,
    updateReadingProgress,
    addBookmark,
    removeBookmark
  };
};