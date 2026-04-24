# TASK.MD - Sat-Up Loyihasi Vazifalari

## Loyiha haqida
**Sat-Up** — bu restoran admin dashboard loyihasi. "Sedap" nomli restoran boshqaruv paneli bo'lib, React + Vite + TailwindCSS + DaisyUI + Firebase + Chart.js texnologiyalari asosida qurilgan. Loyihada buyurtmalar, mijozlar, taomlar, sharhlar, analitika va boshqa bo'limlar mavjud.

---

## ICON TIZIMINI PROFESSIONAL QILISH (lucide-react)

### ICON-1: lucide-react kutubxonasini o'rnatish
- **Status:** ⏳ Bajarilmoqda
- **Tavsif:** `npm install lucide-react` — barcha inline SVG ikonkalarni professional lucide-react ikonkalari bilan almashtirish uchun

### ICON-2: Layout.jsx — Sidebar navigatsiya ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Layout.jsx`
- **Muammo:** 12 ta nav item hamma inline SVG, o'qib bo'lmaydi
- **Yechim:** lucide-react ikonkalari: LayoutDashboard, ClipboardList, FileText, Users, BarChart3, Star, UtensilsCrossed, Info, UserCircle, CalendarDays, MessageCircle, Wallet

### ICON-3: Layout.jsx — TopBar ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Layout.jsx`
- **Muammo:** Search, Bell, MessageCircle, Calendar, User ikonkalari inline SVG
- **Yechim:** lucide-react: Search, Bell, MessageCircle, CalendarDays, User

### ICON-4: Login.jsx — forma ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/Login.jsx`
- **Muammo:** Mail, Lock, Eye/EyeOff, Check ikonkalari inline SVG
- **Yechim:** lucide-react: Mail, Lock, Eye, EyeOff, CheckCircle

### ICON-5: SignUp.jsx — forma ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/SignUp.jsx`
- **Muammo:** User, Mail, Lock, Eye/EyeOff, ArrowRight ikonkalari inline SVG
- **Yechim:** lucide-react: User, Mail, Lock, Eye, EyeOff, ArrowRight

### ICON-6: Dashboard.jsx — barcha ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/Dashboard.jsx`

### ICON-7: Analytics.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/Analytics.jsx`

### ICON-8: OrderList.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/OrderList.jsx`

### ICON-9: OrderDetail.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/OrderDetail.jsx`

### ICON-10: Customer.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/Customer.jsx`

### ICON-11: CustomerDetail.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/CustomerDetail.jsx`

### ICON-12: Foods.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/Foods.jsx`

### ICON-13: FoodDetail.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/FoodDetail.jsx`

### ICON-14: Reviews.jsx — ikonkalarini almashtirish
- **Status:** ⏳ Kutilmoqda
- **Fayl:** `src/Pages/Reviews.jsx`

---

## KRITIK BUGLAR (Darhol tuzatish kerak)

### BUG-1: Calendar sahifasi CRASH qilayapti
- **Fayl:** `src/main.jsx:12`
- **Muammo:** `import Calendar from 'daisyui/components/calendar/index.js'` — DaisyUI Calendar komponenti noto'g'ri import qilingan. DaisyUI v5 da bu komponent React komponenti emas, CSS plugin.
- **Xatolik:** `TypeError: addComponents is not a function`
- **Yechim:** O'z Calendar komponentini `src/Pages/Calendar.jsx` dan import qilish kerak: `import Calendar from './Pages/Calendar.jsx'`

### BUG-2: Router da dublikat "/dashboard" yo'li
- **Fayl:** `src/main.jsx:29-39`
- **Muammo:** `/dashboard` path 2 marta e'lon qilingan — biri `<App />` bilan, ikkinchisi `<Dashboard />` bilan. Faqat bittasi qolishi kerak.

### BUG-3: Login sahifasida `<a>` ichida `<a>` (nested anchor)
- **Fayl:** `src/Pages/Login.jsx:298-300`
- **Muammo:** `<Link to="/signup">` (bu `<a>` tag) ichida yana `<a href="#">` bor. HTML standartiga ko'ra bu noto'g'ri.
- **Console error:** `In HTML, <a> cannot be a descendant of <a>`

