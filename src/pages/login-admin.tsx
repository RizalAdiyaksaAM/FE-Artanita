// src/pages/login-admin.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useAuth } from '@/context/auth';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#379777] ${
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#379777] ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
                disabled={isSubmitting}
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
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
            className="w-full bg-[#379777] hover:bg-[#4eba55] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fd068] focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Back to website link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-[#379777] hover:text-[#4eba55] text-sm font-medium"
          >
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}