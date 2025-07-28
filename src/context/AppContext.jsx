import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AppContext = createContext();

const initialState = {
  user: null,
  session: null,
  niches: [],
  keywords: [],
  content: [],
  sites: [],
  loading: true,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SESSION':
      return { ...state, session: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_NICHES':
      return { ...state, niches: action.payload };
    case 'ADD_NICHE':
      return { ...state, niches: [...state.niches, action.payload] };
    case 'UPDATE_NICHE':
      return {
        ...state,
        niches: state.niches.map(niche =>
          niche.id === action.payload.id ? action.payload : niche
        )
      };
    case 'DELETE_NICHE':
      return {
        ...state,
        niches: state.niches.filter(niche => niche.id !== action.payload)
      };
    case 'SET_KEYWORDS':
      return { ...state, keywords: action.payload };
    case 'ADD_CONTENT':
      return { ...state, content: [...state.content, action.payload] };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'ADD_SITE':
      return { ...state, sites: [...state.sites, action.payload] };
    case 'SET_SITES':
      return { ...state, sites: action.payload };
    case 'UPDATE_SITE':
      return {
        ...state,
        sites: state.sites.map(site =>
          site.id === action.payload.id ? action.payload : site
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize Supabase auth listener
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_SESSION', payload: session });
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      dispatch({ type: 'SET_SESSION', payload: session });
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        dispatch({ type: 'SET_USER', payload: data });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const signUp = async (email, password, name) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              plan_type: 'free'
            }
          ]);

        if (profileError) throw profileError;
      }

      return { success: true, data };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signIn = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Legacy methods - these will be replaced by service layer
  const addNiche = (nicheData) => {
    console.warn('addNiche is deprecated, use nicheService instead');
    dispatch({ type: 'ADD_NICHE', payload: nicheData });
    return nicheData;
  };

  const generateKeywords = (niche) => {
    console.warn('generateKeywords is deprecated, use aiService instead');
    return [];
  };

  const generateContent = async (contentRequest) => {
    console.warn('generateContent is deprecated, use aiService instead');
    return null;
  };

  const createSite = (siteData) => {
    console.warn('createSite is deprecated, use nicheSiteService instead');
    dispatch({ type: 'ADD_SITE', payload: siteData });
    return siteData;
  };

  const value = {
    ...state,
    // New auth methods
    signUp,
    signIn,
    signOut,
    // Legacy methods (deprecated)
    login: signIn,
    logout: signOut,
    addNiche,
    generateKeywords,
    generateContent,
    createSite,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