### BUG-4: Google login dan keyin noto'g'ri yo'naltirish
- **Fayl:** `src/Pages/Login.jsx:44`
- **Muammo:** `navigate("/home")` — lekin `/home` route mavjud emas. `/dashboard` bo'lishi kerak.

### BUG-5: Layout.jsx da `useState` va `useEffect` import qilinmagan
- **Fayl:** `src/Layout.jsx:122-128`
- **Muammo:** `useFetch` hook ichida `useState` va `useEffect` ishlatilgan, lekin import qilinmagan.

### BUG-6: Firebase API kaliti ochiq holda kodda saqlangan
- **Fayl:** `src/firebase.js:10-17`
- **Muammo:** Firebase config'dagi apiKey va boshqa maxfiy ma'lumotlar to'g'ridan-to'g'ri kodda yozilgan. `.env` faylga ko'chirilishi kerak.

---

## BO'SH SAHIFALAR (To'liq yozilishi kerak)

### TASK-1: Chat sahifasini to'liq yozish
- **Fayl:** `src/Pages/Chat.jsx`
- **Holati:** Faqat `<div>Chat</div>` yozilgan — bo'sh
- **Kerak:** Layout bilan o'ralgan, chat interfeysi (contact list, message area, input box)
- **Kutilayotgan funksiyalar:** Xabar yuborish, kontaktlar ro'yxati, qidiruv

### TASK-2: Calendar sahifasini to'liq yozish
- **Fayl:** `src/Pages/Calendar.jsx`
- **Holati:** Faqat `<div>Calendar</div>` yozilgan — bo'sh
- **Kerak:** Layout bilan o'ralgan, kalendar ko'rinishi, voqealar (events)
- **Kutilayotgan funksiyalar:** Oylik/haftalik ko'rinish, voqea qo'shish

### TASK-3: Wallet sahifasini to'liq yozish
- **Fayl:** `src/Pages/Wallet.jsx`
- **Holati:** Faqat `<div>Wallet</div>` yozilgan — bo'sh
- **Kerak:** Layout bilan o'ralgan, hamyon balansi, tranzaksiyalar ro'yxati, kartalar
- **Kutilayotgan funksiyalar:** Balansni ko'rish, to'lov tarixi, karta boshqaruvi

---

## ARXITEKTURA MUAMMOLARI

### ARCH-1: PrivateRoute to'liq ishlamaydi
- **Fayl:** `src/Guard/PrivateRout.jsx`
- **Muammo:** Komponent bo'sh — faqat `useNavigate()` chaqirilgan, hech narsa return qilmaydi
- **Kerak:** Autentifikatsiyani tekshirib, login qilmagan foydalanuvchini `/` ga yo'naltirish
- **Kerak:** Barcha himoyalangan routelarni PrivateRoute bilan o'rash (`main.jsx` da)

### ARCH-2: Routelar Layout bilan o'ralmagan
- **Fayl:** `src/main.jsx`
- **Muammo:** Har bir sahifa o'zi Layout komponentini import qiladi. Bu o'rniga routelar nested layout pattern bilan yozilishi kerak (parent route Layout, children — sahifalar)

### ARCH-3: App.jsx ortiqcha / foydasiz
- **Fayl:** `src/App.jsx`
- **Muammo:** App.jsx faqat `<Dashboard />` ni render qiladi — bu router bilan dublikat. Yoki olib tashlanishi kerak, yoki Layout wrapper sifatida ishlatilishi kerak.

### ARCH-4: Har bir sahifada hardcoded fallback data bor
- **Muammo:** Har bir sahifada API so'rov muvaffaqiyatsiz bo'lsa, catch blokida katta hardcoded data bor. Bu `db.json` fayli yoki alohida mock data faylga chiqarilishi kerak.

---

## FUNKSIONAL YETISHMOVCHILIKLAR

### FUNC-1: Sahifalar o'rtasida navigatsiya parametrli emas
- **Muammo:** OrderDetail faqat bitta buyurtma ko'rsatadi (hardcoded). `/orderdetail/:id` bo'lishi va OrderList dan bosilganda aniq buyurtma ko'rsatilishi kerak.
- Xuddi shunday: `/customerdetail/:id`, `/fooddetail/:id`

### FUNC-2: Sidebar "Add Menus" tugmasi ishlamaydi
- **Fayl:** `src/Layout.jsx:48`
- **Muammo:** Button hech narsaga bog'lanmagan

