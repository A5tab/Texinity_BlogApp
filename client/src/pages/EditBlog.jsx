import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogBySlugOrId, editBlog, deleteBlog } from "../features/blogs/thunks.js";
import Editor from "react-simple-wysiwyg";
import Input from "../components/Input";

function EditBlog() {
  const { blogSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleBlog, loading } = useSelector((state) => state.blogs);


  const [formData, setFormData] = useState({
    blogTitle: "",
    blogSlug: "",
    blogContent: "",
    blogCategory: "",
    blogTags: "",
    blogCoverImage: null, // file
  });


  useEffect(() => {
    dispatch(getBlogBySlugOrId(blogSlug));
  }, [dispatch, blogSlug]); // fetch when slug changes

  useEffect(() => {
    if (singleBlog && singleBlog.blogTitle) {
      setFormData({
        blogTitle: singleBlog.blogTitle || "",
        blogSlug: singleBlog.blogSlug || "",
        blogContent: singleBlog.blogContent || "",
        blogCategory: singleBlog.blogCategory || "",
        blogVisibility: singleBlog.blogVisibility ?? false,
        blogTags: Array.isArray(singleBlog.blogTags)
          ? singleBlog.blogTags.join(",")
          : singleBlog.blogTags || "",
        blogCoverImage: null,
      });
    }
  }, [singleBlog]);
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "select-one" ? value === "true" : value,
    }));
  };

  const handleContentChange = (e) => {
    setFormData((prev) => ({ ...prev, blogContent: e.target.value || "" }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const editBlogData = new FormData();
    editBlogData.append("blogTitle", formData.blogTitle);
    editBlogData.append("blogSlug", formData.blogSlug);
    editBlogData.append("blogContent", formData.blogContent);
    editBlogData.append("blogCategory", formData.blogCategory);
    editBlogData.append("blogTags", formData.blogTags);
    editBlogData.append("blogVisibility", formData.blogVisibility);
    if (formData.blogCoverImage) {
      editBlogData.append("blogCoverImage", formData.blogCoverImage);
    }

    const res = await dispatch(editBlog({ blogSlug, data: editBlogData }));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard/blogs");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this blog?")) {
      const res = await dispatch(deleteBlog(blogSlug));
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/dashboard/blogs");
      }
    }
  };


  if (!formData.blogTitle && loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          label="Title"
          name="blogTitle"
          value={formData.blogTitle}
          onChange={handleChange}
          required
          className="w-full p-2"
        />

        <Input
          label="Slug"
          name="blogSlug"
          value={formData.blogSlug}
          onChange={handleChange}
          className="w-full p-2"
        />

        <div>
          <label className="block mb-1">Content</label>
          <Editor value={formData.blogContent} onChange={handleContentChange} />
        </div>

        <Input
          label="Tags (comma separated)"
          name="blogTags"
          value={formData.blogTags}
          onChange={handleChange}
          className="w-full p-2"
        />

        <div>
          <label className="block mb-1">Visibility</label>
          <select
            name="blogVisibility"
            value={formData.blogVisibility}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
          >
            <option value={true}>Visible</option>
            <option value={false}>Hidden</option>
          </select>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block mb-1">Cover Image</label>
          <input
            type="file"
            name="blogCoverImage"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                blogCoverImage: e.target.files[0],
              }))
            }

            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
          >
            {loading ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold"
          >
            Delete
          </button>

        </div>
      </form>
    </div>
  );
}

export default EditBlog;
