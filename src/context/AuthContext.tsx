import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  patient: {
    id: 'pat-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'patient',
    phone: '+1 (555) 234-8901',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    created_at: '2026-01-15T00:00:00Z'
  },
  doctor: {
    id: 'doc-1',
    name: 'Dr. Arman Rahman',
    email: 'arman.rahman@apexhealth.org',
    role: 'doctor',
    phone: '+1 (555) 890-1234',
    specialty: 'Cardiologist',
    hospital_id: 'hosp-1',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-06-10T00:00:00Z'
  },
  hospital_admin: {
    id: 'adm-1',
    name: 'Dr. Robert Sullivan',
    email: 'admin@apexhealth.org',
    role: 'hospital_admin',
    phone: '+1 (555) 300-8800',
    hospital_id: 'hosp-1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-01T00:00:00Z'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('mediconnect_role');
    return (savedRole as UserRole) || 'patient';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('mediconnect_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return DEFAULT_USERS.patient;
      }
    }
    return DEFAULT_USERS.patient;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediconnect_user', JSON.stringify(user));
      localStorage.setItem('mediconnect_role', user.role);
    } else {
      localStorage.removeItem('mediconnect_user');
      localStorage.removeItem('mediconnect_role');
    }
  }, [user]);

  const login = async (email: string, targetRole: UserRole = 'patient') => {
    const matchedProfile = {
      ...DEFAULT_USERS[targetRole],
      email: email || DEFAULT_USERS[targetRole].email
    };
    setUser(matchedProfile);
    setRole(targetRole);
    return true;
  };

  const register = async (name: string, email: string, selectedRole: UserRole) => {
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: selectedRole,
      avatar: selectedRole === 'doctor' 
        ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString()
    };
    setUser(newProfile);
    setRole(selectedRole);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setUser(DEFAULT_USERS[newRole]);
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || role,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
