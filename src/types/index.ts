export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  subscription: SubscriptionStatus;
  favorites: string[]; // Array of book IDs
  hasCompletedRegistration: boolean;
}

export type SubscriptionStatus = 'free' | 'basic' | 'premium' | 'none';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverURL: string;
  description: string;
  categories: string[];
  pdfURL: string;
  totalPages: number;
  createdAt: Date;
  addedBy: string; // userId
}

export interface ReadingProgress {
  bookId: string;
  userId: string;
  currentPage: number;
  lastReadAt: Date;
  bookmarks: number[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}