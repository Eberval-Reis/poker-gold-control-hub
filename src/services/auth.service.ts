
// Authentication service to manage user login, registration and session

import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

// Login function
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
  console.log('Attempting login with:', credentials.email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao fazer login' 
    };
  }
};

// Register function
export const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
  console.log('Attempting registration with:', data.email);
  
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name || '',
        },
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao registrar usuário' 
    };
  }
};

// Logout function
export const logout = async (): Promise<{ success: boolean }> => {
  console.log('Logging out user');
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    toast({
      variant: "destructive",
      title: "Erro ao sair",
      description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
    });
    return { success: false };
  }
};

// Check if user is authenticated
export const checkAuth = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Export authService object for components that expect it
export const authService = {
  login,
  register,
  logout,
  checkAuth
};
