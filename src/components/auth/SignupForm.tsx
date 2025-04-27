import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !confirmPassword || !displayName) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Create a payment session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          displayName,
          password, // We'll need this for user creation after payment
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
      setIsProcessingPayment(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md space-y-4 bg-slate-900 p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h2>
      
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Name"
        type="text"
        placeholder="Enter your name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
        leftIcon={<User size={18} />}
      />
      
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
      
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        leftIcon={<Lock size={18} />}
      />

      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Registration Fee</span>
          <span className="text-white font-bold">€1.00</span>
        </div>
        <p className="text-sm text-blue-200">One-time payment for lifetime access</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        isLoading={isAuthLoading || isProcessingPayment}
        rightIcon={isProcessingPayment ? <CreditCard size={18} /> : <UserPlus size={18} />}
      >
        {isProcessingPayment ? 'Processing Payment...' : 'Sign Up'}
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;