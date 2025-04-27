import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="ml-2 text-2xl font-bold text-white">Bookflix</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-slate-400">Start your reading journey today</p>
        </div>
        
        <SignupForm />
        
        <p className="mt-8 text-center text-sm text-slate-500">
          By signing up, you agree to our{' '}
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

export default SignupPage;