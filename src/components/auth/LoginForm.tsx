import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await signIn(email, password);
      navigate('/browse');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md space-y-4 bg-slate-900 p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-6">Sign In</h2>
      
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        leftIcon={<Mail size={18} />}
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        leftIcon={<Lock size={18} />}
      />
      
      <Button 
        type="submit" 
        className="w-full" 
        isLoading={isAuthLoading}
        rightIcon={<LogIn size={18} />}
      >
        Sign In
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;