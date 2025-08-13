// src/pages/Blog.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogBySlugOrId, toggleLike } from '../features/blogs/thunks.js';
import { createComment, getComments, deleteComment, editComment } from '../features/comments/thunks.js';
import { useParams } from 'react-router-dom';
import Input from '../components/Input.jsx';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { sanitizeHTML } from '../utils/sanitizeHTML.js';

export default function Blog() {
  const { blogSlug } = useParams();
  const dispatch = useDispatch();
  const { singleBlog, loading, error } = useSelector((state) => state.blogs);
  const { comments } = useSelector((state) => state.comments);
  const [comment, setComment] = useState('');
  const auth = useSelector((state) => state.auth);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    if (!blogSlug) return;
    dispatch(getBlogBySlugOrId(blogSlug));
  }, [dispatch, blogSlug]);

  useEffect(() => {
    if (!singleBlog) return;
    dispatch(getComments(singleBlog._id));
  }, [dispatch, singleBlog]);

  const handleLike = () => {
    dispatch(toggleLike(singleBlog._id));
  };



  const handleComment = (e) => {
    e.preventDefault();
    dispatch(createComment({ blogId: singleBlog._id, comment }));
    setComment('');
  };

  const handleEdit = (commentId, commentText) => {
    setEditCommentId(commentId);
    setEditCommentText(commentText);
  };
  const handleDelete = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  if (loading) return <div className="p-4 text-center">Loading blog...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!singleBlog) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{singleBlog.title}</h1>
      <p className="text-gray-600 mb-4">
        By {singleBlog.blogAuthor.username} • {new Date(singleBlog.createdAt).toLocaleDateString()}
      </p>
      {singleBlog.blogCoverImage && (
        <img
          src={singleBlog.blogCoverImage}
          alt={singleBlog.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}
      <div
        className="text-lg mb-6"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(singleBlog.blogContent),
        }}
      ></div>

      {/* Likes */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {singleBlog.isLiked ? (
            <>
              <FiThumbsDown /> Unlike ({singleBlog.likeCount || 0})
            </>
          ) : (
            <>
              <FiThumbsUp /> Like ({singleBlog.likeCount || 0})
            </>
          )}
        </button>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Comments ({singleBlog.commentCount})</h2>
        <form onSubmit={handleComment} className="flex gap-2 mb-4">
          <Input
            label="Add comment"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border p-2 rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Post
          </button>
        </form>
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((c) => (

              c._id === editCommentId ? (
                <div key={c._id}>
                  <Input
                    label="Edit comment"
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    placeholder="Edit comment..."
                    className="flex-1 border p-2 rounded"
                  />
                  <button
                    onClick={() => {
                      dispatch(editComment({ commentId: c._id, newComment: editCommentText }));
                      setEditCommentId(null); setEditCommentText('');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditCommentId(null); setEditCommentText(''); }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  key={c._id}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={c.userId.avatar}
                    alt={c.userId.username}
                    className="h-10 w-10 rounded-full object-cover border"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{c.userId.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-1 text-gray-700 leading-snug">{c.comment}</p>

                    {/* Conditional edit/delete buttons */}
                    {auth?.username === c.userId.username && (
                      <div className="mt-2 flex gap-2 text-sm">
                        <button
                          onClick={() => handleEdit(c._id, c.comment)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>)
            ))
          ) : (
            <p className="text-gray-500 italic text-sm">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>


      </div>
    </div >
  );
}
