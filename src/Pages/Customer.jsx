import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../Layout";
import { Filter, ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, ChevronDown, MapPin, X } from "lucide-react";

export default function Customer() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);

  const handleEditSave = () => {
    fetch(`http://localhost:3001/customers/${encodeURIComponent(editCustomer.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCustomer),
    }).catch(() => {});
    setCustomers(prev => prev.map(c => c.id === editCustomer.id ? editCustomer : c));
    setEditCustomer(null);
  };

  const handleDelete = () => {
    fetch(`http://localhost:3001/customers/${encodeURIComponent(deleteCustomer.id)}`, {
      method: "DELETE",
    }).catch(() => {});
    setCustomers(prev => prev.filter(c => c.id !== deleteCustomer.id));
    setDeleteCustomer(null);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCustomers(prev => [...prev].sort((a, b) =>
      order === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    ));
    setFilterOpen(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetch("http://localhost:3001/customers")
      .then(r => r.json())
      .then(setCustomers)
      .catch(() => setCustomers([
        { id:"#C-004560",joinDate:"27 March 2020, 12:42 AM",name:"Veronica",location:"Corner Street 5th, London",totalSpent:"$78.92",lastOrder:"$35.35" },
        { id:"#C-004561",joinDate:"28 March 2020, 12:42 AM",name:"Rio Da Luca",location:"Emerald Tower 6th, London",totalSpent:"$8.90",lastOrder:"$18.75" },
        { id:"#C-004562",joinDate:"29 March 2020, 12:42 AM",name:"Fernando",location:"Blessing Hills 1st, London",totalSpent:"$16.87",lastOrder:"$75.55" },
        { id:"#C-004563",joinDate:"30 March 2020, 12:42 AM",name:"Yenni Tan",location:"Greensand 2nd, London",totalSpent:"$18.80",lastOrder:"$57.76" },
        { id:"#C-004564",joinDate:"5 April 2020, 12:42 AM",name:"Denny Chang",location:"St. Bakerfield 3rd, London",totalSpent:"$38.92",lastOrder:"$21.75" },
        { id:"#C-004565",joinDate:"8 April 2020, 12:42 AM",name:"Andrea Liaw",location:"Kingsroad 45th, London",totalSpent:"$74.92",lastOrder:"$75.55" },
        { id:"#C-004566",joinDate:"9 April 2020, 12:42 AM",name:"Siangny The",location:"11 Church Road, London",totalSpent:"$78.52",lastOrder:"$21.61" },
        { id:"#C-004567",joinDate:"11 April 2020, 12:42 AM",name:"Wanda Maximoff",location:"21 Long Beach Tower",totalSpent:"$88.92",lastOrder:"$61.56" },
        { id:"#C-004568",joinDate:"15 April 2020, 12:42 AM",name:"Natasya Romanoff",location:"13 Boulevard Dreams",totalSpent:"$98.92",lastOrder:"$55.00" },
        { id:"#C-004569",joinDate:"19 April 2020, 12:42 AM",name:"Tony Stark",location:"Sandbay San Tower",totalSpent:"$28.93",lastOrder:"$21.00" },
        { id:"#C-004570",joinDate:"10 May 2020, 12:42 AM",name:"John Banner",location:"La Plaza de Tower",totalSpent:"$18.21",lastOrder:"$21.16" },
        { id:"#C-004571",joinDate:"26 May 2020, 12:42 AM",name:"Arthur da Roca",location:"19 St. John Road, London",totalSpent:"$87.98",lastOrder:"$16.55" },
      ]));
  }, []);

  const perPage = 12;
  const totalPages = Math.ceil(customers.length / perPage);
  const paged = customers.slice((currentPage - 1) * perPage, currentPage * perPage);

  const FIELDS = [
    { label: t("cust_id"),        key: "id" },
    { label: t("cust_joinDate"),  key: "joinDate" },
    { label: t("cust_name"),      key: "name" },
    { label: t("cust_location"),  key: "location" },
    { label: t("cust_totalSpent"),key: "totalSpent" },
    { label: t("cust_lastOrder"), key: "lastOrder" },
  ];

  return (
    <Layout>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("cust_title")}</h2>
          <p className="text-sm text-gray-400">{t("cust_subtitle")}</p>
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setFilterOpen(o => !o)}
          >
            <Filter className="w-4 h-4 text-teal-500" strokeWidth={2} />
            {t("filter")}
            <ChevronDown className="w-3 h-3 text-gray-400" strokeWidth={2} />
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 z-50 w-52 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("cust_sortByName")}</p>
              </div>
              <button
                className={`flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${sortOrder === "az" ? "text-blue-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
                onClick={() => handleSort("az")}
              >
                <span className="text-base">A</span><span className="text-gray-400">→</span><span className="text-base">Z</span>
                <span className="ml-auto text-xs text-gray-400">A-Z</span>
              </button>
              <button
                className={`flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${sortOrder === "za" ? "text-blue-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}
                onClick={() => handleSort("za")}
              >
                <span className="text-base">Z</span><span className="text-gray-400">→</span><span className="text-base">A</span>
                <span className="ml-auto text-xs text-gray-400">Z-A</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden" onClick={() => { setActiveMenu(null); setFilterOpen(false); }}>
        <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-blue-500 text-white text-sm font-semibold">
          {FIELDS.map((f, i) => (
            <div key={i} className="flex items-center gap-1">
              {f.label}
              <ArrowUpDown className="w-3 h-3 opacity-70" strokeWidth={2} />
            </div>
          ))}
        </div>

        {paged.map((c, idx) => (
          <div key={c.id} className={`grid grid-cols-6 gap-4 px-6 py-3.5 text-sm items-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition relative ${idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/30 dark:bg-gray-750"}`}>
            <div className="font-medium text-gray-500 dark:text-gray-400">{c.id}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">{c.joinDate}</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{c.name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">{c.location}</div>
            <div className="font-semibold text-gray-800 dark:text-gray-200">{c.totalSpent}</div>
            <div className="flex items-center justify-between">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium">{c.lastOrder}</span>
              <div className="relative">
                <button
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400"
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === c.id ? null : c.id); }}
                >
                  <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                </button>
                {activeMenu === c.id && (
                  <div className="absolute right-0 top-7 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 z-10 w-36 overflow-hidden" onClick={e => e.stopPropagation()}>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                      onClick={() => { setViewCustomer(c); setActiveMenu(null); }}>
                      <Eye className="w-4 h-4" strokeWidth={2} />{t("viewDetail")}
                    </button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => { setEditCustomer({...c}); setActiveMenu(null); }}>
                      <Pencil className="w-4 h-4" strokeWidth={2} />{t("edit")}
                    </button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => { setDeleteCustomer(c); setActiveMenu(null); }}>
                      <Trash2 className="w-4 h-4" strokeWidth={2} />{t("delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("showingData", { shown: paged.length, total: customers.length })}</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">&lsaquo;</button>
          {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p===currentPage?"bg-blue-500 text-white":"border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">&rsaquo;</button>
        </div>
      </div>

      {/* View Detail Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setViewCustomer(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("cust_detailTitle")}</h3>
              <button onClick={() => setViewCustomer(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"><X className="w-4 h-4" strokeWidth={2} /></button>
            </div>
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 text-2xl font-bold mb-2">{viewCustomer.name.charAt(0)}</div>
              <p className="text-base font-bold text-gray-900 dark:text-white">{viewCustomer.name}</p>
              <p className="text-xs text-gray-400">{viewCustomer.id}</p>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 mb-4">
              <MapPin className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" strokeWidth={2} />
              <p className="text-sm text-gray-600 dark:text-gray-300">{viewCustomer.location}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: t("cust_joinDate"), value: viewCustomer.joinDate }, { label: t("cust_totalSpent"), value: viewCustomer.totalSpent }, { label: t("cust_lastOrder"), value: viewCustomer.lastOrder }].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditCustomer(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("cust_editTitle")}</h3>
              <button onClick={() => setEditCustomer(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"><X className="w-4 h-4" strokeWidth={2} /></button>
            </div>
            <div className="space-y-4">
              {FIELDS.map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                  <input
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editCustomer[key]}
                    onChange={e => setEditCustomer(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditCustomer(null)} className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t("cancel")}</button>
              <button onClick={handleEditSave} className="flex-1 bg-blue-500 text-white rounded-xl py-2 text-sm font-semibold hover:bg-blue-600">{t("save")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteCustomer(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t("cust_deleteTitle")}</h3>
            <p className="text-sm text-gray-400 mb-6">{t("cust_deleteConfirm")} <span className="font-semibold text-gray-700 dark:text-gray-300">{deleteCustomer.name}</span>? {t("cust_deleteWarning")}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteCustomer(null)} className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t("cancel")}</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white rounded-xl py-2 text-sm font-semibold hover:bg-red-600">{t("delete")}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
