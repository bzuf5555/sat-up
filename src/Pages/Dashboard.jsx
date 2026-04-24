import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import Layout, { StarRating } from "../Layout";
import {
  ShoppingBag,
  Package,
  XCircle,
  DollarSign,
  CalendarDays,
  ChevronDown,
  Download,
  Star,
  MoreVertical,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orderedTab, setOrderedTab] = useState("Monthly");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = currentUser.name || currentUser.displayName || "User";

  useEffect(() => {
    fetch("http://localhost:3001/foods")
      .then(r => r.json())
      .then(setFoods)
      .catch(() => setFoods([]));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {
        setData({
          stats: { totalOrders: 75, totalDelivered: 357, totalCanceled: 65, totalRevenue: 128 },
          pieCharts: { totalOrder: 81, customerGrowth: 22, totalRevenue: 62 },
          chartOrder: {
            labels: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            data: [120,210,180,310,260,456,390],
          },
          totalRevenue: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
            dataset2024: [15000,22000,18000,28000,32000,38000,35000,30000,25000,28000,32000,40000],
            dataset2021: [10000,14000,12000,18000,22000,30000,28000,20000,18000,22000,21981,30000],
          },
          customerMap: {
            labels: ["Sun","Sun","Sun","Sun","Sun","Sun","Sun"],
            series1: [55,70,45,60,80,75,65],
            series2: [40,55,35,50,65,60,50],
          },
          reviews: [
            { id:1, name:"Jons Sena", avatar:"https://i.pravatar.cc/40?img=1", time:"2 days ago", text:"Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.", rating:4.5, food:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop" },
            { id:2, name:"Sofia", avatar:"https://i.pravatar.cc/40?img=5", time:"2 days ago", text:"Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.", rating:4.0, food:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop" },
            { id:3, name:"Anandreansyah", avatar:"https://i.pravatar.cc/40?img=8", time:"2 days ago", text:"Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text.", rating:4.5, food:"https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=120&h=120&fit=crop" },
          ],
        });
      });
  }, []);

  if (!data) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
      </div>
    </Layout>
  );

  // ── Chart configs ──
  const makeDoughnut = (value, color) => ({
    data: {
      datasets: [{
        data: [value, 100 - value],
        backgroundColor: [color, "#F3F4F6"],
        borderWidth: 0,
        cutout: "75%",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });

  const doughnutConfigs = [
    { ...makeDoughnut(data.pieCharts.totalOrder, "#EF4444"), label: "Total Order", value: data.pieCharts.totalOrder },
    { ...makeDoughnut(data.pieCharts.customerGrowth, "#22C55E"), label: "Customer Growth", value: data.pieCharts.customerGrowth },
    { ...makeDoughnut(data.pieCharts.totalRevenue, "#3B82F6"), label: "Total Revenue", value: data.pieCharts.totalRevenue },
  ];

  const chartOrderData = {
    labels: data.chartOrder.labels,
    datasets: [{
      data: data.chartOrder.data,
      borderColor: "#38BDF8",
      backgroundColor: "rgba(56,189,248,0.15)",
      fill: true, tension: 0.45,
      pointBackgroundColor: "#38BDF8",
      pointRadius: (ctx) => ctx.dataIndex === 5 ? 6 : 3,
      pointHoverRadius: 6, borderWidth: 2,
    }],
  };

  const chartOrderOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      callbacks: { label: (c) => ` ${c.raw} Order` },
      backgroundColor: "#fff", titleColor: "#1F2937", bodyColor: "#1F2937",
      borderColor: "#E5E7EB", borderWidth: 1,
    }},
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#9CA3AF" }},
      y: { display: false, grid: { display: false }},
    },
  };

  const totalRevenueData = {
    labels: data.totalRevenue.labels,
    datasets: [
      { label: "2024", data: data.totalRevenue.dataset2024, borderColor: "#3B82F6", backgroundColor: "rgba(59,130,246,0.08)", fill: false, tension: 0.45, pointRadius: 3, borderWidth: 2 },
      { label: "2021", data: data.totalRevenue.dataset2021, borderColor: "#EF4444", backgroundColor: "rgba(239,68,68,0.08)", fill: false, tension: 0.45, pointRadius: 3, borderWidth: 2 },
    ],
  };

  const totalRevenueOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` $${(c.raw/1000).toFixed(0)}k` } } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#9CA3AF" }},
      y: { ticks: { font: { size: 10 }, color: "#9CA3AF", callback: (v) => `$${v/1000}k` }, grid: { color: "#F3F4F6" } },
    },
  };

  const customerMapData = {
    labels: data.customerMap.labels,
    datasets: [
      { label: "Series 1", data: data.customerMap.series1, backgroundColor: "#FACC15", borderRadius: 4, barPercentage: 0.4, categoryPercentage: 0.6 },
      { label: "Series 2", data: data.customerMap.series2, backgroundColor: "#F87171", borderRadius: 4, barPercentage: 0.4, categoryPercentage: 0.6 },
    ],
  };

  const customerMapOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, color: "#9CA3AF" }},
      y: { ticks: { font: { size: 9 }, color: "#9CA3AF" }, grid: { color: "#F3F4F6" }, max: 100 },
    },
  };

  const statCards = [
    { label: "Total Orders", value: data.stats.totalOrders, change: "+1.01 (day)", positive: true, color: "bg-orange-100", iconColor: "text-orange-500", Icon: ShoppingBag },
    { label: "Total Delivered", value: data.stats.totalDelivered, change: "+4.2 (60 days)", positive: true, color: "bg-teal-100", iconColor: "text-teal-500", Icon: Package },
    { label: "Total Canceled", value: data.stats.totalCanceled, change: "-03.1 (60 days)", positive: false, color: "bg-red-100", iconColor: "text-red-500", Icon: XCircle },
    { label: "Total Revenue", value: `$${data.stats.totalRevenue}`, change: "+8.01 (60 days)", positive: true, color: "bg-green-100", iconColor: "text-green-500", Icon: DollarSign },
  ];

  return (
    <Layout>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            <p className="text-sm text-gray-400">Hi, {userName}. Welcome back to Sedap Admin!</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
            <CalendarDays className="w-4 h-4 text-teal-500" strokeWidth={2} />
            <span>Filter Periode</span>
            <span className="text-xs text-gray-400">17 April 2025 - 31 May 2025</span>
            <ChevronDown className="w-3 h-3 text-gray-400" strokeWidth={2} />
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className={`${card.color} rounded-xl p-3 flex-shrink-0`}>
                <card.Icon className={`w-8 h-8 ${card.iconColor}`} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                <p className="text-xs text-gray-400">{card.label}</p>
                <p className={`text-xs font-medium mt-0.5 ${card.positive ? "text-green-500" : "text-red-500"}`}>
                  {card.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Charts + Chart Order */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Pie Chart</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="w-3 h-3 rounded" defaultChecked/>
                  Chart
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="w-3 h-3 rounded bg-red-400 block"></span>
                  Show Value
                </label>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="flex justify-around">
              {doughnutConfigs.map((dc, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="relative w-24 h-24">
                    <Doughnut data={dc.data} options={dc.options} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{dc.value}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{dc.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Chart Order</h3>
              <button className="flex items-center gap-1.5 text-xs text-teal-600 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition">
                <Download className="w-3 h-3" strokeWidth={2} />
                Save Report
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="h-36">
              <Line data={chartOrderData} options={chartOrderOptions} />
            </div>
          </div>
        </div>

        {/* Total Revenue + Customer Map */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Total Revenue</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1.5 rounded bg-blue-500 inline-block"></span> 2024
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1.5 rounded bg-red-400 inline-block"></span> 2021
                </span>
              </div>
            </div>
            <div className="h-48">
              <Line data={totalRevenueData} options={totalRevenueOptions} />
            </div>
          </div>

          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Customer Map</h3>
              <div className="flex items-center gap-2">
                <select className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 outline-none">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="h-48">
              <Bar data={customerMapData} options={customerMapOptions} />
            </div>
          </div>
        </div>

        {/* Most Ordered Food */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Most Ordered Food</h3>
              <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet, consectetur</p>
            </div>
            <div className="flex gap-1">
              {["Monthly", "Weekly", "Daily"].map((t) => (
                <button key={t} onClick={() => setOrderedTab(t)} className={`text-xs px-3 py-1 rounded-lg ${orderedTab === t ? "bg-teal-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {(orderedTab === "Monthly" ? foods : orderedTab === "Weekly" ? foods.slice(0, 5) : foods.slice(0, 3)).map(food => (
              <div key={food.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-3">
                  <img src={food.img} alt={food.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{food.name}</p>
                    <p className="text-xs text-gray-400">{food.subCategory}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">$12.56</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Customer Review</h3>
              <p className="text-xs text-gray-400">Eum fuga consequuntur uladzips et.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">&lsaquo;</button>
              <button className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">&rsaquo;</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {data.reviews.map((rev) => (
              <div key={rev.id} className="flex gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={rev.avatar} alt={rev.name} className="w-8 h-8 rounded-full object-cover"/>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{rev.name}</p>
                      <p className="text-xs text-gray-400">{rev.time}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{rev.text}</p>
                  <StarRating rating={rev.rating} />
                </div>
                <img src={rev.food} alt="food" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
