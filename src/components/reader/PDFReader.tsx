import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { usePdfReader } from '../../hooks/usePdfReader';
import { useBooks } from '../../hooks/useBooks';
import Button from '../ui/Button';

interface PDFReaderProps {
  bookId: string;
}

const PDFReader: React.FC<PDFReaderProps> = ({ bookId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showControls, setShowControls] = useState(true);
  const { 
    pageNumber, 
    numPages, 
    pageRendering, 
    renderPage, 
    goToPrevPage, 
    goToNextPage, 
    goToPage 
  } = usePdfReader();
  
  const {
    currentBook,
    readingProgress,
    addBookmark,
    removeBookmark
  } = useBooks();

  // Render current page
  useEffect(() => {
    if (!pageRendering && canvasRef.current) {
      renderPage(pageNumber, canvasRef.current);
    }
  }, [pageNumber, pageRendering, renderPage]);

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  // Check if current page is bookmarked
  const isBookmarked = readingProgress?.bookmarks.includes(pageNumber) || false;

  // Toggle bookmark
  const toggleBookmark = async () => {
    if (!currentBook) return;
    
    if (isBookmarked) {
      await removeBookmark(currentBook.id, pageNumber);
    } else {
      await addBookmark(currentBook.id, pageNumber);
    }
  };

  // Handle page input change
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      goToPage(page);
    }
  };

  // Handle click to show controls
  const handleMouseMove = () => {
    setShowControls(true);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevPage, goToNextPage]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      {/* PDF Canvas */}
      <div className="overflow-auto max-h-[90vh] max-w-full">
        <canvas
          ref={canvasRef}
          className="mx-auto shadow-lg transition-transform duration-300 ease-in-out"
        />
      </div>
      
      {/* Controls Overlay - conditional rendering based on showControls */}
      <div 
        className={`fixed top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-white" />
            <h3 className="text-white font-medium truncate max-w-[200px] md:max-w-xs">
              {currentBook?.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className="text-white"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-blue-400" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Page Controls */}
      <div 
        className={`fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || pageRendering}
            className="text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center space-x-2 text-white">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={handlePageChange}
              className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center"
            />
            <span>of {numPages}</span>
          </div>
          
          <Button
            variant="ghost"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || pageRendering}
            className="text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Page Navigation Buttons (sides of screen) */}
      <button
        className="fixed left-0 top-0 h-full w-1/4 opacity-0"
        onClick={goToPrevPage}
        disabled={pageNumber <= 1 || pageRendering}
      />
      <button
        className="fixed right-0 top-0 h-full w-1/4 opacity-0"
        onClick={goToNextPage}
        disabled={pageNumber >= numPages || pageRendering}
      />
      
      {/* Loading indicator */}
      {pageRendering && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default PDFReader;