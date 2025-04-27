import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.269/build/pdf.worker.min.js`;

interface PDFRendererProps {
  url: string;
  pageNumber: number;
  scale?: number;
  onPageLoad?: (page: PDFPageProxy) => void;
}

const PDFRenderer: React.FC<PDFRendererProps> = ({
  url,
  pageNumber,
  scale = 1.5,
  onPageLoad
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF');
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [url]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      try {
        setIsLoading(true);
        const page = await pdf.getPage(pageNumber);
        
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context!,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        
        if (onPageLoad) {
          onPageLoad(page);
        }
      } catch (err) {
        console.error('Error rendering page:', err);
        setError('Failed to render page');
      } finally {
        setIsLoading(false);
      }
    };

    renderPage();
  }, [pdf, pageNumber, scale, onPageLoad]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="max-w-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default PDFRenderer;