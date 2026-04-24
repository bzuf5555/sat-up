import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../Layout";
import { Bell, Pencil, Mail, Phone, Building2, MoreHorizontal, X } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const COLORS = ["#F87171","#34D399","#FACC15","#60A5FA","#A78BFA","#FB923C","#F472B6","#38BDF8"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function generateData(seed, len) {
  const arr = [];
  for (let i = 0; i < len; i++) arr.push(Math.floor(10 + ((seed * (i + 1) * 37) % 50)));
  return arr;
}

export default function CustomerDetail() {
  const { t } = useTranslation();
  const [d, setD] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orderedTab, setOrderedTab] = useState("Monthly");
  const [likedTab, setLikedTab] = useState("Monthly");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const openEdit = () => {
    setEditForm({ name: d.name, role: d.role, address: d.address, email: d.email, phone: d.phone, company: d.company });
    setEditOpen(true);
  };

  const saveEdit = () => {
    setD(prev => ({ ...prev, ...editForm, cardHolder: editForm.name }));
    setEditOpen(false);
  };

  useEffect(() => {
    fetch("http://localhost:3001/foods")
      .then(r => r.json())
      .then(setFoods)
      .catch(() => setFoods([]));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/customerDetail")
      .then(r => r.json())
      .then(setD)
      .catch(() => setD({
        name:"Eren Yeager",role:"UX Designer",
        avatar:"https://i.pravatar.cc/100?img=33",
        address:"36 Kings Road 1213, Garden Hills, Chelsea - London",
        email:"eren.yeager@mail.co.id",phone:"+012-345-6789",company:"Highspeed Studios",
        balance:9425,cardNumber:"2451 ****** ****",cardExpiry:"02/21",cardHolder:"Eren Yeager",
        mostOrderedFood:[
          { id:1,name:"Medium Spicy Spaghetti Italiano",category:"SPACETIN",options:"Serve for 2 Person • 2 plate",price:12.56,img:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=60&h=60&fit=crop" },
          { id:2,name:"Medium Spicy Spaghetti Italiano",category:"SPACETIN",options:"Serve for 2 Person • 2 plate",price:12.56,img:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=60&h=60&fit=crop" },
          { id:3,name:"Medium Spicy Spaghetti Italiano",category:"SPACETIN",options:"Serve for 2 Person • 2 plate",price:12.56,img:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=60&h=60&fit=crop" },
          { id:4,name:"Medium Spicy Spaghetti Italiano",category:"SPACETIN",options:"Serve for 2 Person • 2 plate",price:12.56,img:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=60&h=60&fit=crop" },
          { id:5,name:"Medium Spicy Spaghetti Italiano",category:"SPACETIN",options:"Serve for 2 Person • 2 plate",price:12.56,img:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=60&h=60&fit=crop" },
        ],
        mostLikedChart:{
          labels:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          spaghetti:[30,45,35,50,60,55,40],
          burger:[20,35,25,40,50,45,30],
          pizza:[15,25,20,30,40,35,25],
          sprite:[10,20,15,25,35,30,20],
        },
        likedStats:{ totalLikes:763,date:"19 Sept 2020",spaghetti:69,burger:763,pizza:321,sprite:154 }
      }));
  }, []);

  if (!d) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div></Layout>;

  // Build liked chart from foods subCategories
  const categories = [...new Set(foods.map(f => f.subCategory))];
  const likedLabels = likedTab === "Monthly" ? MONTHS : likedTab === "Weekly" ? DAYS : ["Morning","Afternoon","Evening","Night"];
  const multiplier = likedTab === "Monthly" ? 3 : likedTab === "Weekly" ? 1 : 2;

  const likedChartData = {
    labels: likedLabels,
    datasets: categories.map((cat, i) => ({
      label: cat,
      data: generateData((i + 1) * multiplier, likedLabels.length),
      backgroundColor: COLORS[i % COLORS.length],
      borderRadius: 4,
      barPercentage: 0.5,
    })),
  };

  const catLikes = categories.map((cat, i) => {
    const chartData = generateData((i + 1) * multiplier, likedLabels.length);
    const count = foods.filter(f => f.subCategory === cat).length;
    const total = foods.length || 1;
    const pct = Math.round((count / total) * 100);
    const value = chartData.reduce((a, b) => a + b, 0) * count;
    return { label: `${cat} (${pct}%)`, value };
  });
  const totalLikes = catLikes.reduce((a, b) => a + b.value, 0);
  const catStats = catLikes;

  const likedOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false} },
    scales:{
      x:{grid:{display:false},ticks:{font:{size:8},color:"#9CA3AF"}},
      y:{grid:{color:"#F3F4F6"},ticks:{font:{size:8},color:"#9CA3AF"}},
    },
  };

  return (
    <Layout>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("cd_title")}</h2>
        <p className="text-sm text-gray-400">{t("cd_subtitle")}</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Profile Card */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-5">
            <img src={d.avatar} alt={d.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-gray-100"/>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{d.name}</h3>
                  <p className="text-sm text-teal-500 font-medium">{d.role}</p>
                  <p className="text-xs text-gray-400 mt-1">{d.address}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                    <Bell className="w-4 h-4" strokeWidth={1.8} />
                  </button>
                  <button onClick={openEdit} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                    <Pencil className="w-4 h-4" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-500 flex-shrink-0" strokeWidth={1.8} />
                  <span className="text-xs text-gray-600">{d.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-500 flex-shrink-0" strokeWidth={1.8} />
                  <span className="text-xs text-gray-600">{d.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-500 flex-shrink-0" strokeWidth={1.8} />
                  <span className="text-xs text-gray-600">{d.company}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-teal-500 rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs opacity-70">Your Balance</p>
              <p className="text-3xl font-bold mt-1">$ {d.balance.toLocaleString()}</p>
            </div>
            <button className="text-white opacity-70 hover:opacity-100">
              <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          <p className="text-sm opacity-80 font-mono">{d.cardNumber}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-70">{d.cardExpiry}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-teal-400">
            <div>
              <p className="text-xs opacity-70">Name</p>
              <p className="text-sm font-semibold">{d.cardHolder}</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-yellow-300 opacity-80"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500 -ml-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Most Ordered Food */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{t("cd_mostOrdered")}</h3>
              <p className="text-xs text-gray-400">Lorem posumet et amet consectetur</p>
            </div>
            <div className="flex gap-1">
              {["Monthly","Weekly","Daily"].map((t)=>(
                <button key={t} onClick={() => setOrderedTab(t)} className={`text-xs px-2.5 py-1 rounded-lg ${orderedTab===t?"bg-teal-500 text-white":"text-gray-500 hover:bg-gray-100"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {(orderedTab === "Monthly" ? foods : orderedTab === "Weekly" ? foods.slice(0, 5) : foods.slice(0, 3)).map(food => (
              <div key={food.id} className="flex items-center gap-3">
                <img src={food.img} alt={food.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{food.name}</p>
                  <p className="text-xs text-teal-500">{food.subCategory}</p>
                  <p className="text-xs text-gray-400">Serve for 2 Person • 2 plate</p>
                </div>
                <p className="text-sm font-bold text-gray-800">$12.56</p>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Most Liked Food Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{t("cd_mostLiked")}</h3>
              <p className="text-xs text-gray-400">Lorem posumet et amet consectetur</p>
            </div>
            <div className="flex gap-1">
              {["Monthly","Weekly","Daily"].map((t)=>(
                <button key={t} onClick={() => setLikedTab(t)} className={`text-xs px-2.5 py-1 rounded-lg ${likedTab===t?"bg-teal-500 text-white":"text-gray-500 hover:bg-gray-100"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-2xl font-bold text-gray-900">{totalLikes} Likes</p>
            <p className="text-xs text-gray-400">19 Sept 2020</p>
          </div>
          <div className="h-36">
            <Bar data={likedChartData} options={likedOpts}/>
          </div>
          <div className={`grid gap-2 mt-3`} style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 4)}, 1fr)` }}>
            {catStats.map((item,i)=>(
              <div key={i} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <div>
                  <p className="text-xs text-gray-500 leading-tight">{item.label}</p>
                  <p className="text-sm font-bold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {editOpen && editForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("cd_editTitle")}</h3>
              <button onClick={() => setEditOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: t("cd_name"),    key: "name" },
                { label: t("cd_role"),    key: "role" },
                { label: t("cd_address"), key: "address" },
                { label: t("cd_email"),   key: "email" },
                { label: t("cd_phone"),   key: "phone" },
                { label: t("cd_company"), key: "company" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                  <input
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={editForm[key]}
                    onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditOpen(false)} className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t("cancel")}</button>
              <button onClick={saveEdit} className="flex-1 bg-teal-500 text-white rounded-xl py-2 text-sm font-semibold hover:bg-teal-600">{t("save")}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
