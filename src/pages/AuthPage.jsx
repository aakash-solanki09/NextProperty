import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../api/context/AuthContext';

const AuthPage = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/auth/signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Update isSignUp state when location changes
  useEffect(() => {
    setIsSignUp(location.pathname === '/auth/signup');
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (isSignUp && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let result;
      if (isSignUp) {
        result = await signup(formData.username, formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }
      
     if (result.success) {
  toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!');
  navigate(isSignUp ? '/auth/login' : '/');
}
 else {
        toast.error(result.message);
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    setFormData({ username: '', email: '', password: '' });
    setErrors({});
    // Update URL to match the mode
    navigate(newMode ? '/auth/signup' : '/auth/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 font-urbanist">
      <div className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl h-[600px] transition-all duration-700 ease-in-out ${isSignUp ? 'active' : ''}`}>
        
        {/* Main Form Container */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
            isSignUp ? 'translate-x-full' : 'translate-x-0'
          } z-20`}
        >
          <div className="flex items-center justify-center h-full bg-white">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-12 w-full">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </h1>
              
              {/* Social Icons */}
              <div className="flex space-x-3 mb-5">
                <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <i className="fab fa-google text-red-500 text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <i className="fab fa-facebook-f text-blue-600 text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <i className="fab fa-github text-gray-800 text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <i className="fab fa-linkedin-in text-blue-700 text-sm"></i>
                </a>
              </div>
              
              <span className="text-sm text-gray-600 mb-5">
                {isSignUp ? 'or use your details for registration' : 'or use your email password'}
              </span>
              
              {/* Conditional Name Field - Only for Sign Up */}
              {isSignUp && (
                <div className="w-full">
                  <input
                    type="text"
                    name="username"
                    placeholder="Name"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-gray-100 border-0 my-2 p-3 text-sm rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.username && <p className="text-xs text-red-600 self-start mb-1">{errors.username}</p>}
                </div>
              )}
              
              {/* Email Field */}
              <div className="w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-gray-100 border-0 my-2 p-3 text-sm rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.email && <p className="text-xs text-red-600 self-start mb-1">{errors.email}</p>}
              </div>
              
              {/* Password Field */}
              <div className="w-full">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-gray-100 border-0 my-2 p-3 text-sm rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.password && <p className="text-xs text-red-600 self-start mb-1">{errors.password}</p>}
              </div>
              
              {/* Forgot Password Link - Only for Sign In */}
              {!isSignUp && (
                <a href="#" className="text-gray-600 text-sm no-underline my-4 hover:text-purple-700 transition-colors">
                  Forget Your Password?
                </a>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-700 text-white text-sm py-3 px-12 border-0 rounded-full font-semibold tracking-wider uppercase mt-4 cursor-pointer hover:bg-purple-800 transition-colors disabled:opacity-50"
              >
                {loading 
                  ? (isSignUp ? 'Creating...' : 'Signing In...') 
                  : (isSignUp ? 'SIGN UP' : 'SIGN IN')
                }
              </button>
            </form>
          </div>
        </div>

        {/* Toggle Container */}
        <div 
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-50 ${
            isSignUp 
              ? '-translate-x-full rounded-r-[150px] rounded-bl-[100px]' 
              : 'translate-x-0 rounded-l-[150px] rounded-br-[100px]'
          }`}
        >
          <div className={`bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 h-full relative -left-full w-[200%] transition-all duration-700 ease-in-out ${
            isSignUp ? 'translate-x-1/2' : 'translate-x-0'
          }`}>
            
            {/* Toggle Left Panel - Shows when in SignUp mode */}
            <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col p-8 text-center top-0 transition-all duration-700 ease-in-out text-white ${
              isSignUp ? 'translate-x-0' : '-translate-x-[200%]'
            }`}>
              <h1 className="text-4xl font-bold mb-5">Already a Member?</h1>
              <p className="text-sm leading-6 tracking-wide mb-8 px-4">
                Sign in with your account to access your dashboard
              </p>
              <button
                onClick={toggleMode}
                className="bg-transparent border-2 border-white text-white text-sm py-3 px-10 rounded-full font-semibold tracking-wider uppercase cursor-pointer hover:bg-white hover:text-purple-700 transition-all duration-300"
              >
                SIGN IN
              </button>
            </div>

            {/* Toggle Right Panel - Shows when in SignIn mode */}
            <div className={`absolute right-0 w-1/2 h-full flex items-center justify-center flex-col p-8 text-center top-0 transition-all duration-700 ease-in-out text-white ${
              isSignUp ? 'translate-x-[200%]' : 'translate-x-0'
            }`}>
              <h1 className="text-4xl font-bold mb-5">New Here?</h1>
              <p className="text-sm leading-6 tracking-wide mb-8 px-4">
                Create an account and start listing your properties today
              </p>
              <button
                onClick={toggleMode}
                className="bg-transparent border-2 border-white text-white text-sm py-3 px-10 rounded-full font-semibold tracking-wider uppercase cursor-pointer hover:bg-white hover:text-purple-700 transition-all duration-300"
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
