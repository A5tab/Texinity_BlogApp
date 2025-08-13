import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios.js";
import { axiosPrivate } from "../../api/axios.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const login = createAsyncThunk(
    "auth/login",
    asyncHandler(async (data, thunkApi) => {
        const res = await axios.post('users/login', data, {
            withCredentials: true
        });
        return res.data;
    })
)

export const signup = createAsyncThunk(
    "auth/signup",
    asyncHandler(async (data, thunkApi) => {
        const res = await axios.post('users/signup', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    })
)

export const logout = createAsyncThunk(
    "auth/logout",
    asyncHandler(async (_, thunkApi) => {
        const res = await axiosPrivate.get('users/logout');
        return res.data;
    })
)

export const refreshAccessToken = createAsyncThunk(
    "auth/refreshAccessToken",
    asyncHandler(async (_, thunkApi) => {
        const res = await axios.get('users/refresh-access-token', { withCredentials: true });
        console.log("res of ref token", res)
        return res.data;
    })
)
