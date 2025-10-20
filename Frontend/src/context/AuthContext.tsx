import React, { useEffect, useState, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://fqjuaftiullmryhpnvgt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxanVhZnRpdWxsbXJ5aHBudmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTIxMDksImV4cCI6MjA3NjQ2ODEwOX0.I2BELQBxwhb6-6PS_580t0uInmRmPE7BkP5aSvE56X4';
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'hunter' | 'agent';
  phone?: string;
  agentLicense?: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    userType: 'hunter' | 'agent',
    phone?: string,
    agentLicense?: string
  ) => Promise<boolean>;
  checkAgentRegistrationExists: (registrationNo: string) => Promise<boolean>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in from sessionStorage (persists during browser session only)
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Hash password the same way as signup (base64 encoding for demo)
      const passwordHash = btoa(password);

      // Query user from Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', passwordHash)
        .limit(1);

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (!users || users.length === 0) {
        return false;
      }

      const userData = users[0];
      
      const authenticatedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        userType: userData.user_type,
        phone: userData.phone,
        agentLicense: userData.agent_license
      };

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      sessionStorage.setItem('user', JSON.stringify(authenticatedUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const checkAgentRegistrationExists = async (registrationNo: string): Promise<boolean> => {
    const normalized = registrationNo.trim().toUpperCase();
    if (!normalized) return false;
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('agent_license', normalized)
      .limit(1);
    if (error) {
      console.error('Check agent registration error:', error);
      return false;
    }
    return !!(data && data.length > 0);
  };
  const signup = async (name: string, email: string, password: string, userType: 'hunter' | 'agent' = 'hunter', phone?: string, agentLicense?: string): Promise<boolean> => {
    try {
      // Simple password hashing (in production, this should be done on the backend)
      const passwordHash = btoa(password); // Simple base64 encoding for demo

      // Prepare user data for Supabase
      const normalizedAgentLicense = agentLicense ? agentLicense.trim().toUpperCase() : undefined;

      // Enforce unique agent license if provided
      if (userType === 'agent' && normalizedAgentLicense) {
        const { data: existing, error: existingErr } = await supabase
          .from('users')
          .select('id')
          .eq('agent_license', normalizedAgentLicense)
          .limit(1);
        if (existingErr) {
          console.error('Signup check error:', existingErr);
          return false;
        }
        if (existing && existing.length > 0) {
          // License already used
          return false;
        }
      }

      const userData = {
        name,
        email,
        password_hash: passwordHash,
        user_type: userType,
        ...(userType === 'agent' && phone && { phone }),
        ...(userType === 'agent' && normalizedAgentLicense && { agent_license: normalizedAgentLicense })
      };

      // Insert user directly into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();

      if (error) {
        console.error('Signup error:', error);
        return false;
      }

      if (data && data.length > 0) {
        const newUser = data[0];
        
        // Auto login after signup
        const authenticatedUser: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          userType: newUser.user_type,
          phone: newUser.phone,
          agentLicense: newUser.agent_license
        };

        setUser(authenticatedUser);
        setIsAuthenticated(true);
        sessionStorage.setItem('user', JSON.stringify(authenticatedUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    checkAgentRegistrationExists,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
};