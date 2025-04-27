import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useBooks } from './useBooks';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.269/build/pdf.worker.min.js`;

export const usePdfReader = () => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageRendering, setPageRendering] = useState(false);
  const [pageText, setPageText] = useState('');
  const { currentBook, readingProgress, updateReadingProgress } = useBooks();

  // Load PDF document
  const loadPdf = async (url: string) => {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdfDoc = await loadingTask.promise;
      setPdf(pdfDoc);
      setNumPages(pdfDoc.numPages);
      
      // Update book with total pages if needed
      if (currentBook && currentBook.totalPages !== pdfDoc.numPages) {
        updateReadingProgress(currentBook.id, pageNumber, pdfDoc.numPages);
      }
      
      return pdfDoc;
    } catch (error) {
      console.error('Error loading PDF:', error);
      return null;
    }
  };

  // Render page
  const renderPage = async (pageNum: number, canvas: HTMLCanvasElement | null) => {
    if (!pdf || !canvas) return null;
    
    setPageRendering(true);
    
    try {
      const page = await pdf.getPage(pageNum);
      
      // Get page text content
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str).join(' ');
      setPageText(textItems);
      
      // Get viewport
      const viewport = page.getViewport({ scale: 1.5 });
      
      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render PDF page
      const renderContext = {
        canvasContext: canvas.getContext('2d') as CanvasRenderingContext2D,
        viewport
      };
      
      await page.render(renderContext).promise;
      
      // Update reading progress if book is loaded
      if (currentBook) {
        updateReadingProgress(currentBook.id, pageNum);
      }
      
      setPageRendering(false);
      return page;
    } catch (error) {
      console.error('Error rendering page:', error);
      setPageRendering(false);
      return null;
    }
  };

  // Go to previous page
  const goToPrevPage = () => {
    if (pageNumber <= 1) return;
    setPageNumber(pageNumber - 1);
  };

  // Go to next page
  const goToNextPage = () => {
    if (!pdf || pageNumber >= numPages) return;
    setPageNumber(pageNumber + 1);
  };

  // Go to specific page
  const goToPage = (pageNum: number) => {
    if (!pdf || pageNum < 1 || pageNum > numPages) return;
    setPageNumber(pageNum);
  };

  // Initialize with current reading progress
  useEffect(() => {
    if (readingProgress && readingProgress.currentPage > 0) {
      setPageNumber(readingProgress.currentPage);
    }
  }, [readingProgress]);

  // Load PDF when current book changes
  useEffect(() => {
    if (currentBook?.pdfURL) {
      loadPdf(currentBook.pdfURL);
    }
  }, [currentBook]);

  return {
    pdf,
    pageNumber,
    numPages,
    pageRendering,
    pageText,
    loadPdf,
    renderPage,
    goToPrevPage,
    goToNextPage,
    goToPage
  };
};