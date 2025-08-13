import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBlogs, deleteBlog } from '../features/blogs/thunks.js'; // Make sure deleteBlog is imported
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { sanitizeHTML } from '../utils/sanitizeHTML.js';

export default function UserBlogs() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userBlogs: blogs, loading, error } = useSelector((state) => state.blogs);
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserBlogs(auth.username));
    }, [dispatch]);

    const handleDelete = (slug) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            dispatch(deleteBlog(slug));
        }
    };

    if (loading) return <div className="text-center p-4">Loading blogs...</div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Blog Feed</h1>
            {blogs.length === 0 ? (
                <p>No blogs found.</p>
            ) : (
                blogs.map((blog) => {
                    const isAuthor = blog.blogAuthor?.username === auth.username;

                    return (
                        <div
                            key={blog._id}
                            className="border rounded-lg p-4 mb-4 hover:shadow-lg transition relative"
                        >
                            {/* Title */}
                            <h2 className="text-xl font-semibold">{blog.blogTitle}</h2>
                            <p className="text-white text-sm mb-2">
                                By {blog.blogAuthor?.username} •{" "}
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>

                            {/* Blog cover image */}
                            {blog.blogCoverImage && (
                                <img
                                    src={blog.blogCoverImage}
                                    alt={blog.blogTitle}
                                    className="w-full h-48 object-cover rounded-md mb-2"
                                />
                            )}

                            {/* Blog content preview */}
                            <div className='text-white line-clamp-3' dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.blogContent) }}></div>

                            {/* Read more */}
                            <Link
                                to={`/dashboard/blog/${blog.blogSlug}`}
                                className="inline-block mt-3 text-blue-500 hover:underline"
                            >
                                Read More →
                            </Link>

                            {/* Edit/Delete if author */}
                            {isAuthor && (
                                <div className="absolute top-4 right-4 flex gap-3">
                                    <button
                                        onClick={() => navigate(`/dashboard/edit-blog/${blog.blogSlug}`)}
                                        className="text-yellow-400 hover:text-yellow-500"
                                    >
                                        <FaEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.blogSlug)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
