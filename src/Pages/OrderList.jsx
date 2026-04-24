import { useState, useEffect } from "react";
import Layout from "../Layout";
import { CalendarDays, ArrowUpDown, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";

const statusStyle = {
  "New Order": "bg-red-50 text-red-500 border border-red-200",
  "On Delivery": "bg-blue-50 text-blue-500 border border-blue-200",
  "Delivered": "bg-green-50 text-green-500 border border-green-200",
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then(r => r.json())
      .then(setOrders)
      .catch(() => setOrders([
        { id:"#555231",date:"26 March 2020, 12:42 AM",customer:"Mikasa Ackerman",location:"Corner Street 5th London",amount:"$184.52",status:"New Order" },
        { id:"#555232",date:"26 March 2020, 11:42 AM",customer:"Eren Yeager",location:"John's Road London 671",amount:"$184.52",status:"On Delivery" },
        { id:"#555233",date:"26 March 2020, 12:22 AM",customer:"Grisha Yeager",location:"31 The Green London",amount:"$364.52",status:"Delivered" },
        { id:"#555234",date:"26 March 2020, 10:42 AM",customer:"Historia Reuss",location:"11 Church Road London",amount:"$184.52",status:"New Order" },
        { id:"#555235",date:"26 March 2020, 12:00 AM",customer:"Levi Ackerman",location:"21 King Street London",amount:"$564.52",status:"On Delivery" },
        { id:"#555236",date:"26 March 2020, 13:42 AM",customer:"Armin Melaney",location:"14 The Drive London",amount:"$186.52",status:"New Order" },
        { id:"#555237",date:"26 March 2020, 14:42 AM",customer:"Ronald Jamez",location:"69 Station's Road London",amount:"$164.00",status:"New Order" },
        { id:"#555238",date:"26 March 2020, 15:42 AM",customer:"Anandreansyah",location:"45 Brighton Hills London",amount:"$164.02",status:"Delivered" },
        { id:"#555239",date:"26 March 2020, 16:42 AM",customer:"Putra Prawira",location:"15 Leicester Street Road",amount:"$184.60",status:"On Delivery" },
        { id:"#5552310",date:"26 March 2020, 18:42 AM",customer:"John Snow",location:"7th The Avenue Apartment",amount:"$164.42",status:"New Order" },
        { id:"#5552311",date:"26 March 2020, 21:42 AM",customer:"Snowden Spy",location:"72 Manchester Street",amount:"$344.52",status:"Delivered" },
        { id:"#5552312",date:"26 March 2020, 22:42 AM",customer:"John Wickerman",location:"12 Chelsea Road London",amount:"$74.55",status:"On Delivery" },
      ]));
  }, []);

  const filtered = statusFilter === "All Status" ? orders : orders.filter(o => o.status === statusFilter);
  const perPage = 12;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleAccept = (order) => {
    const updated = { ...order, status: "Delivered" };
    fetch(`http://localhost:3001/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then(r => r.json())
      .then(saved => {
        setOrders(prev => prev.map(o => o.id === saved.id ? saved : o));
        setActiveMenu(null);
      })
      .catch(err => console.error("Accept error:", err));
  };

  const handleReject = (order) => {
    if (!window.confirm("Buyurtmani rad etmoqchimisiz?")) return;
    fetch(`http://localhost:3001/orders/${order.id}`, { method: "DELETE" })
      .then(() => {
        setOrders(prev => prev.filter(o => o.id !== order.id));
        setActiveMenu(null);
      })
      .catch(err => console.error("Reject error:", err));
  };

  return (
    <Layout>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Orders</h2>
          <p className="text-sm text-gray-400">This is your order list data</p>
        </div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 outline-none shadow-sm">
            <option>All Status</option>
            <option>New Order</option>
            <option>On Delivery</option>
            <option>Delivered</option>
          </select>
          <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
            <CalendarDays className="w-4 h-4 text-teal-500" strokeWidth={2} />
            Today
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden" onClick={() => setActiveMenu(null)}>
        {/* Table header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-teal-500 text-white text-sm font-semibold">
          {["Order ID","Date","Customer Name","Location","Amount","Status Order"].map((h,i) => (
            <div key={i} className="flex items-center gap-1">
              {h}
              <ArrowUpDown className="w-3 h-3 opacity-70" strokeWidth={2} />
            </div>
          ))}
        </div>

        {/* Rows */}
        {paged.map((order, idx) => (
          <div key={order.id} className={`grid grid-cols-6 gap-4 px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300 items-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition relative ${idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/30 dark:bg-gray-750"}`}>
            <div className="font-medium text-gray-800">{order.id}</div>
            <div className="text-gray-500">{order.date}</div>
            <div>{order.customer}</div>
            <div className="text-gray-500">{order.location}</div>
            <div className="font-semibold">{order.amount}</div>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusStyle[order.status]}`}>{order.status}</span>
              <div className="relative">
                <button
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === order.id ? null : order.id); }}
                >
                  <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                </button>
                {activeMenu === order.id && (
                  <div className="absolute right-0 top-7 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 z-10 w-40 overflow-hidden" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleAccept(order)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-teal-600 hover:bg-teal-50">
                      <CheckCircle className="w-4 h-4" strokeWidth={2} />
                      Accept Order
                    </button>
                    <button onClick={() => handleReject(order)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                      Reject Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Showing {paged.length} from {filtered.length} data</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">&lsaquo;</button>
          {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === currentPage ? "bg-teal-500 text-white" : "border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">&rsaquo;</button>
        </div>
      </div>
    </Layout>
  );
}
