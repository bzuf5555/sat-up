import { useState, useEffect } from "react";
import Layout, { StarRating } from "../Layout";
import { Check, ChevronDown, XCircle, MapPin } from "lucide-react";

export default function OrderDetail() {
  const [d, setD] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/orderDetail")
      .then(r => r.json())
      .then(setD)
      .catch(() => setD({
        id:"#5552351", status:"On Delivery",
        customer:{ name:"Wahyu Adi Kurniawan", avatar:"https://i.pravatar.cc/80?img=12", role:"Customer", note:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", address:"6 The Avenue, London EC50 4GN" },
        items:[
          { id:1,name:"Watermelon juice with ice",category:"MAIN COURSE",img:"https://images.unsplash.com/photo-1546173159-315724a31696?w=60&h=60&fit=crop",rating:4,reviews:454,qty:5,price:10.8,total:50.8 },
          { id:2,name:"Watermelon juice with ice",category:"MAIN COURSE",img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop",rating:4,reviews:454,qty:4,price:5.79,total:20.8 },
          { id:3,name:"Italiano pizza with garlic",category:"MAIN COURSE",img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=60&h=60&fit=crop",rating:4,reviews:454,qty:3,price:16.40,total:48.4 },
        ],
        history:[
          { label:"Order Delivered",time:null,active:false },
          { label:"On Delivery",time:"Sat, 25 Jul 2020, 01:24 PM",active:true },
          { label:"Payment Success",time:"Fri, 22 Jul 2020, 10:44 AM",active:true },
          { label:"Order Created",time:"Thu, 21 Jul 2020, 11:49 AM",active:true },
        ],
        delivery:{ name:"Kevin Hobs Jr.",id:"ID - 42468",avatar:"https://i.pravatar.cc/50?img=15",phone:"+12 345 5662 66",time:"12:52" }
      }));
  }, []);

  if (!d) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div></Layout>;

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order ID {d.id}</h2>
          <p className="text-sm text-teal-500">Orders / <span className="text-gray-400">Order Details</span></p>
        </div>
        <div className="flex gap-3">
          <button className="border border-red-400 text-red-500 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition">Cancel Order</button>
          <button className="bg-teal-500 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-teal-600 transition">
            <Check className="w-4 h-4" strokeWidth={2} />
            On Delivery
            <ChevronDown className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-4">
          {/* Customer card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center">
            <img src={d.customer.avatar} alt={d.customer.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-teal-100 dark:ring-teal-900"/>
            <h3 className="font-bold text-gray-900 dark:text-white">{d.customer.name}</h3>
            <span className="text-xs bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-medium">{d.customer.role}</span>
          </div>

          {/* Note Order */}
          <div className="bg-blue-700 rounded-2xl p-5 text-white">
            <h4 className="font-semibold mb-2">Note Order</h4>
            <p className="text-xs leading-relaxed opacity-90">{d.customer.note}</p>
            <div className="mt-4 flex items-center gap-2 bg-blue-800 rounded-xl p-3">
              <MapPin className="w-5 h-5 opacity-70" strokeWidth={1.8} />
              <span className="text-xs">{d.customer.address}</span>
            </div>
          </div>

          {/* History */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">History</h4>
            <div className="space-y-3">
              {d.history.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${h.active ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-600"}`}></div>
                  <div>
                    <p className={`text-sm font-medium ${h.active ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>{h.label}</p>
                    {h.time && <p className="text-xs text-gray-400">{h.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (2 cols) */}
        <div className="col-span-2 space-y-4">
          {/* Items table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-4 bg-teal-500 text-white text-sm font-semibold px-5 py-3">
              <div className="col-span-2">Items</div>
              <div className="text-center">Qty</div>
              <div className="text-center">Price</div>
            </div>
            {d.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <img src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0"/>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase">{item.category}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
                  <StarRating rating={item.rating} />
                  <p className="text-xs text-gray-400">{item.reviews}k reviews</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 w-12 text-center">{item.qty}x</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 w-16 text-center">${item.price}</div>
                <div className="text-sm font-bold text-gray-800 dark:text-gray-100 w-16 text-center">${item.total}</div>
                <button className="text-red-400 hover:text-red-600">
                  <XCircle className="w-5 h-5" strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="relative bg-gray-100 dark:bg-gray-700 h-44 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 180">
                <rect width="500" height="180" className="fill-gray-100 dark:fill-gray-700" fill="#f3f4f6"/>
                {[0,1,2,3,4,5,6,7,8,9].map(i=>(
                  <line key={i} x1={i*60} y1="0" x2={i*60} y2="180" stroke="#d1d5db" strokeWidth="1"/>
                ))}
                {[0,1,2,3].map(i=>(
                  <line key={i} x1="0" y1={i*50} x2="500" y2={i*50} stroke="#d1d5db" strokeWidth="1"/>
                ))}
                <polyline points="60,140 180,60 250,100 380,40 440,100" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="250" cy="100" r="12" fill="#ef4444"/>
                <circle cx="440" cy="100" r="8" fill="#ef4444"/>
                <rect x="200" y="68" width="90" height="24" rx="8" fill="white" filter="url(#shadow)"/>
                <text x="210" y="84" fontSize="10" fill="#374151">4-8 mins</text>
              </svg>
              <div className="absolute top-3 right-4 text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Track Orders</p>
                <p className="text-xs text-gray-400">Lorem ipsum dolor sit</p>
              </div>
            </div>
          </div>

          {/* Delivery by */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Delivery by</h4>
            <div className="flex items-center gap-4">
              <img src={d.delivery.avatar} alt={d.delivery.name} className="w-12 h-12 rounded-full object-cover"/>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{d.delivery.name}</p>
                <p className="text-xs text-gray-400">{d.delivery.id}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2.5 text-center border border-gray-100 dark:border-gray-600">
                <p className="text-xs text-gray-400">Telepon</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{d.delivery.phone}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2.5 text-center border border-gray-100 dark:border-gray-600">
                <p className="text-xs text-gray-400">Delivery Time</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{d.delivery.time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
