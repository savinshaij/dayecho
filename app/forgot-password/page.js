"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiMail, FiLock, FiKey, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setType(type);
  };

  const clearMessage = () => {
    setMessage("");
    setType("info");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const sendCode = async () => {
    clearMessage();
    
    if (!email) {
      return showMessage("Please enter your email", "error");
    }
    
    if (!validateEmail(email)) {
      return showMessage("Please enter a valid email address", "error");
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/send-code", { email });
      showMessage(res.data.message, "success");
      setStep(2);
      setCountdown(60); // 60 seconds countdown
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send code. Please try again.";
      showMessage(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    
    clearMessage();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/resend-code", { email });
      showMessage(res.data.message, "success");
      setCountdown(60);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to resend code. Please try again.";
      showMessage(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndReset = async () => {
    clearMessage();
    
    if (!code || !newPassword || !confirmPassword) {
      return showMessage("Please fill all fields", "error");
    }
    
    if (!validatePassword(newPassword)) {
      return showMessage("Password must be at least 8 characters", "error");
    }
    
    if (newPassword !== confirmPassword) {
      return showMessage("Passwords don't match", "error");
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-code", {
        email,
        code,
        newPassword,
      });
      showMessage(res.data.message, "success");

      // Reset state after success
      setTimeout(() => {
        setStep(1);
        setEmail("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Verification failed. Check your code and try again.";
      showMessage(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const backToEmail = () => {
    clearMessage();
    setStep(1);
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgp p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-bgs rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary p-3 rounded-full">
                <FiKey className="text-bgp text-xl" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2 text-textc">
              {step === 1 ? "Reset Password" : "Create New Password"}
            </h2>
            
            <p className="text-center text-gray-400 mb-6 text-sm">
              {step === 1 
                ? "Enter your email to receive a verification code" 
                : "Enter the code sent to your email and your new password"}
            </p>

            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    type === "success"
                      ? "bg-green-900 text-green-100"
                      : type === "error"
                      ? "bg-red-900 text-red-100"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <label className="block text-textc text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full bg-gray-700 text-textc rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={sendCode}
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-primary hover:bg-yellow-500 text-bgp"
                  }`}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-textc text-sm font-medium">
                      Verification Code
                    </label>
                    <button
                      onClick={resendCode}
                      disabled={countdown > 0 || isLoading}
                      className="text-xs text-primary hover:underline disabled:text-gray-500 disabled:no-underline"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiKey className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-textc rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-textc text-sm font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-gray-700 text-textc rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="text-gray-400" />
                      ) : (
                        <FiEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-textc text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full bg-gray-700 text-textc rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="text-gray-400" />
                      ) : (
                        <FiEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={verifyAndReset}
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-primary hover:bg-yellow-500 text-bgp"
                    }`}
                  >
                    {isLoading ? "Processing..." : "Reset Password"}
                  </button>
                  
                  <button
                    onClick={backToEmail}
                    className="flex items-center justify-center text-sm text-gray-400 hover:text-textc transition-colors"
                  >
                    <FiArrowLeft className="w-4 h-4 mr-1" />
                    Back to email entry
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          Remember your password?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}