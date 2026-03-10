import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SavesState {
  savedPostIds: number[];
}

const loadFromStorage = (): number[] => {
  try {
    const raw = localStorage.getItem("savedPostIds");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (ids: number[]) => {
  try {
    localStorage.setItem("savedPostIds", JSON.stringify(ids));
  } catch {}
};

const initialState: SavesState = {
  savedPostIds: [],
};

const savesSlice = createSlice({
  name: "saves",
  initialState,
  reducers: {
    hydrateSaves: (state) => {
      state.savedPostIds = loadFromStorage();
    },
    addSave: (state, action: PayloadAction<number>) => {
      if (!state.savedPostIds.includes(action.payload)) {
        state.savedPostIds.push(action.payload);
        saveToStorage(state.savedPostIds);
      }
    },
    removeSave: (state, action: PayloadAction<number>) => {
      state.savedPostIds = state.savedPostIds.filter((id) => id !== action.payload);
      saveToStorage(state.savedPostIds);
    },
  },
});

export const { hydrateSaves, addSave, removeSave } = savesSlice.actions;
export default savesSlice.reducer;