import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (email) => {
    const newUser = {
      email,
      isPremium: false,
      usage: 0,
      lastReset: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const checkUsageLimit = () => {
    if (!user) return false;
    if (user.isPremium) return true;
    
    const now = new Date();
    const lastReset = new Date(user.lastReset);
    
    // Reset usage if it's a new month
    if (lastReset.getMonth() !== now.getMonth() || 
        lastReset.getFullYear() !== now.getFullYear()) {
      const updatedUser = {
        ...user,
        usage: 0,
        lastReset: now.toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    }
    
    // Check if under free tier limit
    return user.usage < 6;
  };

  const incrementUsage = () => {
    if (!user || user.isPremium) return;
    
    const updatedUser = {
      ...user,
      usage: user.usage + 1
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      checkUsageLimit,
      incrementUsage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}