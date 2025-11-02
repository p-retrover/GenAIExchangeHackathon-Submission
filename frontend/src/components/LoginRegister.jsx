import React, { useState } from "react";
import axios from "axios";
import { apiClient } from "../services/api";
import { User, Lock, BrainCircuit } from "lucide-react";

const LoginRegister = ({ setToken, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);
        const response = await axios.post("/api/v1/auth/login", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const accessToken = response.data.access_token;
        localStorage.setItem("authToken", accessToken);
        setToken(accessToken);
        onClose();
      } else {
        await apiClient.post("/users/", { email, password });
        setIsLogin(true);
        setEmail("");
        setPassword("");
        alert("Registration successful! Please log in.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center font-sans text-white">
      {/* subtle violet background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-700/10 via-fuchsia-700/10 to-violet-800/10 rounded-3xl blur-2xl" />

      <div className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-violet-400/30 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative flex justify-center mb-4">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-40 rounded-full" />
            <BrainCircuit className="relative h-12 w-12 text-violet-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-400 to-violet-200 bg-clip-text text-transparent tracking-wide">
            Project Satori
          </h1>
          <p className="text-sm text-violet-200 mt-1">
            Your AI-Powered Career Co-Pilot
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-violet-500/30">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`w-1/2 py-3 font-semibold text-center transition-all duration-300 ${
              isLogin
                ? "text-violet-300 border-b-2 border-violet-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]"
                : "text-violet-400/70 hover:text-violet-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`w-1/2 py-3 font-semibold text-center transition-all duration-300 ${
              !isLogin
                ? "text-violet-300 border-b-2 border-violet-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]"
                : "text-violet-400/70 hover:text-violet-200"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300/80" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 text-violet-100 placeholder-violet-300/50 border border-violet-400/20 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300/80" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 text-violet-100 placeholder-violet-300/50 border border-violet-400/20 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300"
            />
          </div>

          {error && (
            <p className="text-center text-pink-400 text-sm drop-shadow-[0_0_6px_rgba(244,114,182,0.5)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-semibold tracking-wide text-white
                       bg-gradient-to-r from-violet-600 to-fuchsia-600 
                       shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]
                       transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
          >
            {isLoading
              ? "Loading..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
