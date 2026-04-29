import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../Layout";
import { Search, List, LayoutGrid, Plus, Eye, Pencil, Trash2, Copy, X, ImagePlus, DollarSign, Tag, Layers, AlignLeft, Leaf, FlaskConical, Star } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const EMPTY_ADD = { name: "", category: "Main Course", subCategory: "", img: "", price: "", discount: "", rating: "5.0", description: "", ingredients: "", nutrition: "", available: true };

const CATEGORIES = ["Main Course", "Appetizer", "Dessert", "Beverage", "Soup", "Salad", "Snack"];

export default function Foods() {
  const navigate = useNavigate();
  const location = useLocation();
  const [foods, setFoods] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editFood, setEditFood] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD);
  const [addStep, setAddStep] = useState(1);

  useEffect(() => {
    fetch("http://localhost:3001/foods")
      .then(r => r.json())
      .then(setFoods)
      .catch(() => setFoods([]));
  }, []);

  useEffect(() => {
    if (location.state?.openAdd) {
      setAddForm(EMPTY_ADD);
      setAddStep(1);
      setShowAdd(true);
      navigate("/foods", { replace: true, state: {} });
    }
  }, [location.state]);

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.subCategory || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleView = (id) => {
    navigate(`/fooddetail/${id}`);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    fetch(`http://localhost:3001/foods/${id}`, { method: "DELETE" })
      .then(() => setFoods(prev => prev.filter(f => f.id !== id)))
      .catch(err => console.error("Delete error:", err));
  };

  const handleEdit = (food) => {
    setEditFood(food);
    setEditForm({ ...food });
  };

  const handleEditSave = () => {
    fetch(`http://localhost:3001/foods/${editForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then(r => r.json())
      .then(updated => {
        setFoods(prev => prev.map(f => f.id === updated.id ? updated : f));
        setEditFood(null);
      })
      .catch(err => console.error("Edit error:", err));
  };

  const handleDuplicate = (food) => {
    const { id, ...rest } = food;
    fetch("http://localhost:3001/foods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rest, name: `${food.name} (Copy)` }),
    })
      .then(r => r.json())
      .then(newFood => setFoods(prev => [...prev, newFood]))
      .catch(err => console.error("Duplicate error:", err));
  };

  const handleAddSave = () => {
    if (!addForm.name.trim()) return;
    const payload = {
      ...addForm,
      price: parseFloat(addForm.price) || 0,
      discount: parseFloat(addForm.discount) || 0,
      rating: parseFloat(addForm.rating) || 5.0,
    };
    fetch("http://localhost:3001/foods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(newFood => {
        setFoods(prev => [...prev, newFood]);
        setShowAdd(false);
        setAddForm(EMPTY_ADD);
        setAddStep(1);
      })
      .catch(err => console.error("Add error:", err));
  };

  const donutConfig = (value, color) => ({
    data: { datasets: [{ data:[value,100-value], backgroundColor:[color,"#F3F4F6"], borderWidth:0, cutout:"75%" }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{enabled:false} } }
  });

  return (
    <Layout>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Foods</h2>
          <p className="text-sm text-gray-400">Here is your menus summary with graph view</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
            <button onClick={()=>setView("list")} className={`px-3 py-2 ${view==="list"?"bg-teal-50 text-teal-600":"text-gray-400"}`}>
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
            <button onClick={()=>setView("grid")} className={`px-3 py-2 ${view==="grid"?"bg-teal-50 text-teal-600":"text-gray-400"}`}>
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <button onClick={() => { setAddForm(EMPTY_ADD); setAddStep(1); setShowAdd(true); }} className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
            <Plus className="w-4 h-4" strokeWidth={2} />
            New Menu
          </button>
        </div>
      </div>

      {/* Food Grid / List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-5">
        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search className="w-10 h-10 mb-3 opacity-40" strokeWidth={1.5} />
            <p className="text-sm font-medium">Hech narsa topilmadi</p>
            <p className="text-xs mt-1">"{searchQuery}" bo'yicha natija yo'q</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-5 gap-4">
            {paged.map(food => (
              <div key={food.id} className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition bg-white dark:bg-gray-700">
                <div className="relative">
                  <img src={food.img} alt={food.name} className="w-full h-32 object-cover"/>
                  {!food.available && (
                    <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Unavailable</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{food.name}</p>
                  <p className="text-xs text-teal-500 mt-0.5">{food.category} / {food.subCategory}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-600">
                    <button onClick={() => handleView(food.id)} className="text-gray-400 hover:text-teal-500 transition flex flex-col items-center gap-0.5">
                      <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="text-[9px]">View</span>
                    </button>
                    <button onClick={() => handleEdit(food)} className="text-gray-400 hover:text-blue-500 transition flex flex-col items-center gap-0.5">
                      <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="text-[9px]">Edit</span>
                    </button>
                    <button onClick={() => handleDelete(food.id)} className="text-gray-400 hover:text-red-500 transition flex flex-col items-center gap-0.5">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="text-[9px]">Delete</span>
                    </button>
                    <button onClick={() => handleDuplicate(food)} className="text-gray-400 hover:text-teal-500 transition flex flex-col items-center gap-0.5">
                      <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="text-[9px]">Duplicate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            <div className="grid grid-cols-12 gap-3 px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Sub Category</div>
              <div className="col-span-1 text-right">Price</div>
              <div className="col-span-1 text-center">Rating</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
            {paged.map(food => (
              <div key={food.id} className="grid grid-cols-12 gap-3 px-3 py-3 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition rounded-xl">
                <div className="col-span-4 flex items-center gap-3">
                  <img src={food.img} alt={food.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{food.name}</p>
                </div>
                <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">{food.category}</div>
                <div className="col-span-2 text-sm text-teal-500">{food.subCategory || "—"}</div>
                <div className="col-span-1 text-sm font-semibold text-gray-800 dark:text-gray-100 text-right">
                  {food.price ? `$${parseFloat(food.price).toFixed(2)}` : "—"}
                </div>
                <div className="col-span-1 text-xs text-gray-500 text-center">⭐ {food.rating}</div>
                <div className="col-span-1 text-center">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${food.available ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {food.available ? "Active" : "Off"}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-center gap-1.5">
                  <button onClick={() => handleView(food.id)} className="text-gray-400 hover:text-teal-500 transition" title="View">
                    <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                  <button onClick={() => handleEdit(food)} className="text-gray-400 hover:text-blue-500 transition" title="Edit">
                    <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                  <button onClick={() => handleDelete(food.id)} className="text-gray-400 hover:text-red-500 transition" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing {paged.length} from {filtered.length} Menu</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">&lsaquo;</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === currentPage ? "bg-teal-500 text-white" : "border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">&rsaquo;</button>
          </div>
        </div>
      </div>

      {/* Menu Comparison Doughnut Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Menu Comparison</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <label className="flex items-center gap-1.5"><input type="checkbox" className="w-3 h-3" defaultChecked/> Chart</label>
            <label className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-400 block"></span> Show Value</label>
          </div>
        </div>
        <div className="flex justify-around">
          {[
            { label:"Burger", value:75, color:"#3B82F6" },
            { label:"Pizza", value:32, color:"#F87171" },
            { label:"Soft Drink", value:67, color:"#FACC15" },
          ].map((item,i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <Doughnut {...donutConfig(item.value, item.color)} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{item.value}%</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-3">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* ── Add New Menu Modal ── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-[600px] max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yangi Taom Qo'shish</h3>
                <p className="text-xs text-gray-400 mt-0.5">Barcha kerakli ma'lumotlarni to'ldiring</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-700">
              {[{n:1,label:"Asosiy"},{n:2,label:"Tafsilot"},{n:3,label:"Qo'shimcha"}].map(s => (
                <button key={s.n} onClick={() => setAddStep(s.n)}
                  className={`flex-1 py-3 text-sm font-medium transition border-b-2 ${addStep === s.n ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
                  {s.n}. {s.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ── Step 1: Asosiy ma'lumot ── */}
              {addStep === 1 && (
                <div className="space-y-5">
                  {/* Image preview */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <ImagePlus className="w-4 h-4 text-teal-500" /> Rasm URL
                    </label>
                    <input value={addForm.img} onChange={e => setAddForm({...addForm, img: e.target.value})}
                      placeholder="https://example.com/food.jpg"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                    {addForm.img && (
                      <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        <img src={addForm.img} alt="preview" className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = "none"; }} />
                        <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/40 to-transparent">
                          <span className="text-white text-xs font-medium">Rasm ko'rinishi</span>
                        </div>
                      </div>
                    )}
                    {!addForm.img && (
                      <div className="mt-3 w-full h-36 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                        <ImagePlus className="w-8 h-8 mb-1" strokeWidth={1.5} />
                        <span className="text-xs">Rasm URL kiriting</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Tag className="w-4 h-4 text-teal-500" /> Taom nomi *
                    </label>
                    <input value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})}
                      placeholder="Masalan: Chicken Burger Special"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                  </div>

                  {/* Category + SubCategory */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Layers className="w-4 h-4 text-teal-500" /> Kategoriya
                      </label>
                      <select value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sub-kategoriya</label>
                      <input value={addForm.subCategory} onChange={e => setAddForm({...addForm, subCategory: e.target.value})}
                        placeholder="Masalan: Spicy, Vegan..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                    </div>
                  </div>

                  {/* Price + Discount */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <DollarSign className="w-4 h-4 text-teal-500" /> Narxi ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input type="number" min="0" step="0.01" value={addForm.price} onChange={e => setAddForm({...addForm, price: e.target.value})}
                          placeholder="0.00"
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chegirma (%)</label>
                      <div className="relative">
                        <input type="number" min="0" max="100" value={addForm.discount} onChange={e => setAddForm({...addForm, discount: e.target.value})}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                        {addForm.discount > 0 && addForm.price > 0 && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500 font-medium">
                            = ${(addForm.price * (1 - addForm.discount / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating + Available */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" /> Reyting (0-5)
                      </label>
                      <input type="number" min="0" max="5" step="0.1" value={addForm.rating} onChange={e => setAddForm({...addForm, rating: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => setAddForm({...addForm, available: !addForm.available})}
                          className={`relative w-11 h-6 rounded-full transition-colors ${addForm.available ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${addForm.available ? "translate-x-5" : "translate-x-0"}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {addForm.available ? "Mavjud" : "Mavjud emas"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Tafsilot ── */}
              {addStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <AlignLeft className="w-4 h-4 text-teal-500" /> Tavsif
                    </label>
                    <textarea value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} rows={4}
                      placeholder="Taom haqida qisqacha ma'lumot..."
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Leaf className="w-4 h-4 text-green-500" /> Ingredientlar
                    </label>
                    <textarea value={addForm.ingredients} onChange={e => setAddForm({...addForm, ingredients: e.target.value})} rows={4}
                      placeholder="Masalan: Chicken 200g, Rice 150g, Tomato sauce..."
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                    <p className="text-xs text-gray-400 mt-1">Vergul bilan ajrating</p>
                  </div>
                </div>
              )}

              {/* ── Step 3: Qo'shimcha ── */}
              {addStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FlaskConical className="w-4 h-4 text-blue-500" /> Nutritional ma'lumot
                    </label>
                    <textarea value={addForm.nutrition} onChange={e => setAddForm({...addForm, nutrition: e.target.value})} rows={3}
                      placeholder="Masalan: Calories: 450, Protein: 30g, Carbs: 45g, Fat: 12g"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                  </div>

                  {/* Preview card */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Ko'rinishi</p>
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-[180px]">
                      {addForm.img
                        ? <img src={addForm.img} alt="" className="w-full h-28 object-cover" onError={e => e.target.style.display="none"} />
                        : <div className="w-full h-28 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><ImagePlus className="w-6 h-6 text-gray-300" /></div>
                      }
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight">{addForm.name || "Taom nomi"}</p>
                        <p className="text-[10px] text-teal-500 mt-0.5">{addForm.category}{addForm.subCategory ? ` / ${addForm.subCategory}` : ""}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{addForm.price ? `$${parseFloat(addForm.price).toFixed(2)}` : "$0.00"}</span>
                          {addForm.discount > 0 && <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">-{addForm.discount}%</span>}
                        </div>
                        <div className={`mt-1.5 text-[10px] font-medium ${addForm.available ? "text-green-500" : "text-red-400"}`}>
                          ● {addForm.available ? "Mavjud" : "Mavjud emas"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex gap-3">
              {addStep > 1 && (
                <button onClick={() => setAddStep(s => s - 1)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  ← Orqaga
                </button>
              )}
              <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Bekor
              </button>
              {addStep < 3 ? (
                <button onClick={() => setAddStep(s => s + 1)} disabled={addStep === 1 && !addForm.name.trim()}
                  className="flex-1 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  Keyingisi →
                </button>
              ) : (
                <button onClick={handleAddSave} disabled={!addForm.name.trim()}
                  className="flex-1 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  ✓ Saqlash
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editFood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditFood(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[520px] max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Menu</h3>
              <button onClick={() => setEditFood(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input value={editForm.category || ""} onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sub Category</label>
                  <input value={editForm.subCategory || ""} onChange={e => setEditForm({...editForm, subCategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input value={editForm.img || ""} onChange={e => setEditForm({...editForm, img: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={editForm.description || ""} onChange={e => setEditForm({...editForm, description: e.target.value})} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients</label>
                <textarea value={editForm.ingredients || ""} onChange={e => setEditForm({...editForm, ingredients: e.target.value})} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nutrition</label>
                <textarea value={editForm.nutrition || ""} onChange={e => setEditForm({...editForm, nutrition: e.target.value})} rows={2}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-teal-400 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.available || false} onChange={e => setEditForm({...editForm, available: e.target.checked})}
                  className="w-4 h-4 accent-teal-500" />
                <label className="text-sm font-medium text-gray-700">Available</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditFood(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleEditSave} className="flex-1 py-2 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
