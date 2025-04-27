import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize, Minimize, Volume2, VolumeX, Languages, ChevronLeft, ChevronRight } from 'lucide-react';
import useSound from 'use-sound';
import HTMLFlipBook from 'react-pageflip';
import Button from '../ui/Button';
import PDFRenderer from './PDFRenderer';

interface PDFViewerProps {
  url: string;
  onClose?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState<JSX.Element[]>([]);
  const { t, i18n } = useTranslation();

  // Page turn sound effect
  const [playPageTurn] = useSound('/sounds/page-flip.mp3', { 
    volume: 0.5,
    soundEnabled: isSoundEnabled 
  });

  useEffect(() => {
    const loadPages = async () => {
      // Create an array of page components
      const pageComponents = Array.from({ length: totalPages }, (_, i) => (
        <div key={i} className="relative bg-white shadow-md">
          <PDFRenderer
            url={url}
            pageNumber={i + 1}
            onPageLoad={(page) => {
              if (i === 0) {
                setTotalPages(page.numPages);
              }
            }}
          />
        </div>
      ));
      setPages(pageComponents);
    };

    loadPages();
  }, [url, totalPages]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLanguage(newLang);
  };

  const handlePageFlip = (e: any) => {
    setCurrentPage(e.data + 1);
    if (isSoundEnabled) {
      playPageTurn();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-slate-900 flex items-center justify-center"
    >
      {/* Top Controls */}
      <div className="fixed top-4 right-4 flex items-center space-x-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-white hover:bg-white/10"
          title={t('reader.language')}
        >
          <Languages className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSound}
          className="text-white hover:bg-white/10"
          title={t('reader.sound')}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/10"
          title={t('reader.fullscreen')}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Book Container */}
      <div className="relative max-w-6xl w-full mx-auto">
        <HTMLFlipBook
          ref={bookRef}
          width={600}
          height={800}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1000}
          drawShadow={true}
          flippingTime={1000}
          className="mx-auto"
          startPage={currentPage}
          onFlip={handlePageFlip}
          showCover={true}
        >
          {pages}
        </HTMLFlipBook>
      </div>

      {/* Navigation Controls */}
      <Button
        variant="ghost"
        className="fixed left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-50"
        onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
        title={t('reader.previousPage')}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <Button
        variant="ghost"
        className="fixed right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-50"
        onClick={() => bookRef.current?.pageFlip()?.flipNext()}
        title={t('reader.nextPage')}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Page Counter */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full z-50">
        {t('reader.page')} {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default PDFViewer;