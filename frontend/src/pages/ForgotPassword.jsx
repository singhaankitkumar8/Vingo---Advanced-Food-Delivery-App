import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import { ClipLoader } from "react-spinners";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [loading , setLoading] = useState(false)

  // Professional Food Delivery Theme
  const primaryColor = "#ff4d2d"; // rich orange
  const hoverColor = "#e64323"; // darker orange
  const bgColor = "#fff9f6"; // light off-white background
  const borderColor = "#ddd";

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/sendotp`,
        { email },
        { withCredentials: true },
      );
      setErr("");
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErr(error?.reponse?.data?.message);
      setLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true },
      );
      setErr("")
      setStep(3);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setErr(error?.reponse?.data?.message);
      setLoading(false)
    }
  };
  const handleResetPassword = async () => {
    setLoading(true)
    if (newPassword == confirmPassword) {
      try {
        const result = await axios.post(
          `${serverUrl}/api/auth/resetpassword`,
          { email, password: newPassword },
          { withCredentials: true },
        );
        setErr("")
        setLoading(false);
        navigate("/signin");
       
      } catch (error) {
        console.log(error);
        setErr(error?.reponse?.data?.message)
        setLoading(false);
      }
    } else {
      alert("both password is not equal.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* Heading */}
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1
            className="text-3xl font-bold mb-2 text-center"
            style={{ color: primaryColor }}
          >
            Forgot Password
          </h1>
        </div>
        <p className="text-gray-600 text-center mb-8">
          Follow the steps to reset your password
        </p>

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200"
              style={{ backgroundColor: primaryColor, color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white"/> :"Send OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}

          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter the OTP sent to your email"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200"
              style={{ backgroundColor: primaryColor, color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white"/> :"Verify OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}


          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <label className="block text-gray-700 font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200"
              style={{ backgroundColor: primaryColor, color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white"/> :"Reset Password"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}


          </>
        )}

        {/* Back to Login */}
        <p className="mt-6 text-center text-gray-600">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="font-semibold"
            style={{ color: primaryColor }}
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
