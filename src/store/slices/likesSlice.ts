import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LikesState {
  likedPostIds: number[];
}

const loadFromStorage = (): number[] => {
  try {
    const raw = localStorage.getItem("likedPostIds");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveToStorage = (ids: number[]) => {
  try { localStorage.setItem("likedPostIds", JSON.stringify(ids)); } catch {}
};

const initialState: LikesState = { likedPostIds: [] };

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    hydrateLikes: (state) => { state.likedPostIds = loadFromStorage(); },
    addLike: (state, action: PayloadAction<number>) => {
      if (!state.likedPostIds.includes(action.payload)) {
        state.likedPostIds.push(action.payload);
        saveToStorage(state.likedPostIds);
      }
    },
    removeLike: (state, action: PayloadAction<number>) => {
      state.likedPostIds = state.likedPostIds.filter((id) => id !== action.payload);
      saveToStorage(state.likedPostIds);
    },
  },
});

export const { hydrateLikes, addLike, removeLike } = likesSlice.actions;
export default likesSlice.reducer;