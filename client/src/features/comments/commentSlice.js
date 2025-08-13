import { createSlice } from "@reduxjs/toolkit";
import {
    createComment,
    getComments,
    deleteComment,
    editComment,
} from "./thunks.js";

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        comments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.comments.unshift(action.payload.comment);
            })

            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Get
            .addCase(getComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload.data;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete
            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = state.comments.filter(
                    (c) => c._id !== action.payload.commentId
                );
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Edit
            .addCase(editComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = state.comments.map((c) => {
                    if (c._id === action.payload.data._id) {
                        return action.payload.data;
                    }
                    return c;
                });
            })
            .addCase(editComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

    },
});

export default commentSlice.reducer;
