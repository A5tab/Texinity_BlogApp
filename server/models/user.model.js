import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) next();
});

export const User = mongoose.model("User", userSchema);