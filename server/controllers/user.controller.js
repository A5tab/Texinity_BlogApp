import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { refreshTokenCookieOptions } from '../options.js'
import { generateRefreshToken, generateAccessToken, verifyRefreshToken } from '../utils/JWT.js'
import bcrypt from 'bcryptjs'
import { uploadOnImageKit } from '../utils/imageKit.js'

export const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    [name, username, email, password].some((field) => {
        if (!field || field.trim() === '') {
            throw new ApiError(400, 'All fields are required');
        }
    })

    // await User.deleteOne({username}); 
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
        throw new ApiError(400, 'User already exists');
    }

    let avatar = "";
    if (req.file) {
        const avatarLocalPath = req.file.path;
        avatar = await uploadOnImageKit(avatarLocalPath)
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({ name, username, email, password: hashedPassword, avatar: avatar.url });

    if (!createdUser) {
        throw new ApiError(400, 'User creation failed try again.');
    }

    // generate tokens and set them for user
    const refreshToken = generateRefreshToken(createdUser);
    const accessToken = await generateAccessToken(createdUser);

    createdUser.refreshToken = refreshToken;
    await createdUser.save({ validateBeforeSave: false });

    const newUser = await User.findById(createdUser._id).select('-password -refreshToken');
    res.status(201).
        cookie('refreshToken', refreshToken, refreshTokenCookieOptions).
        json(new ApiResponse(201, 'User registered successfully', newUser));
})

export const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, 'Email or username is required');
    }

    if (!password || password.trim() === '') {
        throw new ApiError(400, 'Password is required');
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        throw new ApiError(400, 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(400, 'Invalid credentials');
    }

    // generate tokens and set them for user
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const newUser = await User.findById(user._id).select('-password -refreshToken');
    res.status(200).
        cookie('refreshToken', refreshToken, refreshTokenCookieOptions).
        json(new ApiResponse(200, 'User logged in successfully', { newUser, accessToken }));
})

export const getLoggedInUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, "User fetched successfully", req.user));
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, 'Token is missing. Unauthorized');
    }

    // get ref token then if not give 401 error decode it if not valid end 401 by method in jwt utility then see info insdei it tget id see db if ref token in db and in req matches then genrtae new access token and give to the user
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, 'Invalid or expired token');
    }

    const accessToken = generateAccessToken(user);
    res.status(200).
        json(new ApiResponse(200, 'Access token refreshed successfully', { user, accessToken }));
})

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.user._id }, { $unset: { refreshToken: 1 } }, { new: true });
    res.status(201).clearCookie('refreshToken', refreshTokenCookieOptions).json(new ApiResponse(201, "User Logout Successfully", {}))
})
