"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Simple types for the demo
interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  fitnessGoal: string;
  createdAt: string;
}

interface UserProgress {
  totalPoints: number;
  level: number;
  streak: number;
  completedWorkouts: number;
}

interface AppState {
  user: UserProfile | null;
  progress: UserProgress | null;
  hasCompletedOnboarding: boolean;
  isPremium: boolean;
}

const initialState: AppState = {
  user: null,
  progress: null,
  hasCompletedOnboarding: false,
  isPremium: false,
};

type Action =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_PROGRESS'; payload: UserProgress }
  | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_STATE' };

function userReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, hasCompletedOnboarding: action.payload };
    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload };
    case 'LOAD_STATE':
      return action.payload;
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface UserContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addPoints: (points: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const addPoints = (points: number) => {
    if (state.progress) {
      const newTotalPoints = state.progress.totalPoints + points;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      
      const updatedProgress: UserProgress = {
        ...state.progress,
        totalPoints: newTotalPoints,
        level: newLevel,
      };
      
      dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    }
  };

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shapeme-app-state');
      if (saved) {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (state.user) {
      try {
        localStorage.setItem('shapeme-app-state', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [state]);

  return (
    <UserContext.Provider value={{
      state,
      dispatch,
      addPoints,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}