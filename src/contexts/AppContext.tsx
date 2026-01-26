import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  // User state
  userEmail: string;
  setUserEmail: (email: string) => void;
  isLoggedIn: boolean;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  logout: () => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  favoritesLoading: boolean;
  
  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmailState] = useState('');
  const [userRole, setUserRoleState] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Load favorites from Supabase for logged-in users
  const loadFavoritesFromSupabase = useCallback(async (uid: string) => {
    try {
      setFavoritesLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select('property_id')
        .eq('user_id', uid);
      
      if (error) {
        // Table might not exist, fall back to localStorage
        console.log('Favorites table not available, using localStorage');
        return false;
      }
      
      if (data) {
        const favoriteIds = data.map(item => item.property_id);
        setFavorites(favoriteIds);
        // Also update localStorage as backup
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
        return true;
      }
    } catch (e) {
      console.error('Error loading favorites from Supabase:', e);
    } finally {
      setFavoritesLoading(false);
    }
    return false;
  }, []);

  // Sync favorites to Supabase for logged-in users
  const syncFavoriteToSupabase = useCallback(async (uid: string, propertyId: string, add: boolean) => {
    try {
      if (add) {
        await supabase
          .from('user_favorites')
          .upsert({ user_id: uid, property_id: propertyId }, { onConflict: 'user_id,property_id' });
      } else {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', uid)
          .eq('property_id', propertyId);
      }
    } catch (e) {
      console.error('Error syncing favorite to Supabase:', e);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) setUserEmailState(storedEmail);
        
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) setUserRoleState(storedRole);
        
        // Load favorites from localStorage first
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

        // Check session for role and user ID
        const session = localStorage.getItem('session');
        if (session) {
          const parsedSession = JSON.parse(session);
          if (parsedSession?.user?.role) {
            setUserRoleState(parsedSession.user.role);
          }
          if (parsedSession?.user?.email) {
            setUserEmailState(parsedSession.user.email);
          }
          if (parsedSession?.user?.id) {
            setUserId(parsedSession.user.id);
            // Try to load favorites from Supabase for logged-in users
            loadFavoritesFromSupabase(parsedSession.user.id);
          }
        }

        // Also check Supabase auth session
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        if (supabaseSession?.user) {
          setUserId(supabaseSession.user.id);
          setUserEmailState(supabaseSession.user.email || '');
          loadFavoritesFromSupabase(supabaseSession.user.id);
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id);
        setUserEmailState(session.user.email || '');
        loadFavoritesFromSupabase(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        // Keep localStorage favorites for non-authenticated use
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadFavoritesFromSupabase]);

  const setUserEmail = (email: string) => {
    setUserEmailState(email);
    try {
      if (email) {
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('userEmail');
      }
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  const setUserRole = (role: string | null) => {
    setUserRoleState(role);
    try {
      if (role) {
        localStorage.setItem('userRole', role);
      } else {
        localStorage.removeItem('userRole');
      }
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  const logout = () => {
    setUserEmail('');
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem('session');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminSession');
    supabase.auth.signOut();
  };

  const toggleFavorite = useCallback((propertyId: string) => {
    const isCurrentlyFavorite = favorites.includes(propertyId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    
    // Save to localStorage
    try {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }

    // Sync to Supabase if logged in
    if (userId) {
      syncFavoriteToSupabase(userId, propertyId, !isCurrentlyFavorite);
    }
  }, [favorites, userId, syncFavoriteToSupabase]);

  const isFavorite = useCallback((propertyId: string) => favorites.includes(propertyId), [favorites]);

  return (
    <AppContext.Provider
      value={{
        userEmail,
        setUserEmail,
        isLoggedIn: !!userEmail,
        userRole,
        setUserRole,
        logout,
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesLoading,
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
