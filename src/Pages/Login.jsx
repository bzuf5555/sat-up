import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase"
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [shake, setShake] = useState(false);
    const [gettoken, setgettoken] = useState("")
    const navigate = useNavigate()
    const handleLogin = async () => {
        setError("");
        try {
            const res = await fetch("http://localhost:3001/users");
            const users = await res.json();
            const found = users.find(
                (u) => u.email === email && u.password === password
            );
            if (found) {
                localStorage.setItem("user", JSON.stringify(found));
                navigate("/dashboard");
            } else {
                setError("Email yoki parol noto'g'ri!");
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } catch (e) {
            setError("Serverga ulanib bo'lmadi!");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };
    const HandleGoogle = async () => {
        try {
            const resgoogle = await signInWithPopup(auth, googleProvider)
            localStorage.setItem("token", JSON.stringify(resgoogle.user.accessToken))
            localStorage.setItem("user", JSON.stringify({ name: resgoogle.user.displayName, email: resgoogle.user.email, avatar: resgoogle.user.photoURL }))
            navigate("/dashboard")
        } catch (e) {
            console.log(e)
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    /* ========== HOME PAGE ========== */
    if (isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#0F2145] to-[#0D1F3C] p-6">
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
                <div className="animate-fadeInUp bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl px-12 py-14 text-center max-w-[440px] w-full">
                    <div className="mb-6">
                        <CheckCircle className="w-14 h-14 mx-auto text-blue-500" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white mb-2">Xush kelibsiz, {userName}!</h1>
                    <p className="text-[15px] text-white/60 mb-2">Siz muvaffaqiyatli tizimga kirdingiz.</p>
                    <p className="text-xs text-white/30 mb-8">Kinetic Atelier — Raqamli innovatsiyalar markazi</p>
                    <button
                        className="px-8 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm font-semibold cursor-pointer hover:bg-white/20 transition-all"
                        onClick={() => { setIsLoggedIn(false); setEmail(""); setPassword(""); setError(""); }}
                    >
                        Chiqish
                    </button>
                </div>
            </div>
        );
    }

    /* ========== LOGIN PAGE ========== */
    return (
        <div className="flex min-h-screen bg-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .shake-anim { animation: shakeX 0.5s ease-in-out; }
        .pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
      `}</style>

            {/* ===== LEFT PANEL ===== */}
            <div className="relative flex-[1_1_55%] bg-gradient-to-br from-[#0A1628] via-[#0F2145] to-[#0D1F3C] overflow-hidden flex flex-col min-h-screen">

                {/* BG radial glow */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 50% at 55% 35%, rgba(56,139,255,0.15) 0%, transparent 70%)" }}
                />
                <div className="pulse-glow absolute top-[15%] left-[40%] w-[340px] h-[340px] rounded-full blur-[40px] pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.05) 50%, transparent 70%)" }}
                />

                <div className="relative z-10 flex flex-col p-10 px-12 flex-1 justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z" fill="white" />
                            </svg>
                        </div>
                        <span className="text-white text-base font-bold tracking-wide">Kinetic Atelier</span>
                    </div>

                    {/* Hero title */}
                    <div className="mt-9">
                        <h1 className="text-white text-[52px] font-extrabold leading-[1.1] tracking-tight">
                            Raqamli<br />innovatsiyalar<br />markazi
                        </h1>
                    </div>

                    {/* Monitor decoration */}
                    <div className="absolute top-[18%] right-[5%] w-[220px] h-[160px] pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full blur-[25px]"
                            style={{ background: "radial-gradient(circle, rgba(96,165,250,0.35) 0%, transparent 65%)" }}
                        />
                        <div className="relative w-[180px] h-[120px] bg-[#0B1A30] rounded-xl border-2 border-blue-500/25 overflow-hidden mx-auto shadow-[0_0_60px_rgba(59,130,246,0.2)]">
                            <div className="grid grid-cols-5 grid-rows-4 gap-2 p-4 w-full h-full">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 h-1 rounded-full bg-blue-400 justify-self-center self-center"
                                        style={{ opacity: 0.2 + Math.random() * 0.5 }}
                                    />
                                ))}
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full"
                                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(96,165,250,0.2) 40%, transparent 70%)" }}
                            />
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 px-7 border border-white/10 max-w-[380px] mt-auto">
                        <p className="text-white text-[15px] leading-relaxed font-medium italic mb-4">
                            "Eng yaxshi natijalarga faqat mukammallikka intilish orqali erishiladi."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] flex items-center justify-center overflow-hidden">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" fill="#94A3B8" />
                                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#94A3B8" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white text-sm font-bold">Aziz Rahimov</div>
                                <div className="text-white/50 text-xs font-medium">Bosh dizayner</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RIGHT PANEL ===== */}
            <div className="flex-[1_1_45%] flex items-center justify-center px-8 py-10 bg-white">
                <div className={`w-full max-w-[380px] ${shake ? "shake-anim" : ""}`}>

                    <h2 className="text-[28px] font-extrabold text-gray-900 mb-1.5 tracking-tight">Tizimga kirish</h2>
                    <p className="text-sm text-gray-500 mb-7 leading-relaxed">Xush kelibsiz! Ma'lumotlaringizni kiriting.</p>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-5">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" strokeWidth={2} />
                            <span className="text-[13px] text-red-600 font-medium">{error}</span>
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-[11px] font-bold text-gray-700 tracking-widest mb-2">ELEKTRON POCHTA</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-[18px] h-[18px] text-gray-400 pointer-events-none" strokeWidth={1.8} />
                            <input
                                type="email"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                onKeyDown={handleKeyDown}
                                className="w-full py-3 pl-11 pr-4 text-sm border-[1.5px] border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition-all bg-white"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[11px] font-bold text-gray-700 tracking-widest">PAROL</label>
                            <a href="#" className="text-xs text-blue-500 font-semibold hover:underline no-underline">Parolni unutdingizmi?</a>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-[18px] h-[18px] text-gray-400 pointer-events-none" strokeWidth={1.8} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                onKeyDown={handleKeyDown}
                                className="w-full py-3 pl-11 pr-11 text-sm border-[1.5px] border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition-all bg-white"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                className="absolute right-3 bg-transparent border-none cursor-pointer p-1 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                                ) : (
                                    <Eye className="w-5 h-5" strokeWidth={1.8} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5 mb-6 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
                        <div className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all ${rememberMe ? "bg-blue-500 border-blue-500" : "border-gray-300 bg-white"}`}>
                            {rememberMe && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            )}
                        </div>
                        <span className="text-[13px] text-gray-500 font-medium">Meni eslab qol</span>
                    </div>

                    {/* Login button */}
                    <button
                        onClick={handleLogin}
                        className="w-full py-3.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[15px] font-bold border-none rounded-xl cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.25)] hover:from-blue-600 hover:to-blue-700 hover:-translate-y-px hover:shadow-[0_8px_25px_rgba(59,130,246,0.35)] active:translate-y-0 transition-all mb-6"
                    >
                        Kirish
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[11px] font-semibold text-gray-400 tracking-wider whitespace-nowrap">YOKI BILAN DAVOM ETISH</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Google button */}
                    <button onClick={HandleGoogle} className="w-full py-3 bg-white border-[1.5px] border-gray-200 rounded-xl cursor-pointer text-sm font-semibold text-gray-700 flex items-center justify-center gap-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all mb-7">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Google</span>
                    </button>

                    {/* Register */}
                    <p className="text-center text-[13px] text-gray-500 font-medium">
                        Hisobingiz yo'qmi?{" "}
                        <Link to="/signup" className="text-blue-500 font-bold hover:underline no-underline">Ro'yxatdan o'tish</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


