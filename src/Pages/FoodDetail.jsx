import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import { Search, Plus, Star, Check, X } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function FoodDetail() {
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3001/foods/${id}`)
      .then(r => r.json())
      .then(food => {
        setD({
          ...food,
          category: `${food.category} / ${food.subCategory}`,
          stock: "5 Stock Available",
          description: food.description || "No description available.",
          ingredients: food.ingredients || "No ingredients listed.",
          nutrition: food.nutrition || "No nutrition info available.",
          revenueChart: { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept"], data: [40000,60000,50000,80000,70000,87256,75000,68000,72000] },
          reviews: [
            { id:1, name:"Johnny Ahmad", avatar:"https://i.pravatar.cc/40?img=60", time:"1 hour ago", rating:4, text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor." },
            { id:2, name:"Mario Vania", avatar:"https://i.pravatar.cc/40?img=50", time:"1 hour ago", rating:3, text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor." },
            { id:3, name:"Sarah Muellerz", avatar:"https://i.pravatar.cc/40?img=44", time:"1 hour ago", rating:5, text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor." },
          ]
        });
      })
      .catch(() => setD({
        id:2,name:"Burger Jumbo Special with Spicy",category:"Food / Burger",stock:"5 Stock Available",
        img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240&h=200&fit=crop",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        ingredients:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        nutrition:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
        revenueChart:{ labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept"],data:[40000,60000,50000,80000,70000,87256,75000,68000,72000] },
        reviews:[
          { id:1,name:"Johnny Ahmad",avatar:"https://i.pravatar.cc/40?img=60",time:"1 hour ago",rating:4,text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor." },
          { id:2,name:"Mario Vania",avatar:"https://i.pravatar.cc/40?img=50",time:"1 hour ago",rating:3,text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor." },
          { id:3,name:"Sarah Muellerz",avatar:"https://i.pravatar.cc/40?img=44",time:"1 hour ago",rating:5,text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor." },
        ]
      }));
  }, [id]);

  const startEdit = () => {
    setForm({ name: d.name, description: d.description, ingredients: d.ingredients, nutrition: d.nutrition, img: d.img });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = () => {
    const [cat, sub] = d.category.split(" / ");
    const updated = { id: d.id, name: form.name, category: cat, subCategory: sub, img: form.img, available: d.available ?? true, description: form.description, ingredients: form.ingredients, nutrition: form.nutrition };
    fetch(`http://localhost:3001/foods/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then(r => r.json())
      .then(saved => {
        setD(prev => ({ ...prev, name: saved.name, description: saved.description, ingredients: saved.ingredients, nutrition: saved.nutrition, img: saved.img }));
        setEditing(false);
      })
      .catch(err => console.error("Save error:", err));
  };

  if (!d) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div></Layout>;

  const revenueData = {
    labels: d.revenueChart.labels,
    datasets: [{
      data: d.revenueChart.data,
      borderColor: "#0ea5e9",
      backgroundColor: "rgba(14,165,233,0.1)",
      fill: true, tension: 0.45, pointRadius: 3, borderWidth: 2,
    }],
  };

  const revenueOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      callbacks: { label: c => ` $${(c.raw/1000).toFixed(0)}k` },
    }},
    scales: {
      x: { grid:{display:false}, ticks:{font:{size:9},color:"#9CA3AF"} },
      y: { grid:{color:"#F3F4F6"}, ticks:{font:{size:9},color:"#9CA3AF",callback:v=>`${v/1000}k`} },
    },
  };

  return (
    <Layout>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Foods</h2>
          <p className="text-sm text-gray-400">Here is your menus summary with graph view</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
            <input type="text" placeholder="Search here" className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-300 bg-white"/>
          </div>
          <button className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
            <Plus className="w-4 h-4" strokeWidth={2} />
            New Menu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5 mb-5">
        {/* Detail Menus */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Detail Menus</h3>
            <span className="text-xs text-gray-400">Category: <span className="text-teal-500">{d.category}</span></span>
          </div>
          {editing ? (
            <>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                  <input value={form.img} onChange={e => setForm({...form, img: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ingredients</label>
                  <textarea value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} rows={2}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nutrition Info</label>
                  <textarea value={form.nutrition} onChange={e => setForm({...form, nutrition: e.target.value})} rows={2}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400 resize-none" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} className="flex items-center gap-1.5 bg-teal-500 text-white px-4 py-1.5 rounded-xl text-xs font-medium hover:bg-teal-600">
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  Save
                </button>
                <button onClick={cancelEdit} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-1.5 rounded-xl text-xs font-medium hover:bg-gray-50">
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <img src={d.img} alt={d.name} className="w-32 h-28 rounded-xl object-cover flex-shrink-0"/>
                <div>
                  <span className="text-xs text-green-500 font-medium">&#10022; {d.stock}</span>
                  <h4 className="text-base font-bold text-gray-900 mt-1">{d.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">{d.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex items-center gap-1.5 bg-teal-500 text-white px-4 py-1.5 rounded-xl text-xs font-medium hover:bg-teal-600">
                      <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                      Add Menu
                    </button>
                    <button onClick={startEdit} className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded-xl text-xs font-medium hover:bg-gray-50">Edit Menu</button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-50 pt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">Ingredients</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{d.ingredients}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">Nutrition Info</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{d.nutrition}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800">Revenue</h3>
              <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <div className="flex gap-1">
              {["Monthly","Weekly","Daily"].map((t,i)=>(
                <button key={i} className={`text-xs px-3 py-1 rounded-lg ${i===0?"bg-teal-500 text-white":"text-gray-500 hover:bg-gray-100"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <Line data={revenueData} options={revenueOpts}/>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Customer Reviews</h3>
        <div className="grid grid-cols-3 gap-5">
          {d.reviews.map(rev => (
            <div key={rev.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <img src={rev.avatar} alt={rev.name} className="w-9 h-9 rounded-full object-cover"/>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{rev.name}</p>
                  <p className="text-xs text-gray-400">{rev.time}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">{rev.text}</p>
              <div className="flex">
                {[1,2,3,4,5].map(s=>(
                  <Star key={s} className={`w-4 h-4 ${s<=rev.rating?"text-yellow-400 fill-yellow-400":"text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
