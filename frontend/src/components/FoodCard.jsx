import React, { useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaDrumstickBite,
  FaLeaf,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const { cartItems } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    dispatch(updateQuantity({ id: data._id, quantity: newQty }));
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      dispatch(updateQuantity({ id: data._id, quantity: newQty }));
    }
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(
        addToCart({
          id: data._id,
          name: data.name,
          shop: data.shop,
          price: data.price,
          quantity,
          image: data.image,
          type: data.type,
        })
      );
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400" />
        )
      );
    }
    return stars;
  };

  return (
    <div
      className="w-[260px] rounded-3xl p-4 bg-[#e0e5ec] shadow-neumorph flex flex-col transition-all duration-300 hover:shadow-neumorph-inset"
      style={{
        boxShadow:
          "8px 8px 16px #babecc, -8px -8px 16px #ffffff",
      }}
    >
      {/* Image & top icons */}
      <div className="relative w-full h-[170px] flex justify-center items-center mb-4">
        {/* Veg/Non-Veg Icon */}
        <div
          className="absolute top-3 right-3 rounded-full p-2 flex items-center justify-center"
          style={{
            background: "#e0e5ec",
            boxShadow:
              "4px 4px 8px #babecc, -4px -4px 8px #ffffff",
          }}
        >
          {data.type === "veg" ? (
            <FaLeaf className="text-green-600 text-xl" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-xl" />
          )}
        </div>
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow:
              "inset 2px 2px 6px #babecc, inset -2px -2px 6px #ffffff",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
          {data.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {renderStars(Math.round(data.rating?.average || 0))}
          <span className="text-xs text-gray-500">
            ({data.rating?.count || 0})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-gray-900 text-lg">
            ₹{data.price}
          </span>

          {/* Quantity & Cart Button */}
          <div
            className="flex items-center rounded-full px-2 py-1"
            style={{
              background: "#e0e5ec",
              boxShadow:
                "inset 2px 2px 6px #babecc, inset -2px -2px 6px #ffffff",
            }}
          >
            <button
              onClick={handleDecrease}
              className="p-2 rounded-full mr-1 neumorph-btn"
              style={{
                background: "#e0e5ec",
                boxShadow:
                  "2px 2px 6px #babecc, -2px -2px 6px #ffffff",
              }}
            >
              <FaMinus size={12} />
            </button>
            <span className="px-2 text-sm font-semibold">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="p-2 rounded-full ml-1 neumorph-btn"
              style={{
                background: "#e0e5ec",
                boxShadow:
                  "2px 2px 6px #babecc, -2px -2px 6px #ffffff",
              }}
            >
              <FaPlus size={12} />
            </button>
            <button
              className={`ml-2 p-2 rounded-full transition-colors neumorph-btn ${
                cartItems.some((i) => i.id === data._id)
                  ? "bg-gray-700"
                  : "bg-[#ff4d2d]"
              }`}
              style={{
                color: "#fff",
                boxShadow:
                  "2px 2px 6px #babecc, -2px -2px 6px #ffffff",
              }}
              onClick={handleAddToCart}
            >
              <FaShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;

/* Add this to your global CSS (e.g., index.css or FoodCard.css):

.shadow-neumorph {
  box-shadow: 8px 8px 16px #babecc, -8px -8px 16px #ffffff;
}
.shadow-neumorph-inset {
  box-shadow: inset 8px 8px 16px #babecc, inset -8px -8px 16px #ffffff;
}
.neumorph-btn:active {
  box-shadow: inset 2px 2px 6px #babecc, inset -2px -2px 6px #ffffff !important;
}
*/
