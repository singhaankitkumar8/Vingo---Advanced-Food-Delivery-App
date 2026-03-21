import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaShareNodes, FaBookmark } from "react-icons/fa6";
import { FaHeart, FaCommentDots } from "react-icons/fa";
import CommentPanel from "./CommentPanel";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = "No videos yet.",
  navigateto
}) => {
  const videoRefs = useRef(new Map());
  const [likedItems, setLikedItems] = useState(new Set());
  const [activeReel, setActiveReel] = useState(null);
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // pause all other videos
            videoRefs.current.forEach((vid) => {
              if (vid !== video) vid.pause();
            });

            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] },
    );

    videoRefs.current.forEach((vid) => observer.observe(vid));

    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id);
      return;
    }

    videoRefs.current.set(id, el);
  };

  const handleLikeClick = (item) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(item._id)) {
        newSet.delete(item._id);
      } else {
        newSet.add(item._id);
      }

      return newSet;
    });

    if (onLike) onLike(item);
  };

  const handleShare = async (item) => {
    const shareUrl = `${window.location.origin}/item/${item._id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.name || "Check this out",
          text: item.description || "Interesting reel",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  return (
    <div className="h-[100dvh] bg-black overflow-hidden">
      {/* Back Button */}
      <div
        className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
        onClick={() => navigate(navigateto)}
      >
        <MdKeyboardBackspace className="w-[25px] h-[25px] text-[#ff4d2d]" />
      </div>
      <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-y-contain">
        {items.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-white">
            {emptyMessage}
          </div>
        )}

        {items.map((item) => (
          <section
            key={item._id}
            className="relative h-[100dvh] w-full snap-start bg-black"
          >
            {/* Video */}
            <video
              ref={setVideoRef(item._id)}
              src={item.video}
              //poster={item.thumbnail}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Overlay */}
            <div className="absolute inset-0 flex items-end">
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />

              {/* Right Action Buttons */}
              <div className="absolute right-3 bottom-24 flex flex-col gap-4">
                {/* Like */}
                <div className="flex flex-col items-center text-white gap-1">
                  <button
                    onClick={() => handleLikeClick(item)}
                    className="w-12 h-12 grid place-items-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition"
                  >
                    <FaHeart
                      className={`text-xl ${
                        likedItems.has(item._id) ? "text-red-500" : "text-white"
                      }`}
                    />
                  </button>

                  <span className="text-xs">
                    {item.likeCount ?? item.likes ?? 0}
                  </span>
                </div>

                {/* Save */}
                <div className="flex flex-col items-center text-white gap-1">
                  <button
                    onClick={onSave ? () => onSave(item) : undefined}
                    className="w-12 h-12 grid place-items-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition"
                  >
                    <FaBookmark className="text-white text-lg" />
                  </button>

                  <span className="text-xs">
                    {item.saveCount ?? item.saves ?? 0}
                  </span>
                </div>

                {/* Comments */}
                <div className="flex flex-col items-center text-white gap-1">
                  <button 
                  className="w-12 h-12 grid place-items-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition"
                  onClick={() => setActiveReel(item)}
                  >
                    <FaCommentDots className="text-white text-lg" />
                  </button>

                  <span className="text-xs">
                    {commentCount[item._id] ?? item.commentCount ?? 0}
                  </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center text-white gap-1">
                  <button
                    onClick={() => handleShare(item)}
                    className="w-12 h-12 grid place-items-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition"
                  >
                    <FaShareNodes className="text-white text-lg" />
                  </button>

                  <span className="text-xs">Share</span>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative w-full p-6 pr-20 pb-20 flex flex-col gap-4 text-white">
                <p className="text-sm leading-snug line-clamp-2 max-w-xl">
                  {item.description}
                </p>

                {item && (
                  <Link
                    to={`/shop-items/${item.shop?._id}`}
                    className="inline-block bg-orange-500 hover:bg-orange-600 font-bold px-4 py-2 rounded-full shadow-md w-fit transition"
                  >
                    Visit Store
                  </Link>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
      {activeReel && (
        <CommentPanel
          reel={activeReel}
          onClose={() => setActiveReel(null)}
          onCountChange={(delta) =>
            setCommentCount((prev) => ({
              ...prev,
              [activeReel._id]:
                (prev[activeReel._id] ?? activeReel.commentCount ?? 0) + delta,
            }))
          }
        />
      )}
    </div>
  );
};

export default ReelFeed;
