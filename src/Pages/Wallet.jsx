import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import Layout from "../Layout";
import {
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Target,
  Wifi,
  X,
  Send,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const SAVING_TRACKERS = [
  { label: "Emergency Fund", current: 3500, target: 5000, color: "bg-teal-500", icon: PiggyBank, iconBg: "bg-teal-100", iconColor: "text-teal-500" },
  { label: "Investment", current: 7200, target: 10000, color: "bg-blue-500", icon: TrendingUp, iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { label: "Vacation", current: 1800, target: 3000, color: "bg-orange-500", icon: Target, iconBg: "bg-orange-100", iconColor: "text-orange-500" },
];

export default function Wallet() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(631517.55);
  const [incomingPayments, setIncomingPayments] = useState([]);
  const [balanceOverview, setBalanceOverview] = useState(null);
  const [balanceTab, setBalanceTab] = useState("Monthly");

  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendAmount, setSendAmount] = useState("");
  const [sending, setSending] = useState(false);

  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/paymentHistory")
      .then(r => r.json())
      .then(setPaymentHistory)
      .catch(() => setPaymentHistory([]));

    fetch("http://localhost:3001/transactions")
      .then(r => r.json())
      .then(data => setTransactions([...data].reverse()))
      .catch(() => setTransactions([]));

    fetch("http://localhost:3001/walletBalance/1")
      .then(r => r.json())
      .then(data => setBalance(data.amount))
      .catch(() => {});

    fetch("http://localhost:3001/incomingPayments")
      .then(r => r.json())
      .then(setIncomingPayments)
      .catch(() => setIncomingPayments([]));

    fetch("http://localhost:3001/balanceOverview")
      .then(r => r.json())
      .then(setBalanceOverview)
      .catch(() => setBalanceOverview(null));
  }, []);

  const handleSend = async () => {
    if (!selectedUser || !sendAmount || isNaN(Number(sendAmount)) || Number(sendAmount) <= 0) return;
    setSending(true);
    const amt = Number(sendAmount);
    const now = new Date();
    const dateStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newTx = {
      title: `Sent to ${selectedUser.name}`,
      amount: `-$${amt.toFixed(2)}`,
      type: "expense",
      date: `Today ${dateStr}`,
      icon: "💸",
    };
    const newBalance = parseFloat((balance - amt).toFixed(2));
    try {
      const res = await fetch("http://localhost:3001/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTx),
      });
      const saved = await res.json();
      setTransactions(prev => [saved, ...prev]);
      await fetch("http://localhost:3001/walletBalance/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newBalance }),
      });
    } catch {
      setTransactions(prev => [{ ...newTx, id: Date.now() }, ...prev]);
    }
    setBalance(newBalance);
    setSending(false);
    setShowSendModal(false);
    setSelectedUser(null);
    setSendAmount("");
  };

  const topSentUsers = (() => {
    const map = {};
    transactions
      .filter(tx => tx.type === "expense" && typeof tx.title === "string" && tx.title.startsWith("Sent to"))
      .forEach(tx => {
        const name = tx.title.replace("Sent to ", "");
        const amt = parseFloat(tx.amount.replace(/[^0-9.]/g, "")) || 0;
        if (!map[name]) map[name] = { name, count: 0, total: 0 };
        map[name].count++;
        map[name].total = parseFloat((map[name].total + amt).toFixed(2));
      });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  })();

  const currentOverview = balanceOverview
    ? (balanceTab === "Monthly" ? balanceOverview.monthly : balanceOverview.weekly)
    : { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], data: [30000,42000,38000,51000,48000,61000,55000,62000,58000,63000,60000,65000] };

  const balanceChartData = {
    labels: currentOverview.labels,
    datasets: [{
      data: currentOverview.data,
      borderColor: "#14B8A6",
      backgroundColor: "rgba(20,184,166,0.08)",
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
      borderWidth: 2,
    }],
  };

  const balanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `$${(c.raw / 1000).toFixed(1)}k` } } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#9CA3AF" } },
      y: { display: false },
    },
  };

  const doughnutData = {
    labels: ["Income", "Expense", "Savings"],
    datasets: [{
      data: [55, 30, 15],
      backgroundColor: ["#14B8A6", "#F87171", "#FBBF24"],
      borderWidth: 0,
      cutout: "72%",
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  return (
    <Layout>
      <div className="space-y-5">
        {/* Top Row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Balance & Doughnut */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500">Total Balance</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> +12.5%
              </span>
              <span className="text-xs text-gray-400">from last month</span>
            </div>
            <div className="h-32">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="flex justify-center gap-4 mt-3">
              {[
                { label: "Income", color: "bg-teal-500" },
                { label: "Expense", color: "bg-red-400" },
                { label: "Savings", color: "bg-yellow-400" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Balance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500">Balance Overview</h3>
              <select
                value={balanceTab}
                onChange={e => setBalanceTab(e.target.value)}
                className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 outline-none"
              >
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="h-52">
              <Line data={balanceChartData} options={balanceChartOptions} />
            </div>
          </div>

          {/* Card */}
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-400">Current Balance</p>
                <Wifi className="w-5 h-5 text-gray-400 rotate-90" />
              </div>
              <p className="text-2xl font-bold mb-6">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm tracking-[0.2em] text-gray-300 mb-3">5282 •••• •••• 3456</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Card Holder</p>
                  <p className="text-xs font-medium">Samantha</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Valid Thru</p>
                  <p className="text-xs font-medium">09/25</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-red-500 opacity-80"></div>
                  <div className="w-7 h-7 rounded-full bg-yellow-500 opacity-80"></div>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Send", icon: ArrowUpRight, color: "bg-teal-50 text-teal-600", onClick: () => setShowSendModal(true) },
                { label: "Receive", icon: ArrowDownRight, color: "bg-blue-50 text-blue-600", onClick: () => setShowReceiveModal(true) },
                { label: "Top Up", icon: CreditCard, color: "bg-orange-50 text-orange-600", onClick: () => setShowTopUpModal(true) },
              ].map((action) => (
                <button key={action.label} onClick={action.onClick} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl ${action.color} hover:opacity-80 transition`}>
                  <action.icon className="w-5 h-5" strokeWidth={2} />
                  <span className="text-[10px] font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saving Trackers */}
        <div className="grid grid-cols-3 gap-5">
          {SAVING_TRACKERS.map((tracker) => {
            const pct = Math.round((tracker.current / tracker.target) * 100);
            return (
              <div key={tracker.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${tracker.iconBg} flex items-center justify-center`}>
                    <tracker.icon className={`w-5 h-5 ${tracker.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tracker.label}</p>
                    <p className="text-xs text-gray-400">${tracker.current.toLocaleString()} of ${tracker.target.toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${tracker.color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-5 gap-5">
          {/* Payment History */}
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Payment History</h3>
              <button className="text-xs text-teal-600 font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-xs font-semibold text-gray-400 dark:text-gray-500">Name</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 dark:text-gray-500">Date</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 dark:text-gray-500">Amount</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 dark:text-gray-500">Status</th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 dark:text-gray-500">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={payment.avatar} alt={payment.name} className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{payment.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-gray-500">{payment.date}</td>
                      <td className="py-3 text-sm font-semibold text-gray-800">{payment.amount}</td>
                      <td className="py-3">
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                          payment.status === "Completed" ? "bg-green-50 text-green-600" :
                          payment.status === "Pending" ? "bg-yellow-50 text-yellow-600" :
                          "bg-red-50 text-red-500"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-500">{payment.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Recent Transactions</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-lg">{tx.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{tx.title}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Send Modal ── */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSendModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Send Money</h3>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Select Recipient</p>
            <div className="space-y-2 max-h-56 overflow-y-auto mb-5 pr-1">
              {paymentHistory.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                    selectedUser?.id === user.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-100 dark:border-gray-600 hover:border-teal-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.method}</p>
                  </div>
                  {selectedUser?.id === user.id && (
                    <span className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Amount</p>
            <div className="relative mb-5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={sendAmount}
                onChange={e => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            {sendAmount && Number(sendAmount) > balance && (
              <p className="text-xs text-red-500 mb-3">Insufficient balance</p>
            )}
            <button
              onClick={handleSend}
              disabled={!selectedUser || !sendAmount || Number(sendAmount) <= 0 || Number(sendAmount) > balance || sending}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition text-sm"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* ── Receive Modal ── */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowReceiveModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Received Payments</h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">People who sent you money</p>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {incomingPayments.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No incoming payments yet</p>
              ) : incomingPayments.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.date} · {p.method}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-500">+{p.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Top Up Modal ── */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowTopUpModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Recipients</h3>
              <button onClick={() => setShowTopUpModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">People you send money to most</p>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {topSentUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No send history yet. Send money to see stats here.</p>
              ) : topSentUsers.map((u, i) => {
                const maxTotal = topSentUsers[0].total;
                const pct = Math.round((u.total / maxTotal) * 100);
                return (
                  <div key={u.name} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-gray-800 flex-1">{u.name}</p>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">${u.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{u.count} transaction{u.count > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