### FUNC-3: TopBar notification ikonkalar faqat dekorativ
- **Fayl:** `src/Layout.jsx:70-82`
- **Muammo:** Bildirishnomalar tugmalari hech narsaga bog'lanmagan, badgelar statik

### FUNC-4: Search (qidiruv) ishlamaydi
- **Fayl:** `src/Layout.jsx:67`
- **Muammo:** TopBar dagi search input faqat ko'rinish uchun, hech qanday filter/search logikasi yo'q

### FUNC-5: OrderList dagi "All Status" filter ishlamaydi
- **Fayl:** `src/Pages/OrderList.jsx:46-51`
- **Muammo:** Select element o'zgarishga hech qanday filter qo'llanilmaydi

### FUNC-6: OrderList dagi "Accept/Reject Order" tugmalari ishlamaydi
- **Fayl:** `src/Pages/OrderList.jsx:87-94`
- **Muammo:** Tugmalar faqat ko'rinish uchun, hech qanday action yo'q

### FUNC-7: Foods sahifasida "New Menu" tugmasi ishlamaydi
- **Fayl:** `src/Pages/Foods.jsx:67`
- **Muammo:** Tugma hech narsaga bog'lanmagan, modal yoki forma yo'q

### FUNC-8: Foods sahifasida search (qidiruv) ishlamaydi
- **Fayl:** `src/Pages/Foods.jsx:56`

### FUNC-9: Foods dagi View/Edit/Delete/Duplicate tugmalari ishlamaydi
- **Fayl:** `src/Pages/Foods.jsx:90-93`

### FUNC-10: Reviews dagi "Load More" tugmasi ishlamaydi
- **Fayl:** `src/Pages/Reviews.jsx:125`

### FUNC-11: Tab tugmalari (Per Day/Weekly/Daily) ishlamaydi
- **Fayllar:** Analytics.jsx, Foods.jsx, CustomerDetail.jsx, FoodDetail.jsx
- **Muammo:** Tugmalar bor, lekin holat o'zgarishi yoki data filterlash logikasi yo'q

### FUNC-12: SignUp da Google ro'yxatdan o'tish ishlamaydi
- **Fayl:** `src/Pages/SignUp.jsx:442`
- **Muammo:** Google button bor, lekin onClick handler yo'q (Login da bor, SignUp da yo'q)

---

## UI/UX YAXSHILASH

### UI-1: Chat, Calendar, Wallet sahifalarida Layout yo'q
- Bo'sh sahifalar Layout bilan o'ralmagan — navigatsiya ko'rinmaydi

### UI-2: Responsive design yo'q
- Barcha sahifalar faqat desktop uchun — mobil va planshet versiya yo'q

### UI-3: Loading holatlari yaxshilanishi kerak
- Hozir faqat spinner bor, skeleton loading yaxshiroq bo'lardi

### UI-4: 404 sahifa yo'q
- Noto'g'ri URL kiritilsa, hech qanday xato sahifasi ko'rinmaydi

---

## XAVFSIZLIK

### SEC-1: Parollar ochiq saqlanayapti
- **Fayl:** `src/Pages/Login.jsx:22`, `src/Pages/SignUp.jsx:38`
- **Muammo:** `password` field serverga va localStorage ga ochiq holda yuboriladi/saqlanadi

### SEC-2: Firebase kalitlari .env ga ko'chirilishi kerak
- **Fayl:** `src/firebase.js`
- `.env` fayl yaratib, `VITE_FIREBASE_*` environment variable lar ishlatilishi kerak

---

## TEXNIK QARZ (Technical Debt)

### DEBT-1: Dashboard.jsx juda katta — 500+ qator bitta faylda
- Sidebar, TopBar, chartlar, stat kartalar hammasi bitta faylda. Component larga bo'linishi kerak.
- Bu allaqachon `Layout.jsx` da ham takrorlangan (Sidebar va TopBar ikki joyda yozilgan)

### DEBT-2: API URL hardcoded
- `http://localhost:3001` har bir sahifada alohida yozilgan. Layout.jsx dagi `API` constant bor, lekin sahifalar uni ishlatmaydi.

### DEBT-3: json-server (backend) yo'q
- Loyihada `http://localhost:3001` ga so'rov yuboriladi, lekin `db.json` yoki json-server konfiguratsiyasi yo'q. Backend qo'shilishi kerak.
