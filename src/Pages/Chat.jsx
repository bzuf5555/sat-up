import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../Layout";
import { Search, Plus, Paperclip, Smile, Send, X } from "lucide-react";

const AVATARS = [
  "https://i.pravatar.cc/28?img=12",
  "https://i.pravatar.cc/28?img=15",
  "https://i.pravatar.cc/28?img=20",
  "https://i.pravatar.cc/28?img=33",
];

const API = "http://localhost:3001";

export default function Chat() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [messagesByContact, setMessagesByContact] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const messages = messagesByContact[activeChat] || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", avatar: "" });
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/contacts`)
      .then(r => r.json())
      .then(data => {
        setContacts(data);
        setActiveChat(prev => prev ?? (data[2]?.id || data[0]?.id));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeChat == null) return;
    fetch(`${API}/messages?contactId=${activeChat}`)
      .then(r => r.json())
      .then(data => setMessagesByContact(prev => ({ ...prev, [activeChat]: data })))
      .catch(() => {});
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setInputText("");
    const tempMsg = { id: Date.now(), contactId: activeChat, sender: "me", text, time };
    setMessagesByContact(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), tempMsg],
    }));
    fetch(`${API}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId: String(activeChat), sender: "me", text, time }),
    }).catch(() => {});
  };

  const addClient = async () => {
    if (!newClient.name.trim()) return;
    const avatarUrl = newClient.avatar.trim() || `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`;
    const client = { name: newClient.name.trim(), avatar: avatarUrl, lastMsg: "", time: "now", online: true, pinned: false };
    const res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    const saved = await res.json();
    setContacts(prev => [...prev, saved]);
    setNewClient({ name: "", avatar: "" });
    setAddModal(false);
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pinnedContacts = filtered.filter(c => c.pinned);
  const recentContacts = filtered.filter(c => !c.pinned);
  const activeContact = contacts.find(c => c.id === activeChat);

  return (
    <Layout>
      <div className="flex gap-5 h-[calc(100vh-130px)]">
        {/* Left - Contact List */}
        <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex flex-col flex-shrink-0 overflow-hidden">
          <div className="p-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm outline-none border border-gray-100 dark:border-gray-600 focus:border-teal-300 transition text-gray-800 dark:text-gray-200"
              />
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center text-white hover:bg-teal-600 transition flex-shrink-0"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {pinnedContacts.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">{t("chat_pinned")}</p>
                {pinnedContacts.map(contact => (
                  <ContactItem key={contact.id} contact={contact} active={activeChat === contact.id} onClick={() => setActiveChat(contact.id)} />
                ))}
              </>
            )}
            {recentContacts.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mt-4 mb-1">{t("chat_recent")}</p>
                {recentContacts.map(contact => (
                  <ContactItem key={contact.id} contact={contact} active={activeChat === contact.id} onClick={() => setActiveChat(contact.id)} />
                ))}
              </>
            )}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-6">{t("chat_noContacts")}</p>
            )}
          </div>
        </div>

        {/* Right - Chat Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeContact?.avatar} alt={activeContact?.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{activeContact?.name}</h3>
                <p className="text-xs text-teal-500">4 {t("chat_active")}</p>
              </div>
            </div>
            <div className="flex items-center -space-x-2">
              {AVATARS.map((av, i) => (
                <img key={i} src={av} alt="member" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
              ))}
              <span className="w-7 h-7 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">+2</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[65%]">
                  {msg.label && <p className="text-[10px] text-gray-400 mb-1 text-right">{msg.label}</p>}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed w-fit ${msg.sender === "me" ? "bg-teal-500 text-white rounded-br-sm" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-bl-sm"}`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${msg.sender === "me" ? "text-right" : "text-left"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Paperclip className="w-5 h-5" strokeWidth={1.8} />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <Smile className="w-5 h-5" strokeWidth={1.8} />
                </button>
              </div>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
                placeholder={t("chat_placeholder")}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm outline-none border border-gray-100 dark:border-gray-600 focus:border-teal-300 transition text-gray-800 dark:text-gray-200"
              />
              <button
                type="button"
                onClick={() => setInputText("")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <X className="w-4 h-4" strokeWidth={2} />
                {t("chat_cancel")}
              </button>
              <button
                type="button"
                onClick={sendMessage}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-teal-500 rounded-xl hover:bg-teal-600 transition shadow-sm"
              >
                <Send className="w-4 h-4" strokeWidth={2} />
                {t("chat_send")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setAddModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("chat_addClient")}</h3>
              <button onClick={() => setAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t("chat_nameRequired")} <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder={t("chat_clientName")}
                  value={newClient.name}
                  onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t("chat_clientAvatar")} <span className="text-gray-400 font-normal">({t("chat_avatarOptional")})</span></label>
                <input
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="https://..."
                  value={newClient.avatar}
                  onChange={e => setNewClient(p => ({ ...p, avatar: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAddModal(false)} className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t("cancel")}</button>
              <button onClick={addClient} className="flex-1 bg-teal-500 text-white rounded-xl py-2 text-sm font-semibold hover:bg-teal-600">{t("chat_addBtn")}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function ContactItem({ contact, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${active ? "bg-teal-50 dark:bg-teal-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
    >
      <div className="relative flex-shrink-0">
        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
        {contact.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{contact.name}</p>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{contact.time}</span>
        </div>
        <p className="text-xs text-gray-400 truncate">{contact.lastMsg}</p>
      </div>
    </button>
  );
}
