import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const triggerShake = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleRegister = async () => {
    setError("");
    if (!name.trim()) return triggerShake("Ism-sharifni kiriting!");
    if (!email.trim()) return triggerShake("Elektron pochtani kiriting!");
    if (!email.includes("@")) return triggerShake("Email formati noto'g'ri!");
    if (password.length < 6) return triggerShake("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
    if (password !== confirmPassword) return triggerShake("Parollar mos kelmayapti!");
    if (!agreed) return triggerShake("Foydalanish shartlarini qabul qiling!");

    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();
      const exists = users.find((u) => u.email === email);
      if (exists) return triggerShake("Bu email allaqachon ro'yxatdan o'tgan!");

      const newUser = { name: name.trim(), email: email.trim(), password };
      const postRes = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!postRes.ok) return triggerShake("Ro'yxatdan o'tishda xatolik yuz berdi!");

      const savedUser = await postRes.json();
      localStorage.setItem("user", JSON.stringify(savedUser));
      localStorage.setItem("token", JSON.stringify("registered_" + savedUser.id));
      navigate("/dashboard", { replace: true });
    } catch (e) {
      triggerShake("Serverga ulanib bo'lmadi!");
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("token", JSON.stringify(result.user.accessToken));
      localStorage.setItem("user", JSON.stringify({ name: result.user.displayName, email: result.user.email, avatar: result.user.photoURL }));
      navigate("/dashboard", { replace: true });
    } catch (e) {
      triggerShake("Google orqali kirishda xatolik!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  // ══════════ SIGN UP PAGE ══════════
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-14px) rotate(-6deg); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-10px) rotate(6deg); } }
        @keyframes float3 { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-18px) rotate(-3deg); } }

        .signup-input {
          width: 100%;
          padding: 12px 12px 12px 42px;
          font-size: 14px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          color: #111827;
          background: #fff;
          outline: none;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .signup-input:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .signup-input::placeholder { color: #9CA3AF; }

        .signup-input-sm {
          width: 100%;
          padding: 12px 36px 12px 38px;
          font-size: 14px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          color: #111827;
          background: #fff;
          outline: none;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .signup-input-sm:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .signup-input-sm::placeholder { color: #9CA3AF; }

        .register-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #10B981, #14B8A6);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s;
          box-shadow: 0 4px 15px rgba(16,185,129,0.3);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .register-btn:hover {
          background: linear-gradient(135deg, #059669, #0D9488);
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(16,185,129,0.35);
        }
        .register-btn:active { transform: translateY(0); }

        .google-btn {
          width: 100%;
          padding: 12px;
          background: #fff;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .google-btn:hover { background: #F9FAFB; border-color: #D1D5DB; }

        .eye-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          color: #9CA3AF;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #6B7280; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#F3F4F6" }}>

        {/* ===== LEFT PANEL ===== */}
        <div
          style={{
            position: "relative",
            width: "48%",
            minHeight: "100vh",
            background: "#0E1A2E",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRadius: "0 28px 28px 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 70% 60% at 30% 70%, rgba(56,139,255,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", padding: "40px 48px", flex: 1, justifyContent: "space-between" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z" fill="white" />
                </svg>
              </div>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: "0.02em" }}>Kinetic Atelier</span>
            </div>

            <div style={{ marginTop: 40, maxWidth: 360 }}>
              <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 24 }}>
                Raqamli<br />innovatsiyalar<br />olamiga kiring
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.6, maxWidth: 320 }}>
                Biz bilan birga o'z g'oyalaringizni yuqori texnologiyali yechimlarga aylantiring.
              </p>
            </div>

            <div style={{ position: "absolute", right: 40, top: "28%", pointerEvents: "none" }}>
              <div style={{ width: 110, height: 140, borderRadius: 18, background: "#2D1B69", position: "absolute", top: -8, left: -10, opacity: 0.9, animation: "float1 5s ease-in-out infinite" }} />
              <div style={{ width: 100, height: 130, borderRadius: 18, background: "#1B3A8A", position: "absolute", top: 40, left: 50, opacity: 0.9, animation: "float2 4.5s ease-in-out infinite 0.5s" }} />
              <div style={{ width: 90, height: 120, borderRadius: 18, background: "#1E4F9E", position: "absolute", top: 80, left: -5, opacity: 0.7, animation: "float3 5.5s ease-in-out infinite 1s" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
              <div style={{ display: "flex" }}>
                {[
                  { bg: "#6366F1", label: "AR" },
                  { bg: "#EC4899", label: "SK" },
                  { bg: "#F59E0B", label: "DT" },
                  { bg: "#10B981", label: "MN" },
                ].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: a.bg,
                      border: "2.5px solid #0E1A2E",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#fff",
                      marginLeft: i > 0 ? -10 : 0,
                      zIndex: 4 - i,
                      position: "relative",
                    }}
                  >
                    {a.label}
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 500 }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>+2,400</span> kishi allaqachon bizga qo'shilgan
              </p>
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div
          style={{
            width: "52%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 32px",
            background: "#F3F4F6",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
              padding: "40px 40px 32px",
              animation: shake ? "shakeX 0.5s ease-in-out" : "none",
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4, letterSpacing: "-0.01em" }}>
              Yangi hisob yaratish
            </h2>
            <p style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 28, lineHeight: 1.5 }}>
              Bizga qo'shiling va imkoniyatlardan foydalaning.
            </p>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#DC2626", fontWeight: 500 }}>
                <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} strokeWidth={2} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.12em", marginBottom: 8 }}>ISM-SHARIF</label>
              <div style={{ position: "relative" }}>
                <User size={18} color="#9CA3AF" strokeWidth={1.8} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  className="signup-input"
                  type="text"
                  placeholder="Aziz Rahimov"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.12em", marginBottom: 8 }}>ELEKTRON POCHTA</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color="#9CA3AF" strokeWidth={1.8} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  className="signup-input"
                  type="email"
                  placeholder="misol@gmail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.12em", marginBottom: 8 }}>PAROL</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="#9CA3AF" strokeWidth={1.8} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    className="signup-input-sm"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="eye-btn" type="button" onClick={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <EyeOff size={18} strokeWidth={1.8} />
                    ) : (
                      <Eye size={18} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.12em", marginBottom: 8 }}>TASDIQLASH</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="#9CA3AF" strokeWidth={1.8} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    className="signup-input-sm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="eye-btn" type="button" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? (
                      <EyeOff size={18} strokeWidth={1.8} />
                    ) : (
                      <Eye size={18} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24, cursor: "pointer", userSelect: "none" }}
              onClick={() => { setAgreed(!agreed); setError(""); }}
            >
              <div
                style={{
                  marginTop: 2,
                  width: 18, height: 18, minWidth: 18,
                  borderRadius: 5,
                  border: agreed ? "2px solid #3B82F6" : "2px solid #D1D5DB",
                  background: agreed ? "#3B82F6" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {agreed && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, lineHeight: 1.4 }}>
                Men{" "}
                <a href="#" style={{ color: "#3B82F6", fontWeight: 600, textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                  Foydalanish shartlari
                </a>{" "}
                va{" "}
                <a href="#" style={{ color: "#3B82F6", fontWeight: 600, textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                  Maxfiylik siyosati
                </a>{" "}
                bilan tanishib chiqdim.
              </span>
            </div>

            <button className="register-btn" onClick={handleRegister}>
              <span>Ro'yxatdan o'tish</span>
              <ArrowRight size={18} color="white" strokeWidth={2} />
            </button>

            <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", fontWeight: 500, marginTop: 20, marginBottom: 20 }}>
              Hisobingiz bormi?{" "}
              <Link to="/" style={{ color: "#3B82F6", fontWeight: 700, textDecoration: "none" }}>Tizimga kirish</Link>
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>YOKI DAVOM ETING</span>
              <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            </div>

            <button className="google-btn" onClick={handleGoogle}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </button>
          </div>

          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>
              Asosiy <span style={{ color: "#D1D5DB", margin: "0 4px" }}>›</span>
              <span style={{ color: "#3B82F6", fontWeight: 600 }}>Ro'yxatdan o'tish</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}