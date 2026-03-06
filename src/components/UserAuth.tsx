import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { authService, User } from '../services/supabaseClient';

interface UserAuthProps {
  onAuthSuccess: (user: User) => void;
  onClose: () => void;
}

export const UserAuth: React.FC<UserAuthProps> = ({ onAuthSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let user: User | null;

      if (isLogin) {
        user = await authService.signIn(formData.email, formData.password);
      } else {
        user = await authService.signUp(formData.email, formData.password, formData.name);
      }

      if (user) {
        onAuthSuccess(user);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrors({
        general: error.message || 'Authentication failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f8fafc 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradient-shift 15s ease infinite'
    }}>
      <div className="liquid-glass max-w-md w-full shadow-2xl border-2 border-white/40 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/30 liquid-nav">
          <div className="text-center">
            <div className="w-20 h-20 liquid-glass-button rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float shadow-2xl">
              <span className="text-3xl">🐾</span>
            </div>
            <h2 className="text-3xl font-bold text-dogswab-navy mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-dogswab-navy/70 font-medium">
              {isLogin ? 'Sign in to access your pet health records' : 'Join DOGSWAB to get started'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errors.general && (
            <div className="liquid-glass border-2 border-red-300 rounded-2xl p-4">
              <p className="text-sm text-red-700 font-medium">{errors.general}</p>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-dogswab-navy mb-2">
                Full Name (Optional)
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dogswab-navy/40" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 liquid-glass border-2 border-white/40 rounded-2xl text-dogswab-navy font-medium focus:ring-2 focus:ring-dogswab-mint focus:border-dogswab-mint transition-all"
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-dogswab-navy mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dogswab-navy/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full pl-12 pr-4 py-4 liquid-glass border-2 rounded-2xl text-dogswab-navy font-medium focus:ring-2 focus:ring-dogswab-mint focus:border-dogswab-mint transition-all ${
                  errors.email ? 'border-red-300' : 'border-white/40'
                }`}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 font-medium mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-dogswab-navy mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dogswab-navy/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full pl-12 pr-14 py-4 liquid-glass border-2 rounded-2xl text-dogswab-navy font-medium focus:ring-2 focus:ring-dogswab-mint focus:border-dogswab-mint transition-all ${
                  errors.password ? 'border-red-300' : 'border-white/40'
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dogswab-navy/40 hover:text-dogswab-navy transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 font-medium mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-dogswab-navy mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dogswab-navy/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full pl-12 pr-4 py-4 liquid-glass border-2 rounded-2xl text-dogswab-navy font-medium focus:ring-2 focus:ring-dogswab-mint focus:border-dogswab-mint transition-all ${
                    errors.confirmPassword ? 'border-red-300' : 'border-white/40'
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 font-medium mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full liquid-glass-button text-white py-4 px-6 rounded-2xl disabled:opacity-50 transition-all duration-300 font-bold text-lg flex items-center justify-center hover:scale-105 shadow-2xl mt-6"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-dogswab-mint hover:text-dogswab-navy font-bold transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>

        <div className="px-8 pb-8">
          <div className="liquid-glass border-2 border-dogswab-mint/30 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-dogswab-mint mt-0.5 flex-shrink-0" />
              <p className="text-sm text-dogswab-navy font-medium">
                Your data is encrypted and secure. We follow HIPAA guidelines for health information protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};