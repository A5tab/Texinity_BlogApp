import Input from "../components/Input";
import { useState } from "react";
import { Link } from "react-router-dom";
const AuthForm = ({ type = "login", error = null, loading = false, onSubmit }) => {
    const isSignup = type === "signup";
    const initialFormData = type === "login" ? {
        username: "",
        password: ""
    } : {
        username: "",
        email: "",
        password: "",
        avatar: ""
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-primary-bg text-text-light px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-secondary-bg/80 backdrop-blur-lg border border-border-accent/30 rounded-2xl shadow-xl w-full max-w-md p-8 space-y-5"
            >
                <h2 className="text-3xl font-extrabold text-center text-accent drop-shadow-md">
                    {isSignup ? "Create Account" : "Welcome Back"}
                </h2>

                <p className="text-center text-text-muted text-sm">
                    {isSignup
                        ? "Sign up to get started!"
                        : "Log in to continue your journey."}
                </p>

                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="space-y-4 flex flex-col">
                    {isSignup && (
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="border-border-accent focus:border-accent-hover"
                        />
                    )}

                    {!isSignup && (
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            label="Username or Email"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="border-border-accent focus:border-accent-hover"
                        />
                    )}

                    {isSignup && (
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border-border-accent focus:border-accent-hover"
                        />
                    )}

                    <Input
                        type="password"
                        name="password"
                        id="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="border-border-accent focus:border-accent-hover"
                    />

                    {isSignup && (
                        <Input
                            type="file"
                            name="avatar"
                            id="avatar"
                            label="Avatar"
                            accept="image/*"
                            onChange={handleChange}
                            className="border-border-accent focus:border-accent-hover"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-hover transition duration-300"
                >
                    {loading? "Loading..." : isSignup ? "Sign Up" : "Login"}
                </button>
                {isSignup && (
                    <p className="text-center mt-4">
                        Already have an account? <Link to="/login" className="underline underline-offset-4 text-amber-400">Login</Link>
                    </p>
                )}
                {!isSignup && (
                    <p className="text-center mt-4">
                        Don't have an account? <Link to="/signup" className="underline underline-offset-4 text-amber-400">Sign Up</Link>
                    </p>
                )}

            </form>
        </div>
    );
};

export default AuthForm;
