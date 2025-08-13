// src/pages/Blogs.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../features/blogs/thunks.js';
import { Link } from 'react-router-dom';
import { sanitizeHTML } from '../utils/sanitizeHTML.js';

export default function Blogs() {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs()); // Gets all visible blogs
  }, [dispatch]);

  if (loading) return <div className="text-center p-4">Loading blogs...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Feed</h1>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="border rounded-lg p-4 mb-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{blog.blogTitle}</h2>
            <p className="text-white text-sm mb-2">
              By {blog.blogAuthor.username} • {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            {blog.blogCoverImage && (
              <img
                src={blog.blogCoverImage}
                alt={blog.blogTitle}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.blogContent) }} className='line-clamp-3'></div>
            <Link
              to={`/dashboard/blog/${blog.blogSlug}`}
              className="inline-block mt-3 text-blue-500 hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
