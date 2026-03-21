import React from "react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav
      role="navigation"
      aria-label="Bottom"
      className="fixed bottom-0 left-0 right-0 z-50 h-[56px] text-white border-t border-white/15 backdrop-blur-sm bg-black/35 shadow-md pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-[720px] mx-auto h-full grid grid-cols-2">

        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-[2px] text-xs ${
              isActive ? "text-white" : "text-gray-400"
            }`
          }
        >
          <span className="leading-none">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
            </svg>
          </span>

          <span className="text-[12px]">Home</span>
        </NavLink>

        {/* Saved */}
        <NavLink
          to="/saved-food"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-[2px] text-xs ${
              isActive ? "text-white" : "text-gray-400"
            }`
          }
        >
          <span className="leading-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>
          </span>

          <span className="text-[12px]">Saved</span>
        </NavLink>

      </div>
    </nav>
  );
};

export default BottomNav;