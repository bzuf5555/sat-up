import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../Layout";
import { CalendarDays, ChevronDown, Star, ArrowDown } from "lucide-react";

const tagColors = {
  "Food Service": "bg-teal-50 text-teal-600",
  "Good Place": "bg-blue-50 text-blue-600",
  "Exellent": "bg-green-50 text-green-600",
  "Good Service": "bg-teal-50 text-teal-600",
  "Delicious": "bg-orange-50 text-orange-500",
};

export default function Reviews() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    fetch("http://localhost:3001/reviews")
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({
        featured:[
          { id:1,foodName:"Chicken Curry Special with Cucumber",foodCategory:"Main Course",reviewer:"Roberto Jr.",reviewerRole:"Graphic Design",rating:4.5,text:"Lorem ipsum is simply dummy text of the printing and typesetting industry.",img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=240&h=160&fit=crop" },
          { id:2,foodName:"Spaghetti Special with Cucumber",foodCategory:"Main Course",reviewer:"Lord Neil Stark",reviewerRole:"Programmer",rating:4.5,text:"Fast, professional and friendly service. It is as spectacular!",img:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=240&h=160&fit=crop" },
          { id:3,foodName:"Pizza Mozzarella with Spicy Cream",foodCategory:"Main Course",reviewer:"Fredy Plenary",reviewerRole:"Programmer",rating:4.5,text:"Fast, professional and friendly service. It is as spectacular!",img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=240&h=160&fit=crop" },
        ],
        others:[
          { id:1,name:"James Kowalski",avatar:"https://i.pravatar.cc/40?img=11",role:"Head Planning",date:"Sabtu, 13 June 2020",tags:["Food Service","Good Place","Exellent"],rating:3.5,text:"We recently had dinner with friends at David CC and we all walked away with a great experience. Good food, pleasant environment." },
          { id:2,name:"Jonathan Fringsmen",avatar:"https://i.pravatar.cc/40?img=13",role:"Head Planning",date:"Sabtu, 13 June 2020",tags:["Good Service","Exellent"],rating:3.5,text:"We recently had dinner with friends at David CC and we all walked away with a great experience. Good food, pleasant environment." },
          { id:3,name:"Trianta Luoa",avatar:"https://i.pravatar.cc/40?img=15",role:"Head Planning",date:"Sabtu, 13 June 2020",tags:["Delicious","Food Service"],rating:3.5,text:"We recently had dinner with friends at David CC and we all walked away with a great experience. Good food, pleasant environment." },
          { id:4,name:"Vernlyn Chong",avatar:"https://i.pravatar.cc/40?img=20",role:"Head Planning",date:"Sabtu, 13 June 2020",tags:["Good Service"],rating:3.5,text:"We recently had dinner with friends at David CC and we all walked away with a great experience. Good food, pleasant environment." },
          { id:5,name:"Sofia Pustova",avatar:"https://i.pravatar.cc/40?img=23",role:"Head Planning",date:"Sabtu, 13 June 2020",tags:["Exellent","Delicious"],rating:3.5,text:"We recently had dinner with friends at David CC and we all walked away with a great experience. Good food, pleasant environment." },
        ]
      }));
  }, []);

  if (!data) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div></Layout>;

  return (
    <Layout>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("rev_title")}</h2>
          <p className="text-sm text-teal-500">Dashboard / <span className="text-gray-400">{t("rev_subtitle")}</span></p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          <CalendarDays className="w-4 h-4 text-teal-500" strokeWidth={2} />
          {t("rev_filterPeriode")}
          <ChevronDown className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>

      {/* Featured reviews */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {data.featured.map(rev => (
          <div key={rev.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <img src={rev.img} alt={rev.foodName} className="w-full h-36 object-cover"/>
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 text-sm">{rev.foodName}</h4>
              <p className="text-xs text-gray-400 mb-2">{rev.foodCategory}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{rev.text}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {rev.reviewer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{rev.reviewer}</p>
                    <p className="text-xs text-gray-400">{rev.reviewerRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{rev.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Others review */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">{t("rev_others")}</h3>
            <p className="text-xs text-gray-400">{t("rev_othersSubtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 outline-none"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="latest">{t("latest")}</option>
              <option value="oldest">{t("oldest")}</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={2} />
          </div>
        </div>
        <div className="space-y-5">
          {[...data.others].sort((a, b) => sortOrder === "latest" ? b.id - a.id : a.id - b.id).map(rev => (
            <div key={rev.id} className="border-b border-gray-50 dark:border-gray-700 pb-5 last:border-0">
              <div className="flex items-start gap-3">
                <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{rev.name}</p>
                      <p className="text-xs text-gray-400">{rev.role} • {rev.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{rev.rating}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s<=Math.floor(rev.rating)?"text-yellow-400 fill-yellow-400":"text-gray-200 fill-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-1.5 mb-2">
                    {rev.tags.map((tag,ti) => (
                      <span key={ti} className={`text-xs px-2 py-0.5 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-500"}`}>{tag}</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{rev.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="bg-teal-500 text-white px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-600 transition flex items-center gap-2 mx-auto">
            {t("loadMore")}
            <ArrowDown className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </Layout>
  );
}
