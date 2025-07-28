import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const initialState = {
  user: null,
  niches: [],
  keywords: [],
  content: [],
  sites: [],
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'ADD_NICHE':
      return { ...state, niches: [...state.niches, action.payload] };
    case 'SET_KEYWORDS':
      return { ...state, keywords: action.payload };
    case 'ADD_CONTENT':
      return { ...state, content: [...state.content, action.payload] };
    case 'ADD_SITE':
      return { ...state, sites: [...state.sites, action.payload] };
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

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('niche_builder_user');
    if (storedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
    }
  }, []);

  const login = (userData) => {
    const user = { ...userData, id: uuidv4(), planType: 'free' };
    localStorage.setItem('niche_builder_user', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('niche_builder_user');
    dispatch({ type: 'LOGOUT' });
  };

  const addNiche = (nicheData) => {
    const niche = {
      id: uuidv4(),
      ...nicheData,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_NICHE', payload: niche });
    return niche;
  };

  const generateKeywords = (niche) => {
    // Mock keyword generation
    const keywords = [
      { id: uuidv4(), name: `${niche} guide`, searchVolume: 2400, competitionLevel: 'low', cpcValue: 1.50 },
      { id: uuidv4(), name: `best ${niche}`, searchVolume: 1800, competitionLevel: 'medium', cpcValue: 2.20 },
      { id: uuidv4(), name: `${niche} tips`, searchVolume: 3200, competitionLevel: 'low', cpcValue: 1.80 },
      { id: uuidv4(), name: `${niche} reviews`, searchVolume: 1500, competitionLevel: 'high', cpcValue: 3.40 },
      { id: uuidv4(), name: `how to ${niche}`, searchVolume: 2800, competitionLevel: 'medium', cpcValue: 2.10 }
    ];
    dispatch({ type: 'SET_KEYWORDS', payload: keywords });
    return keywords;
  };

  const generateContent = async (contentRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock content generation - in real app, this would call OpenAI API
      const content = {
        id: uuidv4(),
        title: contentRequest.title,
        body: `This is AI-generated content about ${contentRequest.topic}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        imageUrl: 'https://via.placeholder.com/600x400',
        wordCount: 150,
        readingTime: 1,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'ADD_CONTENT', payload: content });
      return content;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createSite = (siteData) => {
    const site = {
      id: uuidv4(),
      ...siteData,
      revenue: 0,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_SITE', payload: site });
    return site;
  };

  const value = {
    ...state,
    login,
    logout,
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