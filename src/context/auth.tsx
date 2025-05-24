// src/context/auth.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,

} from "react";
import { 

  getAuthUser, 
  setAuthCookies, 
  clearAuthCookies, 
  isAdmin as checkIsAdmin, 
  isAuthenticated, 
  type UserData,
  type TokenData
} from "@/utils/auth";

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (userData: UserData, tokenData: TokenData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userData = getAuthUser();
        const authenticated = isAuthenticated();
        
        setUser(userData);
        setIsUserAuthenticated(authenticated);
        setIsUserAdmin(checkIsAdmin());
      } catch (error) {
        console.error("Error initializing auth state:", error);
        // Reset auth state on error
        setUser(null);
        setIsUserAuthenticated(false);
        setIsUserAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: UserData, tokenData: TokenData) => {
    setAuthCookies(userData, tokenData);
    setUser(userData);
    setIsUserAuthenticated(true);
    setIsUserAdmin(userData.role === 'admin');
  };

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    setIsUserAuthenticated(false);
    setIsUserAdmin(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: isUserAuthenticated,
        isAdmin: isUserAdmin,
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}