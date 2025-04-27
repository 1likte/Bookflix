import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useBooks } from '../../hooks/useBooks';

interface BookUploaderProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BookUploader: React.FC<BookUploaderProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverURL, setCoverURL] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addBook } = useBooks();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      // Validate if it's a PDF
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      
      setFile(selectedFile);
      
      // Try to extract title from filename
      if (!title) {
        const fileName = selectedFile.name.replace('.pdf', '');
        setTitle(fileName);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const droppedFile = e.dataTransfer.files?.[0];
    
    if (droppedFile) {
      // Validate if it's a PDF
      if (droppedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      
      setFile(droppedFile);
      
      // Try to extract title from filename
      if (!title) {
        const fileName = droppedFile.name.replace('.pdf', '');
        setTitle(fileName);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    
    if (!title) {
      setError('Please enter a title');
      return;
    }
    
    if (!author) {
      setError('Please enter an author');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Use a default cover if none provided
      const finalCoverURL = coverURL || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
      
      const result = await addBook(file, title, author, description, finalCoverURL);
      
      if (result) {
        onSuccess();
      } else {
        setError('Failed to upload book');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to upload book');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Upload Book</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {/* File Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 
              flex flex-col items-center justify-center 
              cursor-pointer transition-colors
              ${file ? 'border-blue-500 bg-blue-900/10' : 'border-slate-700 hover:border-slate-500'}
            `}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            
            {file ? (
              <div className="text-center">
                <FileText size={40} className="mx-auto mb-2 text-blue-500" />
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-slate-400 text-sm">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Upload size={40} className="mx-auto mb-2 text-slate-400" />
                <p className="text-white font-medium">Drag & drop your PDF here</p>
                <p className="text-slate-400 text-sm">or click to browse files</p>
              </div>
            )}
          </div>
          
          {/* Book Details */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            required
          />
          
          <Input
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            required
          />
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description (optional)"
              className="flex w-full rounded-md border border-gray-700 bg-slate-900 px-3 py-2 text-sm 
              placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1
              focus-visible:ring-slate-400 focus-visible:ring-offset-1 min-h-[100px]"
            />
          </div>
          
          <Input
            label="Cover Image URL"
            value={coverURL}
            onChange={(e) => setCoverURL(e.target.value)}
            placeholder="Enter cover image URL (optional)"
          />
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-700">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isUploading}
              disabled={!file || !title || !author}
            >
              Upload Book
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookUploader;