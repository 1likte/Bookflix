import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SignupSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus('error');
        setError('Invalid session ID');
        return;
      }

      try {
        // Verify the payment session
        const response = await fetch('/.netlify/functions/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Complete user registration
        await signUp(data.email, data.password, data.displayName);
        setStatus('success');
        
        // Redirect to library after 3 seconds
        setTimeout(() => {
          navigate('/library');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setError(error.message || 'Failed to verify payment');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, signUp]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Verifying Payment
            </h2>
            <p className="text-slate-400">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-slate-400 mb-4">
              Your account has been created successfully.
            </p>
            <p className="text-slate-500 text-sm">
              Redirecting to your library...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Return to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupSuccessPage;