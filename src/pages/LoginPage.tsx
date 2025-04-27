import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="ml-2 text-2xl font-bold text-white">Bookflix</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-slate-400">Sign in to your account</p>
        </div>
        
        <LoginForm />
        
        <p className="mt-8 text-center text-sm text-slate-500">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;