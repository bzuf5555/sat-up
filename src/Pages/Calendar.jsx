import { useState, useEffect } from "react";
import Layout from "../Layout";
import { ChevronLeft, ChevronRight, Plus, X, Clock, FileText, Flag, Pencil, Trash2 } from "lucide-react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const COLOR_MAP = {
  yellow: "bg-yellow-100 text-yellow-700",
  pink: "bg-pink-100 text-pink-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
  teal: "bg-teal-100 text-teal-600",
};

const COLOR_OPTIONS = ["yellow", "pink", "green", "orange", "blue", "red", "purple", "teal"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const PRIORITY_COLORS = { Low: "text-green-500", Medium: "text-yellow-500", High: "text-red-500" };

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }
function formatTime(t) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${String(h12).padStart(2, "0")}:${m} ${ampm}`;
}
function timeToInput(t) {
  if (!t) return "12:00";
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "12:00";
  let h = parseInt(match[1]);
  const m = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m}`;
}

const EMPTY_FORM = { title: "", time: "12:00", color: "yellow", badge: "", description: "", priority: "Medium" };

export default function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState("Month");
  const [events, setEvents] = useState([]);

  // Selected day for bottom detail panel
  const [selectedDay, setSelectedDay] = useState(null); // day number or null

  // New / Edit schedule modal
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = new, object = edit
  const [form, setForm] = useState({ day: 1, ...EMPTY_FORM });

  useEffect(() => {
    fetch("http://localhost:3001/events")
      .then(r => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const monthName = new Date(year, month).toLocaleString("en-US", { month: "long" });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  // Build grid
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const todayDay = now.getDate();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  const getDayEvents = (day) => events.filter(e => e.day === day && e.month === month && e.year === year);

  // Click on a day cell — show detail panel at bottom
  const handleDayClick = (cell) => {
    if (!cell.current) return;
    setSelectedDay(prev => (prev === cell.day ? null : cell.day));
  };

  // Open New Schedule modal (optionally pre-select day)
  const openNewModal = (day = 1) => {
    setEditingEvent(null);
    setForm({ day, ...EMPTY_FORM });
    setShowModal(true);
  };

  // Open Edit modal pre-filled
  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setForm({
      day: ev.day,
      title: ev.title || "",
      time: timeToInput(ev.time),
      color: ev.color || "yellow",
      badge: ev.badge || "",
      description: ev.description || "",
      priority: ev.priority || "Medium",
    });
    setShowModal(true);
  };

  // Save (create or update)
  const handleSave = () => {
    if (!form.title.trim()) return;
    const payload = {
      day: form.day, month, year,
      title: form.title,
      time: formatTime(form.time),
      color: form.color,
      badge: form.badge,
      description: form.description,
      priority: form.priority,
    };

    if (editingEvent) {
      fetch(`http://localhost:3001/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingEvent.id }),
      })
        .then(r => r.json())
        .then(saved => {
          setEvents(prev => prev.map(e => e.id === saved.id ? saved : e));
          setShowModal(false);
          setEditingEvent(null);
        })
        .catch(console.error);
    } else {
      fetch("http://localhost:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(r => r.json())
        .then(saved => {
          setEvents(prev => [...prev, saved]);
          setShowModal(false);
        })
        .catch(console.error);
    }
  };

  const handleDelete = (eventId) => {
    fetch(`http://localhost:3001/events/${eventId}`, { method: "DELETE" })
      .then(() => setEvents(prev => prev.filter(e => e.id !== eventId)))
      .catch(console.error);
  };

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{monthName} {year}</h2>
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
              {["Date", "Week", "Month", "Year"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    view === v ? "bg-teal-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 text-sm font-medium text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition">
              Today ({isCurrentMonth ? todayDay : "-"})
            </button>
            <button
              onClick={() => openNewModal(isCurrentMonth ? todayDay : 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition shadow-sm"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              New Schedule
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900">
            {DAY_NAMES.map((d) => (
              <div key={d} className="px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 text-center border-b border-gray-100 dark:border-gray-700">
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((cell, ci) => {
                const isToday = isCurrentMonth && cell.current && cell.day === todayDay;
                const dayEvs = cell.current ? getDayEvents(cell.day) : [];
                const hasEvents = dayEvs.length > 0;

                return (
                  <div
                    key={ci}
                    onClick={() => handleDayClick(cell)}
                    className={`min-h-[100px] px-2 py-1.5 border-b border-r border-gray-100 dark:border-gray-700 ${
                      !cell.current
                        ? "bg-gray-50/50 dark:bg-gray-900/50 cursor-default"
                        : cell.current && selectedDay === cell.day
                        ? "bg-teal-50/60 dark:bg-teal-900/20 cursor-pointer ring-2 ring-inset ring-teal-400"
                        : hasEvents
                        ? "bg-white dark:bg-gray-800 cursor-pointer hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition"
                        : "bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    } ${ci === 6 ? "border-r-0" : ""}`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 text-xs font-medium rounded-full ${
                        isToday
                          ? "bg-teal-500 text-white"
                          : cell.current
                          ? "text-gray-700 dark:text-gray-200"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      {cell.day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvs.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={e => { e.stopPropagation(); openEditModal(ev); }}
                          className={`group flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${COLOR_MAP[ev.color] || "bg-gray-100 text-gray-600"} truncate cursor-pointer relative`}
                          title={`${ev.title} — ${ev.time}\n${ev.description || ""}\nPriority: ${ev.priority || "Medium"}`}
                        >
                          <span className="truncate">{ev.title}</span>
                          {ev.badge && (
                            <span className="ml-auto px-1 py-0.5 rounded bg-red-400 text-white text-[8px] font-bold flex-shrink-0">
                              {ev.badge}
                            </span>
                          )}
                          {ev.time && !ev.badge && (
                            <span className="ml-auto text-[8px] opacity-70 flex-shrink-0">{ev.time}</span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }}
                            className="hidden group-hover:flex absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full items-center justify-center text-[8px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Day Detail Panel (bottom of calendar) ── */}
      {selectedDay && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {selectedDay} {monthName} {year} — {DAY_NAMES[new Date(year, month, selectedDay).getDay()]}
              </h3>
              <p className="text-xs text-gray-400">
                {getDayEvents(selectedDay).length > 0
                  ? `${getDayEvents(selectedDay).length} ta jadval`
                  : "Bu kunda hech qanday jadval yo'q"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openNewModal(selectedDay)}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                Yangi jadval
              </button>
              <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {getDayEvents(selectedDay).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300 dark:text-gray-600">
              <Clock className="w-12 h-12 mb-3 opacity-40" strokeWidth={1.5} />
              <p className="text-sm text-gray-400 dark:text-gray-500">Bu kun uchun jadval qo'shing</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {getDayEvents(selectedDay).map((ev) => (
                <div
                  key={ev.id}
                  className={`rounded-xl p-4 ${COLOR_MAP[ev.color] || "bg-gray-100 text-gray-600"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{ev.title}</p>
                        {ev.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[9px] font-bold flex-shrink-0">
                            {ev.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs opacity-75">
                        {ev.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ev.time}
                          </span>
                        )}
                        {ev.priority && (
                          <span className={`font-medium ${PRIORITY_COLORS[ev.priority]}`}>
                            <Flag className="w-3 h-3 inline mr-0.5" />
                            {ev.priority}
                          </span>
                        )}
                      </div>
                      {ev.description && (
                        <p className="text-xs mt-2 opacity-60 leading-relaxed">{ev.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(ev)}
                        className="w-7 h-7 rounded-lg bg-white/60 hover:bg-white/90 flex items-center justify-center transition"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="w-7 h-7 rounded-lg bg-white/60 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── New / Edit Schedule Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowModal(false); setEditingEvent(null); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[480px] shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingEvent ? "Edit Schedule" : "New Schedule"}
              </h3>
              <button onClick={() => { setShowModal(false); setEditingEvent(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Event nomi..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              {/* Day + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kun tanlang</label>
                  <select
                    value={form.day}
                    onChange={e => setForm({ ...form, day: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d} — {monthName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Soat
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              {/* Color + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rang</label>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm({ ...form, color: c })}
                        className={`w-7 h-7 rounded-full border-2 transition ${form.color === c ? "border-gray-800 dark:border-white scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: { yellow:"#FEF3C7",pink:"#FCE7F3",green:"#D1FAE5",orange:"#FFEDD5",blue:"#DBEAFE",red:"#FEE2E2",purple:"#EDE9FE",teal:"#CCFBF1" }[c] }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Flag className="w-3.5 h-3.5" />
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {PRIORITY_OPTIONS.map(p => (
                      <button
                        key={p}
                        onClick={() => setForm({ ...form, priority: p })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                          form.priority === p
                            ? `${PRIORITY_COLORS[p]} border-current bg-white dark:bg-gray-700`
                            : "text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Badge (ixtiyoriy)</label>
                <input
                  value={form.badge}
                  onChange={e => setForm({ ...form, badge: e.target.value })}
                  placeholder="Masalan: Event, VIP, Urgent..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  Izoh
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Qo'shimcha ma'lumot..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Ko'rinishi:</p>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${COLOR_MAP[form.color]}`}>
                <span>{form.title || "Event nomi"}</span>
                {form.badge && <span className="px-1 py-0.5 rounded bg-red-400 text-white text-[8px] font-bold">{form.badge}</span>}
                <span className="text-[9px] opacity-70 ml-1">{form.time ? formatTime(form.time) : ""}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {form.day} {monthName} {year} • Priority: <span className={PRIORITY_COLORS[form.priority]}>{form.priority}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              {editingEvent && (
                <button
                  onClick={() => { handleDelete(editingEvent.id); setShowModal(false); setEditingEvent(null); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-red-200 dark:border-red-800 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                  Delete
                </button>
              )}
              <button
                onClick={() => { setShowModal(false); setEditingEvent(null); }}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600">
                {editingEvent ? "Save Changes" : "Save Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
