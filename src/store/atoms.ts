import { atom } from 'jotai';
import { User, Book, ReadingProgress } from '../types';

export const currentUserAtom = atom<User | null>(null);
export const isAuthLoadingAtom = atom<boolean>(true);
export const isLoadingAtom = atom<boolean>(false);

export const booksAtom = atom<Book[]>([]);
export const currentBookAtom = atom<Book | null>(null);
export const readingProgressAtom = atom<ReadingProgress | null>(null);

export const themeAtom = atom<'light' | 'dark'>('dark');