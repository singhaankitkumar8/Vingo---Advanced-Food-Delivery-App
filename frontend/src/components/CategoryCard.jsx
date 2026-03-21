// import React from 'react';
// import { LucideIcon } from 'lucide-react'; // Make sure to install lucide-react or use your icon import

function CategoryCard({ image, name, onClick, Icon }) {
  return (
    <div
      className=" w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative"
      onClick={onClick}
    >
          <img
            src={image}
            alt={name || 'Category'}
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
          />
       
      {/* Glassmorphism label */}
      <div className="
        absolute bottom-0 w-full left-0
        bg-white/60
        backdrop-blur-md
        rounded-t-xl
        shadow
        text-center
        text-sm md:text-base
        font-semibold
        text-gray-800
        z-20
        border border-[#ececec]
      ">
        {name}
      </div>
      {/* Decorative neumorphic highlight */}
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/60 blur-[6px] z-0" />
    </div>
  );
}

export default CategoryCard;






// rounded-3xl
// border border-[#ececec]
// bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]
// shadow-[8px_8px_24px_#d1d9e6,-8px_-8px_24px_#ffffff]
// hover:shadow-[4px_4px_16px_#d1d9e6,-4px_-4px_16px_#ffffff]
// transition-all duration-300
// flex flex-col items-center justify-center
// cursor-pointer
// relative
// overflow-hidden