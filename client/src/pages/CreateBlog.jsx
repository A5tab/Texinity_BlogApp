import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../features/blogs/thunks.js";
import Editor from "react-simple-wysiwyg";
import Input from "../components/Input";
import { useEffect } from "react";

function CreateBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.blogs);

  const [formData, setFormData] = useState({
    blogTitle: "",
    blogSlug: "",
    blogContent: "",
    blogCategory: "",
    blogTags: "",
    blogCoverImage: null, // file
  });

  useEffect(() => {
    if (typeof formData.blogTitle === "string") {
      const slug = formData.blogTitle.toLowerCase().replace(/\s+/g, "-");
      if (formData.blogSlug !== slug) {
        setFormData((prev) => ({ ...prev, blogSlug: slug }));
      }
    }
  }, [formData.blogTitle]);

  useEffect(() => {
    if (typeof formData.blogSlug === "string") {
      const title = formData.blogSlug.replace(/-/g, " ");
      if (formData.blogTitle !== title) {
        setFormData((prev) => ({ ...prev, blogTitle: title }));
      }
    }
  }, [formData.blogSlug]);



  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleContentChange = (e) => {
    setFormData((prev) => ({ ...prev, blogContent: e.target.value || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build FormData for file upload
    const data = new FormData();
    data.append("blogTitle", formData.blogTitle);
    data.append("blogSlug", formData.blogSlug);
    data.append("blogContent", formData.blogContent);
    data.append("blogCategory", formData.blogCategory);
    data.append("blogTags", formData.blogTags);
    if (formData.blogCoverImage) {
      data.append("blogCoverImage", formData.blogCoverImage);
    }
    
    const res = await dispatch(createBlog(data));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard/blogs");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Create Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Blog Title */}
        <Input
          label="Blog Title"
          name="blogTitle"
          value={formData.blogTitle}
          onChange={handleChange}
          required
          className="w-full p-2"
        />

        {/* Slug */}
        <Input
          label="Blog Slug"
          name="blogSlug"
          value={formData.blogSlug}
          onChange={handleChange}
          required
          className="w-full p-2"
        />

        {/* Content */}
        <div>
          <label className="block mb-1">Content</label>
          <Editor value={formData.blogContent} onChange={handleContentChange} />
        </div>

        {/* Category */}
        <Input
          label="Category"
          name="blogCategory"
          value={formData.blogCategory}
          onChange={handleChange}
          required
          className="w-full p-2"
        />

        {/* Tags */}
        <Input
          label="Tags (comma separated)"
          name="blogTags"
          value={formData.blogTags}
          onChange={handleChange}
          className="w-full p-2"
        />

        {/* Cover Image */}
        <div>
          <label className="block mb-1">Cover Image</label>
          <input
            type="file"
            name="blogCoverImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
