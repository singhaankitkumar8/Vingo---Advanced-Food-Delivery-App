
import React, { useEffect, useState, useRef } from "react";
import { getComments, postComment, deleteComment } from "../hooks/useComments.jsx";
import { MdDelete } from "react-icons/md";

const CommentPanel = ({ reel, onClose, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();

  // ✅ current user (make sure you store it in localStorage after login)
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadComments();
  }, [reel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(reel?._id);
    
      setComments(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!text.trim()) return;

    try {
      const newComment = await postComment(reel?._id, text);

      // 🔥 Add instantly to UI
      setComments((prev) => [...prev, newComment]);
      setText("");

      if (onCountChange) onCountChange(1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      
      await deleteComment(id);
     
      setComments((prev) => prev.filter((c) => c?._id !== id));

      if (onCountChange) onCountChange(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed bottom-16 right-6 z-50">

      {/* Chat Container */}
      <div className="w-[340px] h-[440px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-orange-500 text-white">
          <h2 className="font-semibold text-sm">
            Comments ({comments.length})
          </h2>

          <button
            onClick={onClose}
            className="text-lg font-bold hover:scale-110 transition"
          >
            ✕
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">

          {loading && (
            <p className="text-gray-500 text-sm text-center">
              Loading...
            </p>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-gray-400 text-sm text-center">
              No comments yet 👀
            </p>
          )}

          {comments.map((c) => (
            <div key={c._id} className="flex gap-2 items-start group">

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs font-bold">
                {c.user?.fullName?.[0] || "U"}
              </div>

              {/* Message Bubble */}
              <div className="bg-white px-3 py-2 rounded-2xl shadow text-sm max-w-[75%] break-words">
                
                {/* Username */}
                <p className="text-xs font-semibold text-gray-500">
                  {c.user?.fullName || "User"}
                </p>

                {/* Comment */}
                <p>{c.comment}</p>
              </div>

              {/* Delete button (only for owner) */}
              {c.user?._id?.toString() === currentUser?._id?.toString() && (
          
                <button
                  onClick={() => handleDelete(c?._id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:underline transition"
                >
                  <MdDelete size={20}/>
                </button>
              )}
            </div>
          ))}

          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="p-2 border-t bg-white flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            onClick={handlePost}
            disabled={!text.trim()}
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 disabled:opacity-50 transition"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default CommentPanel;