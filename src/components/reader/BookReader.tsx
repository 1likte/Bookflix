import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize, Minimize, Volume2, VolumeX, Languages } from 'lucide-react';
import useSound from 'use-sound';
import $ from 'jquery';
import 'turn.js';
import Button from '../ui/Button';
import PDFRenderer from './PDFRenderer';
import { downloadPdfFromDrive } from '../../utils/googleDrive';

interface BookReaderProps {
  pdfUrl: string;
  onClose?: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ pdfUrl, onClose }) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const { t, i18n } = useTranslation();
  
  // Page turn sound effect
  const [playPageTurn] = useSound('/sounds/page-flip.mp3', { 
    volume: 0.5,
    soundEnabled: isSoundEnabled 
  });

  useEffect(() => {
    const loadPdf = async () => {
      if (pdfUrl.includes('drive.google.com')) {
        const fileId = pdfUrl.match(/[-\w]{25,}/)?.[0];
        if (fileId) {
          const blob = await downloadPdfFromDrive(fileId);
          if (blob) {
            setPdfBlob(blob);
          }
        }
      }
    };

    loadPdf();
  }, [pdfUrl]);

  useEffect(() => {
    if (bookRef.current && pdfBlob) {
      $(bookRef.current).turn({
        width: 1000,
        height: 800,
        autoCenter: true,
        gradients: true,
        acceleration: true,
        elevation: 50,
        display: 'double',
        when: {
          turning: function(event: Event, page: number) {
            if (isSoundEnabled) {
              playPageTurn();
            }
          }
        }
      });

      // Make it responsive
      $(window).resize(() => {
        if (bookRef.current) {
          const width = Math.min(1000, window.innerWidth - 40);
          const height = (width / 1000) * 800;
          $(bookRef.current).turn('size', width, height);
        }
      });
    }

    return () => {
      if (bookRef.current) {
        $(bookRef.current).turn('destroy');
      }
    };
  }, [pdfBlob, playPageTurn, isSoundEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
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

  return (
    <div className="relative w-full h-screen bg-slate-900 flex items-center justify-center">
      {/* Controls */}
      <div className="fixed top-4 right-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-white"
          title={t('reader.language')}
        >
          <Languages className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSound}
          className="text-white"
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
          className="text-white"
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
      <div 
        ref={bookRef}
        className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
      >
        {pdfBlob && Array.from({ length: totalPages }).map((_, i) => (
          <div key={i} className="page">
            <PDFRenderer
              url={URL.createObjectURL(pdfBlob)}
              pageNumber={i + 1}
              onPageLoad={() => {
                if (i === 0) setTotalPages(totalPages);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookReader;