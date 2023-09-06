import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MenuState } from '../../app/type.d';
import { RootState } from '../../app/store';

const initialState: MenuState  = {
  isOpen: true,
  userRole:       {
    "id": "",
    "normalizedName": "",
    "isManager": true,
    "roleClaims": [],
  },
};

// Config slice
export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuRole: (state,action) => {
      state.userRole = action.payload;
    },
    setOpenMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

// Export actions
export const { setOpenMenu, setMenuRole } = menuSlice.actions;

// Select state currentUser from slice
export const selectOpenMenu = (state:RootState) => state.menu.isOpen;
export const selectUserRole = (state:RootState) => state.menu.userRole;

// Export reducer
export default menuSlice.reducer;
