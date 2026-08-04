import { createContext, useContext, useReducer, type ReactNode } from 'react';

/**
 * Terminal application state
 */
interface TerminalState {
  bootCompleted: boolean;
  currentSection: string;
  commandHistory: string[];
  isWindowOpen: boolean;
}

/**
 * Actions for the terminal reducer
 */
type TerminalAction =
  | { type: 'BOOT_COMPLETE' }
  | { type: 'SET_SECTION'; payload: string }
  | { type: 'ADD_COMMAND'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'OPEN_WINDOW' }
  | { type: 'CLOSE_WINDOW' }
  | { type: 'TOGGLE_WINDOW' };

/**
 * Context value shape
 */
interface TerminalContextType {
  state: TerminalState;
  dispatch: React.Dispatch<TerminalAction>;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

/**
 * Check if boot sequence has already completed this session
 */
const checkBootStatus = (): boolean => {
  try {
    return sessionStorage.getItem('bootCompleted') === 'true';
  } catch {
    return false;
  }
};

/**
 * Initial state for the terminal
 */
const initialState: TerminalState = {
  bootCompleted: checkBootStatus(),
  currentSection: 'home',
  commandHistory: [],
  isWindowOpen: false,
};

/**
 * Terminal state reducer
 */
const terminalReducer = (state: TerminalState, action: TerminalAction): TerminalState => {
  switch (action.type) {
    case 'BOOT_COMPLETE':
      try {
        sessionStorage.setItem('bootCompleted', 'true');
      } catch {
        // sessionStorage may not be available
      }
      return { ...state, bootCompleted: true };

    case 'SET_SECTION':
      return { ...state, currentSection: action.payload };

    case 'ADD_COMMAND':
      return {
        ...state,
        commandHistory: [...state.commandHistory, action.payload],
      };

    case 'CLEAR_HISTORY':
      return { ...state, commandHistory: [] };

    case 'OPEN_WINDOW':
      return { ...state, isWindowOpen: true };

    case 'CLOSE_WINDOW':
      return { ...state, isWindowOpen: false };

    case 'TOGGLE_WINDOW':
      return { ...state, isWindowOpen: !state.isWindowOpen };

    default:
      return state;
  }
};

/**
 * Terminal context provider
 */
export function TerminalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(terminalReducer, initialState);

  return (
    <TerminalContext.Provider value={{ state, dispatch }}>
      {children}
    </TerminalContext.Provider>
  );
}

/**
 * Hook to access terminal state and dispatch
 */
export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
