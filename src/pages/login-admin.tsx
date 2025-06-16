// src/pages/login-admin.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useAuth } from '@/context/auth';
import { Eye, EyeOff, Lock, LockIcon, Mail } from 'lucide-react';
import { useAuthLoginMutation } from '@/api/auth/auth-login';
import { Button } from '@/components/ui/button';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Get intended destination if redirected from a protected route
  const from = location.state?.from?.pathname || '/admin/dashboard';
  
  // React Query mutation for login
  const loginMutation = useAuthLoginMutation();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle login form submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      
      // Check if the user has admin role
      if (response.data.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        return;
      }
      
      // Successfully logged in as admin
      const userData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };
      
      const tokenData = {
        token: response.data.token,
      };
      
      // Save auth data in context and cookies
      auth.login(userData, tokenData);
      
      // Success notification
      toast.success('Login successful!');
      
      // Navigate to admin dashboard or intended destination
      navigate(from, { replace: true });
    } catch (error: any) {
      // Handle different error cases
      const errorMessage =
        error.response?.data?.meta?.message ||
        'Unable to login. Please check your credentials.';
      
      toast.error(errorMessage);
    }
  };

  // If already logged in and is admin, redirect to admin dashboard
  if (auth.isAuthenticated && auth.isAdmin && !auth.isLoading) {
    navigate('/admin/donation', { replace: true });
    return null;
  }

  return (
    <>
      {/* CSS Styles */}
      <style >{`
        .gradient-background {
          background: linear-gradient(300deg, #f4ce14, #379777, #ffffff);
          background-size: 180% 180%;
          animation: gradient-animation 18s ease infinite;
        }
        
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .floating-animation {
          animation: floating 6s ease-in-out infinite;
        }
        
        @keyframes floating {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      <div className="gradient-background min-h-screen flex items-center justify-center px-4">
        <div className="glass-effect floating-animation p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-[#379777] to-[#f4ce14] rounded-full flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="!text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email
              </label>
              <div className="relative">
                <div className="absolute z-1 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`pl-10 w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#379777] focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('email')}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute z-1  inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400 " />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#379777] focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('password')}
                  disabled={isSubmitting}
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-[#379777] transition-colors" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#379777] to-[#4eba55] hover:from-[#4eba55] hover:to-[#379777] text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5fd068] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Back to website link */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-[#379777] hover:text-[#4eba55] text-sm font-medium transition-colors duration-200 hover:underline"
            >
              ← Back to Website
            </button>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#f4ce14]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#379777]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-white/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-1/4 right-20 w-24 h-24 bg-[#f4ce14]/30 rounded-full blur-lg animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>
    </>
  );
}