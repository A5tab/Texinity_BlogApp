import { createSlice } from '@reduxjs/toolkit'
import { login, logout, refreshAccessToken, signup } from './thunks'


const initialState = {
  username: "",
  isLoggedIn: false,
  accessToken: "",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  loading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.data.accessToken
        state.avatar = action.payload.data.newUser.avatar
        state.username = action.payload.data.newUser.username
        state.isLoggedIn = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.accessToken
        state.avatar = action.payload.avatar
        state.username = action.payload.username
        state.isLoggedIn = true
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.accessToken = ""
        state.avatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
        state.username = ""
        state.isLoggedIn = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      })

      // refresh
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.data.accessToken
        state.isLoggedIn = true
        state.username = action.payload.data.user.username
        state.avatar = action.payload.data.user.avatar
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = action.payload || "Refresh token failed";
      })
  }
})



export default authSlice.reducer
