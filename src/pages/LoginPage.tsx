/**
 * Login page with cartoon style.
 * Supports parent (admin) and child login with role selection.
 */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "../app/auth-context";

export default function LoginPage() {
  const { login: doLogin, loading } = useAuthContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    const trimmed = username.trim() || "child";
    try {
      await doLogin(trimmed);
      setLoginError(null);
      navigate("/tasks");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "登录失败";
      setLoginError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, #7dd3fc 0%, #b9fbc0 48%, #fff1a8 100%)",
    }}>
      {/* Decorative elements */}
      <div className="fixed top-10 left-12 text-6xl opacity-40 animate-bounce" style={{ animationDuration: "3s" }}>
        ☁️
      </div>
      <div className="fixed top-20 right-24 text-5xl opacity-30 animate-bounce" style={{ animationDuration: "4s", animationDelay: "-1s" }}>
        ☁️
      </div>
      <div className="fixed top-16 right-60 text-5xl opacity-25 animate-pulse">
        🌈
      </div>
      <div className="fixed top-44 left-[12%] text-3xl opacity-30 animate-pulse" style={{ animationDuration: "2s" }}>
        ✨
      </div>
      <div className="fixed bottom-36 right-[10%] text-4xl opacity-25 animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "-0.8s" }}>
        ⭐
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div
          className="rounded-[2rem] p-8 text-center"
          style={{
            background: "rgba(255, 253, 240, 0.96)",
            border: "4px solid rgba(47, 93, 98, 0.18)",
            boxShadow: "0 18px 0 rgba(47, 93, 98, 0.08), 0 24px 42px rgba(31, 41, 55, 0.16)",
          }}
        >
          {/* Mascot */}
          <div
            className="w-[92px] h-[92px] mx-auto mb-4 grid place-items-center rounded-[2rem] text-5xl animate-bounce"
            style={{
              animationDuration: "3s",
              border: "4px solid rgba(251, 146, 60, 0.42)",
              background: "#ffedd5",
              boxShadow: "inset 0 -8px 0 rgba(251, 146, 60, 0.18)",
            }}
          >
            🎒
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-extrabold text-base mb-3"
            style={{
              color: "#7c2d12",
              border: "2px solid rgba(251, 146, 60, 0.45)",
              background: "#fed7aa",
              boxShadow: "0 5px 0 rgba(251, 146, 60, 0.25)",
            }}
          >
            🌟 进入学习乐园
          </div>

          <h1 className="text-4xl font-extrabold text-teal-700 mb-2 tracking-wide">
            欢迎回来
          </h1>

          <p className="text-slate-500 font-bold leading-relaxed max-w-xs mx-auto mb-5">
            输入 admin 是家长账户；输入其他名字是孩子账户；留空默认 child。
          </p>

          <div className="flex flex-col gap-3.5 max-w-xs mx-auto">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="admin / xiaoming / 留空默认 child"
              className="w-full h-[48px] rounded-2xl px-5 text-base font-bold outline-none transition-shadow"
              style={{
                border: "3px solid rgba(244, 114, 182, 0.35)",
                background: "#fff",
                boxShadow: "inset 0 -4px 0 rgba(244, 114, 182, 0.08), 0 10px 18px rgba(244, 114, 182, 0.12)",
              }}
              autoFocus
            />

            <motion.button
              whileHover={{ y: -3, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-[46px] rounded-2xl text-white font-extrabold text-lg cursor-pointer transition-transform"
              style={{
                background: "linear-gradient(135deg, #fb7185, #f97316)",
                boxShadow: "0 8px 0 #be123c, 0 14px 24px rgba(251, 113, 133, 0.28)",
              }}
            >
              {loading ? "登录中..." : "开始学习"}
            </motion.button>
          </div>

          {loginError && (
            <p className="mt-4 text-pink-600 font-bold text-sm">
              {loginError}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
