import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import blogsReducer from '../features/blogs/blogsSlice.js'
import commentsReducer from '../features/comments/commentSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogsReducer,
    comments: commentsReducer
  },
})