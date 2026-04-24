import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout, { StarRating } from "../Layout";
import { CalendarDays, ChevronDown, Star, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAILY = ["6AM","9AM","12PM","3PM","6PM","9PM"];

function genChartData(seed, labels) {
  return labels.map((_, i) => Math.floor(20000 + ((seed * (i + 1) * 47 + i * 13) % 60000)));
}

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [foods, setFoods] = useState([]);
  const [chartTab, setChartTab] = useState("Monthly");
  const [sellingTab, setSellingTab] = useState("Weekly");
  const [revenueTab, setRevenueTab] = useState("Monthly");
  const [favTab, setFavTab] = useState("Weekly");

  useEffect(() => {
    fetch("http://localhost:3001/foods")
      .then(r => r.json())
      .then(setFoods)
      .catch(() => setFoods([]));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/analytics")
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({
        chartOrders:{ totalOrders:257, avgPerDay:1245 },
        revenue:{ labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept"], data:[400000,600000,500000,800000,700000,872556,750000,680000,720000] },
      }));
  }, []);

  if (!data) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div></Layout>;

  // Chart Orders — dynamic by tab
  const chartLabels = chartTab === "Monthly" ? MONTHS : chartTab === "Weekly" ? WEEKS : DAILY;
  const chartSeed = chartTab === "Monthly" ? 3 : chartTab === "Weekly" ? 7 : 11;
  const ordersChartData = {
    labels: chartLabels,
    datasets: [{
      data: genChartData(chartSeed, chartLabels),
      borderColor: "#0ea5e9",
      backgroundColor: "rgba(14,165,233,0.1)",
      fill: true, tension: 0.45,
      pointBackgroundColor: "#0ea5e9",
      pointRadius: 3, borderWidth: 2,
    }],
  };

  // Revenue — dynamic by tab
  const revLabels = revenueTab === "Monthly" ? MONTHS : revenueTab === "Weekly" ? WEEKS : DAILY;
  const revSeed = revenueTab === "Monthly" ? 5 : revenueTab === "Weekly" ? 9 : 13;
  const revenueChartData = {
    labels: revLabels,
    datasets: [{
      data: genChartData(revSeed, revLabels).map(v => v * 10),
      borderColor: "#0ea5e9",
      backgroundColor: "rgba(14,165,233,0.1)",
      fill: true, tension: 0.45,
      pointRadius: 3, borderWidth: 2,
    }],
  };

  const chartOpts = (yFmt) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, color: "#9CA3AF" } },
      y: { grid: { color: "#F3F4F6" }, ticks: { font: { size: 9 }, color: "#9CA3AF", callback: yFmt } },
    },
  });

  // Most Selling — from foods
  const sellingFoods = sellingTab === "Monthly" ? foods : sellingTab === "Weekly" ? foods.slice(0, 5) : foods.slice(0, 3);

  // Trending — from foods
  const trendingFoods = foods.slice(0, 5).map((f, i) => ({
    ...f,
    rank: i + 1,
    orders: Math.floor(500 - i * 90),
    trend: i % 3 === 1 ? "down" : "up",
  }));

  // Favourites — from foods
  const favFoods = favTab === "Monthly" ? foods : favTab === "Weekly" ? foods.slice(0, 6) : foods.slice(0, 4);

  const TabButtons = ({ tabs, active, onChange }) => (
    <div className="flex gap-1">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} className={`text-xs px-3 py-1 rounded-lg ${active === t ? "bg-teal-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>{t}</button>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h2>
          <p className="text-sm text-gray-400">Here is your restaurant summary with graph view</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          <CalendarDays className="w-4 h-4 text-teal-500" strokeWidth={2} />
          Filter Periode
          <ChevronDown className="w-3 h-3 text-gray-400" strokeWidth={2} />
        </button>
      </div>

      {/* Row 1: Chart Orders + Most Selling */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Chart Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Chart Orders</h3>
              <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <TabButtons tabs={["Monthly","Weekly","Daily"]} active={chartTab} onChange={setChartTab} />
          </div>
          <div className="flex items-center gap-6 mb-3">
            <div>
              <p className="text-xs text-gray-400">TotalOrders</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{data.chartOrders.totalOrders}k</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg. Per day</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{data.chartOrders.avgPerDay.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-40">
            <Line data={ordersChartData} options={chartOpts(v => `${v/1000}k`)}/>
          </div>
        </div>

        {/* Most Selling */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Most Selling Items</h3>
            <TabButtons tabs={["Monthly","Weekly","Daily"]} active={sellingTab} onChange={setSellingTab} />
          </div>
          <div className="space-y-3">
            {sellingFoods.map(food => (
              <div key={food.id} className="flex items-center gap-3">
                <img src={food.img} alt={food.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{food.name}</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s=>(
                      <Star key={s} className={`w-3 h-3 ${s<=4?"text-yellow-400 fill-yellow-400":"text-gray-200 fill-gray-200"}`} />
                    ))}
                    <span className="text-xs text-gray-400">{food.subCategory}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">$12.56</p>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => navigate(`/fooddetail/${foods[0]?.id || 1}`)} className="mt-3 text-xs text-teal-500 hover:underline flex items-center gap-1">
            View more <ChevronDown className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Row 2: Trending + Revenue */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Trending */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Trending Items</h3>
            <div className="flex items-center gap-2">
              <select className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 outline-none">
                <option>Weekly</option><option>Monthly</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {trendingFoods.map(item => (
              <div key={item.rank} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-4">#{item.rank}</span>
                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.subCategory} • <span className="text-teal-500">{item.category}</span></p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.orders}</p>
                  {item.trend === "up"
                    ? <TrendingUp className="w-4 h-4 text-green-500" strokeWidth={2} />
                    : <TrendingDown className="w-4 h-4 text-red-500" strokeWidth={2} />
                  }
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate(`/fooddetail/${foods[0]?.id || 1}`)} className="mt-3 text-xs text-teal-500 hover:underline flex items-center gap-1">
            View more <ChevronDown className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Revenue</h3>
              <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <TabButtons tabs={["Monthly","Weekly","Daily"]} active={revenueTab} onChange={setRevenueTab} />
          </div>
          <div className="h-48">
            <Line data={revenueChartData} options={chartOpts(v => `${(v/1000).toFixed(0)}k`)}/>
          </div>
        </div>
      </div>

      {/* Row 3: Most Favourite */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Most Favourite Items</h3>
          <TabButtons tabs={["Monthly","Weekly","Daily"]} active={favTab} onChange={setFavTab} />
        </div>
        <div className="grid grid-cols-6 gap-4">
          {favFoods.map(f => (
            <div key={f.id} className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition" onClick={() => navigate(`/fooddetail/${f.id}`)}>
              <img src={f.img} alt={f.name} className="w-full h-28 object-cover"/>
              <div className="p-2 dark:bg-gray-800">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight">{f.name}</p>
                <p className="text-xs text-gray-400">{f.category} / {f.subCategory}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map(s=>(
                    <Star key={s} className={`w-3 h-3 ${s<=4?"text-yellow-400 fill-yellow-400":"text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400">201k (3km)</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => navigate(`/fooddetail/${foods[0]?.id || 1}`)} className="mt-3 text-xs text-teal-500 hover:underline flex items-center gap-1 ml-auto">
          View more <ChevronDown className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>
    </Layout>
  );
}
