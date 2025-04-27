import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, BookOpen, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { Book, ReadingProgress } from '../../types';

interface BookCardProps {
  book: Book;
  progress?: ReadingProgress;
  onDelete: (bookId: string) => Promise<void>;
}

const BookCard: React.FC<BookCardProps> = ({ book, progress, onDelete }) => {
  const navigate = useNavigate();
  
  const progressPercentage = progress 
    ? Math.round((progress.currentPage / book.totalPages) * 100) 
    : 0;
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this book?')) {
      await onDelete(book.id);
    }
  };
  
  const handleClick = () => {
    navigate(`/reader/${book.id}`);
  };
  
  return (
    <div 
      className="relative group flex flex-col bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      onClick={handleClick}
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {book.coverURL ? (
          <img 
            src={book.coverURL} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <BookOpen size={48} className="text-slate-500" />
          </div>
        )}
        
        {/* Progress Overlay */}
        {progressPercentage > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-600">
            <div 
              className="h-full bg-blue-600" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            variant="primary"
            size="sm"
            className="mx-2"
            leftIcon={<BookOpen size={16} />}
          >
            Read Now
          </Button>
        </div>
      </div>
      
      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-white truncate">{book.title}</h3>
        <p className="text-slate-400 text-sm truncate">{book.author}</p>
        
        {progress && (
          <div className="flex items-center mt-2 text-xs text-slate-400">
            <Clock size={14} className="mr-1" />
            <span>{`${progress.currentPage} of ${book.totalPages} pages`}</span>
          </div>
        )}
      </div>
      
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100"
        onClick={handleDelete}
      >
        <Trash2 size={16} className="text-red-500" />
      </Button>
    </div>
  );
};

export default BookCard;