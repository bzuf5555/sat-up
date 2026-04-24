import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "./i18n/index.js";
import { toggleTheme } from "./store/themeSlice";
import {
  LayoutDashboard, ClipboardList, FileText, Users, BarChart3,
  Star, UtensilsCrossed, UserCircle, CalendarDays, MessageCircle,
  Wallet, Search, Bell, MessageSquare, Calendar, User, Plus,
  Sun, Moon, Globe, X, Eye, EyeOff, Lock, CheckCircle,
} from "lucide-react";

const LANGS = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", label: "Русский",   flag: "🇷🇺" },
  { code: "zh", label: "中文",       flag: "🇨🇳" },
];

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navItems = [
    { label: t("nav_dashboard"),      path: "/dashboard",     icon: LayoutDashboard },
    { label: t("nav_orderList"),      path: "/orderlist",     icon: ClipboardList },
    { label: t("nav_orderDetail"),    path: "/orderdetail",   icon: FileText },
    { label: t("nav_customer"),       path: "/customer",      icon: Users },
    { label: t("nav_analytics"),      path: "/analytics",     icon: BarChart3 },
    { label: t("nav_reviews"),        path: "/reviews",       icon: Star },
    { label: t("nav_foods"),          path: "/foods",         icon: UtensilsCrossed },
    { label: t("nav_customerDetail"), path: "/customerdetail",icon: UserCircle },
    { label: t("nav_calendar"),       path: "/calendar",      icon: CalendarDays },
    { label: t("nav_chat"),           path: "/chat",          icon: MessageCircle },
    { label: t("nav_wallet"),         path: "/wallet",        icon: Wallet },
  ];

  return (
    <aside className="w-52 bg-white dark:bg-gray-900 flex flex-col shadow-sm flex-shrink-0 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sedap.</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t("nav_subtitle")}</p>
      </div>
      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-[18px] h-[18px] ${isActive ? "text-teal-500 dark:text-teal-400" : "text-gray-400 dark:text-gray-500"}`}
                  strokeWidth={1.8}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mx-3 mb-4 rounded-xl bg-teal-600 p-4 text-white text-xs">
        <p className="font-semibold leading-tight mb-2">{t("nav_organizeMenus")}</p>
        <button
          onClick={() => navigate("/foods", { state: { openAdd: true } })}
          className="w-full bg-white text-teal-600 font-bold py-1.5 rounded-lg text-xs mt-1 hover:bg-teal-50 transition flex items-center justify-center gap-1">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          {t("nav_addMenus")}
        </button>
      </div>
      <div className="px-4 pb-3 text-xs text-gray-400 dark:text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-500 dark:text-gray-500">Sedap Restaurant Admin</p>
        <p>© 2024 All Rights Reserved</p>
      </div>
    </aside>
  );
}

const topBarIcons = [
  { Icon: Bell,          badge: "3", color: "bg-orange-400" },
  { Icon: MessageSquare, badge: "1", color: "bg-teal-400" },
  { Icon: Calendar,      badge: "2", color: "bg-blue-400" },
  { Icon: User,          badge: "5", color: "bg-red-400" },
];

export function TopBar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang") || "uz");

  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const displayName = currentUser.name || "User";
  const avatarSrc = (currentUser.avatar && currentUser.avatar !== "null") ? currentUser.avatar : "https://i.pravatar.cc/36?img=47";
  const isGoogleUser = !currentUser.id;

  const [profileOpen, setProfileOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSurname, setFormSurname] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirm, setFormConfirm] = useState("");
  const [formAvatar, setFormAvatar] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setCurrentLang(code);
    setLangOpen(false);
  };

  const activeLang = LANGS.find((l) => l.code === currentLang) || LANGS[0];

  const openProfile = () => {
    setFormName(currentUser.name || "");
    setFormSurname(currentUser.surname || "");
    setFormPassword("");
    setFormConfirm("");
    setFormAvatar(avatarSrc);
    setProfileError("");
    setProfileSuccess(false);
    setProfileOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setProfileError("");
    if (!formName.trim()) return setProfileError("Ism kiritilmagan!");
    if (formPassword && formPassword.length < 6) return setProfileError("Parol kamida 6 ta belgidan iborat!");
    if (formPassword && formPassword !== formConfirm) return setProfileError("Parollar mos kelmadi!");

    setSaving(true);
    const updated = { ...currentUser, name: formName.trim(), surname: formSurname.trim(), avatar: formAvatar };
    if (formPassword) updated.password = formPassword;

    if (currentUser.id) {
      try {
        const patchData = { name: formName.trim(), surname: formSurname.trim() };
        if (formPassword) patchData.password = formPassword;
        const res = await fetch(`http://localhost:3001/users/${currentUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchData),
        });
        if (!res.ok) throw new Error();
      } catch {
        setProfileError("Serverga ulanib bo'lmadi!");
        setSaving(false);
        return;
      }
    }

    localStorage.setItem("user", JSON.stringify(updated));
    setCurrentUser(updated);
    setSaving(false);
    setProfileSuccess(true);
    setTimeout(() => { setProfileOpen(false); setProfileSuccess(false); }, 1200);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 px-6 py-3 flex items-center gap-4 shadow-sm border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
          <input
            type="text"
            placeholder={t("nav_searchHere")}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm outline-none border border-gray-100 dark:border-gray-700 focus:border-teal-300 dark:focus:border-teal-600 transition text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Globe className="w-4 h-4 text-teal-500" strokeWidth={2} />
              <span>{activeLang.flag}</span>
              <span className="text-xs font-medium">{activeLang.code.toUpperCase()}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 z-50 w-44 overflow-hidden">
                {LANGS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      currentLang === lang.code
                        ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-900/20"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {mode === "dark" ? <Sun className="w-4 h-4 text-yellow-400" strokeWidth={2} /> : <Moon className="w-4 h-4 text-gray-500" strokeWidth={2} />}
          </button>

          {topBarIcons.map((n, i) => (
            <button key={i} className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">
              <n.Icon className="w-5 h-5" strokeWidth={1.8} />
              <span className={`absolute -top-0.5 -right-0.5 ${n.color} text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold`}>{n.badge}</span>
            </button>
          ))}

          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("nav_hello")} <strong className="text-gray-800 dark:text-gray-200">{displayName}</strong>
            </span>
            <img
              src={avatarSrc}
              alt="avatar"
              referrerPolicy="no-referrer"
              onClick={openProfile}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-100 dark:ring-teal-900 cursor-pointer hover:ring-teal-400 transition"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://i.pravatar.cc/36?img=47"; }}
            />
          </div>
        </div>
      </header>

      {/* ===== Profile Edit Modal ===== */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setProfileOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profilni tahrirlash</h2>

            {/* Avatar preview + upload */}
            <div className="flex flex-col items-center mb-6 gap-3">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <img
                  src={formAvatar || avatarSrc}
                  alt="avatar"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-teal-100 dark:ring-teal-900"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://i.pravatar.cc/36?img=47"; }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-xs text-teal-500 hover:text-teal-600 font-semibold transition"
              >
                Rasmni o'zgartirish
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-1.5">ISM</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => { setFormName(e.target.value); setProfileError(""); }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-teal-400 transition"
                placeholder="Ismingiz"
              />
            </div>

            {/* Surname */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-1.5">FAMILYA</label>
              <input
                type="text"
                value={formSurname}
                onChange={(e) => { setFormSurname(e.target.value); setProfileError(""); }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-teal-400 transition"
                placeholder="Familyangiz"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-1.5">YANGI PAROL</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.8} />
                <input
                  type={showPass ? "text" : "password"}
                  value={formPassword}
                  onChange={(e) => { setFormPassword(e.target.value); setProfileError(""); }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-teal-400 transition"
                  placeholder="O'zgartirmasangiz bo'sh qoldiring"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-1.5">PAROLNI TASDIQLASH</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.8} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={formConfirm}
                  onChange={(e) => { setFormConfirm(e.target.value); setProfileError(""); }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-teal-400 transition"
                  placeholder="Parolni qayta kiriting"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {profileError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3.5 py-2.5 mb-4">
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">{profileError}</span>
              </div>
            )}

            {/* Success */}
            {profileSuccess && (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3.5 py-2.5 mb-4">
                <CheckCircle className="w-4 h-4 text-green-500" strokeWidth={2} />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Muvaffaqiyatli saqlandi!</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setProfileOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition disabled:opacity-60"
              >
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </main>
      </div>
    </div>
  );
}

export function StarRating({ rating, size = "sm" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${s} ${star <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : star - 0.5 <= rating ? "text-yellow-300 fill-yellow-300" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{rating}</span>
    </div>
  );
}

export const API = "http://localhost:3001";

export function useFetch(path) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`${API}${path}`).then((r) => r.json()).then(setData).catch(console.error);
  }, [path]);
  return data;
}
