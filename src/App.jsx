import { useState, useEffect } from "react";

const DISHES_KEY = "today-eat-dishes";
const WEEK_KEY = "today-eat-week";
const FRIDGE_KEY = "today-eat-fridge";

const defaultDishes = [
  { id:1,name:"番茄炒蛋",category:"荤菜",ingredients:["鸡蛋","番茄"],cookTime:15,instructions:"先打蛋炒熟，再加入番茄翻炒",tags:["快手"]},
  { id:2,name:"红烧鸡腿",category:"荤菜",ingredients:["鸡腿"],cookTime:40,instructions:"鸡腿焯水后红烧",tags:["晚餐"]},
  { id:3,name:"蒜蓉西兰花",category:"素菜",ingredients:["西兰花","大蒜"],cookTime:10,instructions:"西兰花焯水，蒜炒香后翻炒",tags:["健康"]},
  { id:4,name:"清炒菠菜",category:"素菜",ingredients:["菠菜"],cookTime:10,instructions:"菠菜洗净快速翻炒",tags:["简单"]}
];

const days = ["周一","周二","周三","周四","周五","周六","周日"];

export default function App(){
  const [dishes,setDishes] = useState([]);
  const [weekMenu,setWeekMenu] = useState([]);
  const [fridge,setFridge] = useState([]);
  const [todaySpecial,setTodaySpecial] = useState([]);

  useEffect(()=>{
    setDishes(JSON.parse(localStorage.getItem(DISHES_KEY))||defaultDishes);
    setWeekMenu(JSON.parse(localStorage.getItem(WEEK_KEY))||[]);
    setFridge(JSON.parse(localStorage.getItem(FRIDGE_KEY))||[]);
  },[]);

  useEffect(()=>{localStorage.setItem(DISHES_KEY,JSON.stringify(dishes));},[dishes]);
  useEffect(()=>{localStorage.setItem(WEEK_KEY,JSON.stringify(weekMenu));},[weekMenu]);
  useEffect(()=>{localStorage.setItem(FRIDGE_KEY,JSON.stringify(fridge));},[fridge]);

  const addDish=(dish)=>{ setDishes([...dishes,dish]); };
  const updateDish=(id,updated)=>{ setDishes(dishes.map(d=>d.id===id?{...d,...updated}:d)); };
  const deleteDish=(id)=>{ setDishes(dishes.filter(d=>d.id!==id)); };

  const generateDay=()=>{
    const meat=dishes.filter(d=>d.category==="荤菜");
    const veg=dishes.filter(d=>d.category==="素菜");
    if(!meat.length||!veg.length)return null;
    return { meat: meat[Math.floor(Math.random()*meat.length)], veg: veg[Math.floor(Math.random()*veg.length)] };
  };

  const generateWeek=()=>{
    const week=days.map(day=>({ day,...generateDay() }));
    setWeekMenu(week);
  };

  const shoppingList=Array.from(new Set(weekMenu.flatMap(d=>[...(d.meat?.ingredients||[]),...(d.veg?.ingredients||[])])));

  const generateTodaySpecial=()=>{
    const matched=dishes.filter(d=>d.ingredients.every(i=>fridge.includes(i)));
    setTodaySpecial(matched);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">🍽 今天吃随便</h1>
      <button onClick={generateWeek} className="w-full bg-black text-white py-3 rounded mb-3">生成一周菜单</button>

      {weekMenu.length>0&&weekMenu.map((d,i)=>(
        <div key={i} className="bg-white p-3 rounded mb-2 shadow">
          <strong>{d.day}</strong>
          <div>🥩 {d.meat?.name}</div>
          <div>🥬 {d.veg?.name}</div>
        </div>
      ))}

      <div className="bg-white p-3 rounded mb-3 shadow">
        <h2 className="font-semibold mb-2">🛒 本周购物清单</h2>
        <ul className="list-disc pl-5 text-sm">{shoppingList.map((item,i)=><li key={i}>{item}</li>)}</ul>
      </div>

      <div className="bg-white p-3 rounded mb-3 shadow">
        <h2 className="font-semibold mb-2">🥶 冰箱食材</h2>
        <input type="text" placeholder="输入食材" id="fridgeInput" className="border p-1 mr-2"/>
        <button onClick={()=>{const val=document.getElementById('fridgeInput').value.trim(); if(val){setFridge([...fridge,val]);document.getElementById('fridgeInput').value='';}}} className="bg-blue-500 text-white px-2 rounded">添加</button>
        <ul className="list-disc pl-5 text-sm mt-2">{fridge.map((f,i)=><li key={i} onClick={()=>setFridge(fridge.filter((_,idx)=>idx!==i))} className="cursor-pointer">{f} ❌</li>)}</ul>
        <button onClick={generateTodaySpecial} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">生成今日特色菜单</button>
        {todaySpecial.length>0&&<div className="mt-2">{todaySpecial.map(d=><div key={d.id} className="p-2 bg-gray-200 rounded mb-1">{d.name} - 做法: {d.instructions}</div>)}</div>}
      </div>
    </div>
  );
}
