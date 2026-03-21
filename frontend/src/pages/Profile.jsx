
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { MdKeyboardBackspace } from "react-icons/md";
import CommentPanel from "../components/CommentPanel";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useCurrentLocation();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalComments: 0,
  });
  const [topVideo, setTopVideo] = useState(null);
  const [activeReel, setActiveReel] = useState(null);

  useEffect(() => {
    axios
      .get(`${serverUrl}/api/user/owner-profile/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const items = res.data.items || [];
        console.log(items)

        setStats({
          totalLikes: res.data.totalLikes || 0,
          totalComments: res.data.totalComments || 0,
        });

        // 🔥 Top performing reel
        const top = items.reduce(
          (prev, curr) =>
            (curr.likeCount || 0) > (prev?.likeCount || 0) ? curr : prev,
          null,
        );

        setTopVideo(top);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`${serverUrl}/api/user/owner-data/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setProfile(response.data.owner);
        setVideos(response.data.items);
      });
  }, [id]);

  const validVideos = videos.filter((v) => v.video);

  return (
    <main className="max-w-[1100px] mx-auto px-4 pb-10 pt-6 flex flex-col gap-6">
      {/* 🔙 Back */}
      <div
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-20 bg-white/80 p-2 rounded-full shadow cursor-pointer"
      >
        <MdKeyboardBackspace className="w-6 h-6 text-orange-500" />
      </div>

      {/* 👤 PROFILE */}
      <section className="bg-white rounded-2xl shadow p-5 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
            {profile?.fullName?.[0] || "U"}
          </div>

          <div>
            <h2 className="font-semibold">{profile?.fullName}</h2>
            <p className="text-sm text-gray-500">
              📍 {address || "Fetching..."}
            </p>
          </div>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Meals", value: profile?.totalMeals || 0 },
            { label: "Customers", value: profile?.customersServed || 0 },
            { label: "Likes", value: stats.totalLikes, color: "text-red-500" },
            {
              label: "Comments",
              value: stats.totalComments,
              color: "text-blue-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl p-4 text-center shadow"
            >
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color || ""}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* 📈 Growth */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Growth</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-orange-500 h-2 rounded-full"
              style={{
                width: `${
                  profile && profile.totalUsers
                    ? Math.min(
                        (profile.customersServed / profile.totalUsers) * 100,
                        100,
                      )
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* 🔥 TOP VIDEO */}
      {topVideo && (
        <section className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            🔥 Top Performing Reel
          </h3>

          <div className="flex gap-4 items-center">
            <video
              src={topVideo.video}
              className="w-24 h-32 object-cover rounded-lg"
              muted
              autoPlay
              loop
            />

            <div>
              <p className="font-semibold">{topVideo.name || "Reel"}</p>
              <div className="flex gap-4 text-sm mt-1">
                <span className="text-red-500">❤️ {topVideo.likeCount}</span>
                <span className="text-blue-500">
                  💬 {topVideo.commentCount}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🎥 VIDEOS */}
      {validVideos.length === 0 ? (
        <p className="text-center text-gray-400">No Videos</p>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {validVideos.map((v, i) => (
            <div
              key={i}
              onClick={() => setActiveReel(v)}
              className="aspect-[3/4] rounded-xl overflow-hidden relative cursor-pointer group"
            >
              <video
                src={v.video}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                muted
                autoPlay
                loop
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

              {/* ❤️ 💬 Overlay */}
              <div className="absolute bottom-2 left-2 flex gap-3 text-white text-xs bg-black/60 px-2 py-1 rounded">
                <span>❤️ {v.likeCount || 0}</span>
                <span>💬 {v.commentCount || 0}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 💬 COMMENT PANEL */}
      {activeReel && (
        <CommentPanel reel={activeReel} onClose={() => setActiveReel(null)} />
      )}
    </main>
  );
};

export default Profile;
