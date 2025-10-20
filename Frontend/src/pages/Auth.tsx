import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'hunter' | 'agent'>('hunter'); // Default to property hunter
  const [agentLicense, setAgentLicense] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    login,
    signup
  } = useAuth();
  const {
    theme
  } = useTheme();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Validate password complexity
        const hasMinLength = password.length >= 8;
        const hasLetters = /[A-Za-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        if (!(hasMinLength && hasLetters && hasNumbers)) {
          setError('Password must be at least 8 characters and include letters and numbers');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        // Check agent license if user type is agent
        if (userType === 'agent') {
          if (!agentLicense.trim()) {
            setError('Agent license number is required');
            setLoading(false);
            return;
          }
          // Validate phone number: exactly 8 digits
          const phoneDigitsOnly = /^\d{8}$/;
          if (!phoneDigitsOnly.test(phone)) {
            setError('Phone number must be exactly 8 digits');
            setLoading(false);
            return;
          }
          // Simulate API call to verify agent license
          // In a real app, this would be an actual API call
          const isValidLicense = await verifyAgentLicense(agentLicense);
          if (!isValidLicense) {
            setError('Invalid agent license number');
            setLoading(false);
            return;
          }
        }
        const success = await signup(name, email, password, userType, userType === 'agent' ? phone : undefined, userType === 'agent' ? agentLicense : undefined);
        if (success) {
          navigate('/');
        } else {
          setError('Email already in use');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };
  // Mock function to verify agent license
  // In a real app, this would make an API call to a property agent database
  const verifyAgentLicense = async (license: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // For demo purposes, consider any license number that starts with "AG" as valid
    return license.trim().toUpperCase().startsWith('AG');
  };
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google sign-in
      // In a real app, this would use the Google OAuth API
      const mockGoogleUser = {
        id: `google-${Date.now()}`,
        name: 'Google User',
        email: `user${Date.now()}@gmail.com`,
        userType: 'hunter' // Default to hunter for Google sign-in
      };
      // Store the user in local storage
      localStorage.setItem('user', JSON.stringify(mockGoogleUser));
      // Add to users array if not exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.some((u: any) => u.email === mockGoogleUser.email)) {
        users.push({
          ...mockGoogleUser,
          password: 'google-auth' // Placeholder, not used for login
        });
        localStorage.setItem('users', JSON.stringify(users));
      }
      // Navigate to home page
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
    setLoading(false);
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-md w-full space-y-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-md`}>
        <div>
          <h1 className="text-3xl font-bold text-center">
            <span className="text-blue-600">Crib</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
              Hunter
            </span>
          </h1>
          <h2 className={`mt-6 text-center text-2xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className={`mt-2 text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" className="font-medium text-blue-600 hover:text-blue-500" onClick={toggleMode}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>}
        <form className={`mt-8 space-y-6 ${theme === 'dark' ? 'text-white' : ''}`} onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && <>
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <input id="name" name="name" type="text" required pattern="^[A-Za-z][A-Za-z\s'-]*$" className={`mt-1 block w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="John Doe" value={name} onChange={e => setName(e.target.value.replace(/\d/g, ''))} />
                  <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Letters, spaces, apostrophes, and hyphens only.</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    I am a:
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input id="user-type-hunter" name="userType" type="radio" value="hunter" checked={userType === 'hunter'} onChange={() => setUserType('hunter')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <label htmlFor="user-type-hunter" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Property Hunter
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="user-type-agent" name="userType" type="radio" value="agent" checked={userType === 'agent'} onChange={() => setUserType('agent')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <label htmlFor="user-type-agent" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Real Estate Agent
                      </label>
                    </div>
                  </div>
                </div>
                {userType === 'agent' && <div>
                    <label htmlFor="agentLicense" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Agent License Number
                    </label>
                    <input id="agentLicense" name="agentLicense" type="text" required className={`mt-1 block w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. AG123456" value={agentLicense} onChange={e => setAgentLicense(e.target.value)} />
                    <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      For demo purposes, enter a license number starting with
                      "AG"
                    </p>
                  </div>}
                {userType === 'agent' && <div>
                    <label htmlFor="phone" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" pattern="[0-9]{8}" maxLength={8} className={`mt-1 block w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="8-digit number" value={phone} onChange={e => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setPhone(digitsOnly);
                    }} />
                    <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Must be exactly 8 digits.
                    </p>
                  </div>}
              </>}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email address
              </label>
              <input id="email" name="email" type="email" autoComplete="email" required className={`mt-1 block w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative mt-1">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} required className={`block w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10`} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className={`absolute inset-y-0 right-0 pr-3 flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`} onClick={togglePasswordVisibility} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {!isLogin && <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required className={`block w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10`} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <button type="button" className={`absolute inset-y-0 right-0 pr-3 flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`} onClick={toggleConfirmPasswordVisibility} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>}
          </div>
          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6">
            <button type="button" onClick={handleGoogleSignIn} disabled={loading} className={`w-full flex justify-center items-center py-2 px-4 border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-md shadow-sm text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
              <GoogleIcon className="h-5 w-5 mr-2" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Auth;