import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserState, LoginState, LoginPermissionState } from '../../app/type.d';
import { RootState } from '../../app/store';
/*
const initialState:UserState = {
  isLoading: false,
  errorMessage: '',
  currentUser: null,
  isOpenMenu: true,
};*/

const initialState: LoginState = {
  "message": "",
  "isSuccess": false,
  "errors": null,
  "token": undefined,
  "customerInformation": null,
  "userInformation": null,
  "role": {
    "id": "",
    "normalizedName": "",
    "isManager": true,
    "roleClaims": [],
  },
  "permission": undefined,
  "errorServer": ""
};

// Fetch API

export const login = createAsyncThunk(
  'user/login',
  async ({ AccountInformation, UserName, Password, link }: { "AccountInformation": string, "UserName": string, "Password": string, link: string }, { rejectWithValue }) => {
    const response = await fetch(
      link,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            AccountInformation,
            UserName,
            Password,
          }),
      }
    );

    const jsonData = await response.json();
    return jsonData;
  }
);

// Config slice
export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: () => initialState,

  },
  extraReducers: (builder) => {
    // Start login request
    builder.addCase(login.pending, (state) => {
      state.isSuccess = true;
    });

    // Request successful
    builder.addCase(login.fulfilled, (state, action) => {
      state.isSuccess = false;
      state.token = action.payload.token;
      state.errors = action.payload.errors;
      state.isSuccess = action.payload.isSuccess;
      state.message = action.payload.message;
      state.customerInformation = action.payload.customerInformation;
      state.userInformation = action.payload.userInformation;
      state.role = (action.payload.userInformation) ? action.payload.userInformation.roles[0] : {
        "id": "0",
        "normalizedName": "Customer",
        "isManager": false,
        "users": null,
      };
      state.permission = action.payload.userInformation?.permission;
    });

    // Request error
    builder.addCase(login.rejected, (state, action) => {
      state.isSuccess = false;
      state.errorServer = action.error.message
      //state.isLoading = false;
      //state.errorMessage = action.payload.message;
    });
  },
});

// Export actions
export const { logout } = loginSlice.actions;

// Select state currentUser from slice
/*
export const selectUser = (state:RootState) => state.user.currentUser;
export const selectLoading = (state:RootState) => state.user.isLoading;
export const selectErrorMessage = (state:RootState) => state.user.errorMessage;
export const selectOpenMenu = (state:RootState) => state.user.isOpenMenu;
*/

export const selectSuccess = (state: RootState) => state.login.isSuccess;
export const selectMessage = (state: RootState) => state.login.message;
export const selectToken = (state: RootState) => state.login.token;
export const selectError = (state: RootState) => state.login.errors;
export const selectErrorServer = (state: RootState) => state.login.errorServer;
export const selectInformation = (state: RootState) => state.login.userInformation != null ? state.login.userInformation : state.login.customerInformation;
export const selectRole = (state: RootState) => state.login.role;
export const selectLogin = (state: RootState) => state.login;
export const selectPermission = (state: RootState) => state.login.permission;

// Export reducer
export default loginSlice.reducer;
