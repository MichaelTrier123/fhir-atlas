import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import {
  freshState,
  readState,
  STORAGE_KEY,
  type SavedState,
} from "../domain/model";
const StateContext = createContext<{
  saved: SavedState;
  setSaved: Dispatch<SetStateAction<SavedState>>;
  storageAvailable: boolean;
} | null>(null);
export function StateProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState(() => {
    try {
      return readState(window.localStorage);
    } catch {
      return structuredClone(freshState);
    }
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      setStorageAvailable(false);
    }
  }, [saved]);
  return (
    <StateContext.Provider value={{ saved, setSaved, storageAvailable }}>
      {children}
    </StateContext.Provider>
  );
}
export function useAtlas() {
  const state = useContext(StateContext);
  if (!state) throw new Error("Missing Atlas state");
  return state;
}
