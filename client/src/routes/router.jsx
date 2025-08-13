import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Signup } from '../pages/index.js';
import App from "../App";
import AuthWrapper from "../wrappers/AuthWrapper.jsx";
import DashboardLayout from "../pages/DashboardLayout.jsx";
import PersistLogin from "../components/PersistLogin.jsx";

import Blogs from "../pages/Blogs.jsx";
import Blog from "../pages/Blog.jsx";
import CreateBlog from "../pages/CreateBlog.jsx";
import EditBlog from "../pages/EditBlog.jsx";
import UserBlogs from "../pages/UserBlogs.jsx";
const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/",
        element: <PersistLogin />,
        children: [
            {
                element: <App />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "home",
                        element: <Home />,
                    },
                    {
                        path: "dashboard",
                        element: <AuthWrapper><DashboardLayout /></AuthWrapper>,
                        children: [
                            {
                                index: true,
                                element: <Blogs />,
                            },
                            {
                                path: "blogs",
                                element: <Blogs />,
                            },
                            {
                                path: "blog/:blogSlug",
                                element: <Blog />,
                            },
                            {
                                path: "create-blog",
                                element: <AuthWrapper><CreateBlog /></AuthWrapper>,
                            },
                            {
                                path: "edit-blog/:blogSlug",
                                element: <AuthWrapper><EditBlog /></AuthWrapper>,
                            },
                            {
                                path: "user/blogs/:username",
                                element: <AuthWrapper><UserBlogs /></AuthWrapper>,
                            }
                        ]
                    }
                ]
            }
        ]
    }
]);

export default router;
