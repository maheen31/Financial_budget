
import React,{useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {LineChart,Line,BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend} from "recharts";
import "./styles.css";

const money=n=>"₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:0});
const monthly=[
 {month:"Oct",spend:62000},{month:"Nov",spend:68500},{month:"Dec",spend:74200},{month:"Jan",spend:65500},
 {month:"Feb",spend:71800},{month:"Mar",spend:79200},{month:"Apr",spend:70100},{month:"May",spend:75800},
 {month:"Jun",spend:82300},{month:"Jul",spend:77900},{month:"Aug",spend:84600},{month:"Sep",spend:73100}
];
const categories=[
 {category:"Housing",spend:198000,budget:180000},{category:"Food",spend:112500,budget:108000},{category:"Shopping",spend:97000,budget:78000},
 {category:"Transport",spend:68500,budget:66000},{category:"Utilities",spend:45800,budget:42000},{category:"Travel",spend:43200,budget:60000},
 {category:"Healthcare",spend:36100,budget:42000},{category:"Entertainment",spend:29400,budget:42000}
];
const budget=[
 {category:"Housing",budget:18000,actual:20500},{category:"Food",budget:9000,actual:10400},{category:"Transport",budget:5500,actual:4800},
 {category:"Utilities",budget:3500,actual:3900},{category:"Shopping",budget:6500,actual:7200},{category:"Healthcare",budget:3500,actual:3100},
 {category:"Entertainment",budget:3500,actual:2900},{category:"Travel",budget:5000,actual:4200}
];
const transactions=[
 ["TXN-1001","2026-09-02","Housing","Rent payment",18000],["TXN-1002","2026-09-03","Food","Groceries",3200],
 ["TXN-1003","2026-09-04","Transport","Fuel",2100],["TXN-1004","2026-09-05","Shopping","Electronics",5800],
 ["TXN-1005","2026-09-07","Utilities","Electricity bill",3900],["TXN-1006","2026-09-09","Food","Dining",1750],
 ["TXN-1007","2026-09-11","Healthcare","Pharmacy",1250],["TXN-1008","2026-09-12","Entertainment","Streaming",900],
 ["TXN-1009","2026-09-15","Travel","Cab & commute",1850],["TXN-1010","2026-09-17","Shopping","Clothing",1400],
 ["TXN-1011","2026-09-20","Food","Supermarket",2950],["TXN-1012","2026-09-23","Transport","Fuel",2700],
 ["TXN-1013","2026-09-25","Housing","Maintenance",2500],["TXN-1014","2026-09-27","Travel","Hotel",4200]
].map(([id,date,category,description,amount])=>({id,date,category,description,amount}));
const colors=["#6f4e37","#9a7253","#b58b68","#d2b79a","#4f392b","#8b6247","#c8a98c","#a47b5a"];
const nav=[["overview","Overview","⌂"],["budget","Budget Control","◫"],["categories","Categories","◈"],["transactions","Transactions","▤"],["insights","Insights","✦"]];

function downloadCSV(){
 const rows=[["Transaction ID","Date","Category","Description","Amount (INR)"],...transactions.map(t=>[t.id,t.date,t.category,t.description,t.amount])];
 const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="finlytics_transactions.csv";a.click();URL.revokeObjectURL(url);
}
function App(){
 const [page,setPage]=useState("overview");
 const [mobileMenu,setMobileMenu]=useState(false);
 const title={overview:"Financial Expense & Budget Analytics",budget:"Budget Control",categories:"Category Analysis",transactions:"Transactions",insights:"Financial Insights"}[page];
 const subtitle={overview:"Executive dashboard for spend control, budget adherence and financial planning.",budget:"Compare monthly allocations with actual expenditure and identify variance.",categories:"Understand where money is concentrated and which categories need attention.",transactions:"Review, search and export the underlying transaction-level dataset.",insights:"Automated observations from spending trends, variance and category concentration."}[page];
 return <div className="app">
  <button className="mobile-menu" aria-label="Open menu" onClick={()=>setMobileMenu(true)}>☰</button>
  {mobileMenu&&<div className="menu-backdrop" onClick={()=>setMobileMenu(false)}/>}
  <aside className={mobileMenu?"mobile-open":""}><button className="mobile-close" aria-label="Close menu" onClick={()=>setMobileMenu(false)}>×</button><div className="brand">Fin<span>lytics</span></div><small>Expense Intelligence</small>
   <nav>{nav.map(([id,label,icon])=><button key={id} className={page===id?"active":""} onClick={()=>{setPage(id);setMobileMenu(false)}}><span className="nav-icon">{icon}</span>{label}</button>)}</nav>
   <div className="side"><b>Advanced Analytics</b><p>Budget variance, category concentration and monthly trend monitoring.</p></div>
  </aside>
  <main><header><div><p className="eyebrow">PERSONAL FINANCE • FY 2025–26</p><h1>{title}</h1><p className="sub">{subtitle}</p></div><div className="header-actions"><button className="primary" onClick={downloadCSV}>Export Data</button></div></header>
   {page==="overview"&&<Overview setPage={setPage}/>}
   {page==="budget"&&<Budget/>}
   {page==="categories"&&<Categories/>}
   {page==="transactions"&&<Transactions/>}
   {page==="insights"&&<Insights/>}
  </main>
 </div>
}
function Card({t,v,n}){return <div className="card"><div className="ct">{t}</div><div className="value">{v}</div><div className="note">{n}</div></div>}
function Panel({t,st,children}){return <div className="panel"><h2>{t}</h2><p>{st}</p>{children}</div>}
function Overview({setPage}){
 return <>
  <section className="cards"><Card t="Total Spend" v={money(853200)} n="900 transactions"/><Card t="Avg. Monthly Spend" v={money(71100)} n="12-month baseline"/><Card t="Latest Month" v={money(73100)} n="September 2026"/><Card t="Budget Efficiency" v="78.4%" n="spend-control index"/></section>
  <section className="grid two"><Panel t="Monthly Spending Trend" st="Actual expenditure by month"><ResponsiveContainer width="100%" height={280}><LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#eadfd4"/><XAxis dataKey="month"/><YAxis tickFormatter={v=>"₹"+Math.round(v/1000)+"k"}/><Tooltip formatter={v=>money(v)}/><Line type="monotone" dataKey="spend" stroke="#6f4e37" strokeWidth={3}/></LineChart></ResponsiveContainer></Panel>
   <Panel t="Spend Mix" st="Where money is being allocated"><ResponsiveContainer width="100%" height={245}><PieChart><Pie data={categories} dataKey="spend" nameKey="category" innerRadius={60} outerRadius={90}>{categories.map((_,x)=><Cell key={x} fill={colors[x%colors.length]}/>)}</Pie><Tooltip formatter={v=>money(v)}/></PieChart></ResponsiveContainer><div className="legend">{categories.map((x,n)=><span key={x.category}><i style={{background:colors[n]}}/>{x.category}</span>)}</div></Panel>
  </section>
  <section className="grid two"><Panel t="Budget vs Actual" st="Current month control view"><ResponsiveContainer width="100%" height={300}><BarChart data={budget}><CartesianGrid strokeDasharray="3 3" stroke="#eadfd4"/><XAxis dataKey="category" angle={-25} textAnchor="end" height={65}/><YAxis tickFormatter={v=>"₹"+Math.round(v/1000)+"k"}/><Tooltip formatter={v=>money(v)}/><Bar dataKey="budget" fill="#d8c4b1"/><Bar dataKey="actual" fill="#6f4e37"/></BarChart></ResponsiveContainer></Panel>
   <Panel t="Management Insights" st="Automated observations"><div className="insight"><b>#1 Housing</b><span>₹198,000 cumulative spend</span></div><div className="insight"><b>#2 Food</b><span>₹112,500 cumulative spend</span></div><div className="insight"><b>#3 Shopping</b><span>₹97,000 cumulative spend</span></div><div className="alert"><b>Housing</b><span>Over budget by ₹2,500</span></div><div className="alert"><b>Food</b><span>Over budget by ₹1,400</span></div><p className="recommendation">Prioritize high-variance categories and review discretionary spending before increasing monthly budgets.</p><button className="button-secondary" onClick={()=>setPage("insights")}>View all insights →</button></Panel>
  </section>
  <section className="table-panel"><h2>Latest Budget Control</h2><BudgetTable/></section>
 </>
}
function BudgetTable(){return <table><thead><tr><th>Category</th><th>Budget</th><th>Actual</th><th>Variance</th><th>Status</th></tr></thead><tbody>{budget.map(x=>{const v=x.budget-x.actual;return <tr key={x.category}><td>{x.category}</td><td>{money(x.budget)}</td><td>{money(x.actual)}</td><td className={v<0?"bad":"good"}>{v<0?"-":""}{money(Math.abs(v))}</td><td><span className={"pill "+(v<0?"badbg":"goodbg")}>{v<0?"Over Budget":"Under Budget"}</span></td></tr>})}</tbody></table>}
function Budget(){
 const totalB=budget.reduce((a,x)=>a+x.budget,0),totalA=budget.reduce((a,x)=>a+x.actual,0),over=budget.filter(x=>x.actual>x.budget).length;
 return <><section className="cards"><Card t="Monthly Budget" v={money(totalB)} n="planned allocation"/><Card t="Actual Spend" v={money(totalA)} n="current month"/><Card t="Variance" v={money(totalB-totalA)} n="positive = remaining"/><Card t="Over-Budget Areas" v={over} n="categories above plan"/></section>
 <section className="table-panel"><h2>Budget Allocation Monitor</h2><p className="page-note">Variance = budget minus actual. Negative values indicate an over-budget category.</p>
  <div className="metric-row header"><div>Category</div><div>Budget</div><div>Actual</div><div>Variance</div><div>Utilization</div></div>
  {budget.map(x=>{const util=Math.round(x.actual/x.budget*100);const v=x.budget-x.actual;return <div className="metric-row" key={x.category}><div><b>{x.category}</b></div><div>{money(x.budget)}</div><div>{money(x.actual)}</div><div className={v<0?"bad":"good"}>{v<0?"-":""}{money(Math.abs(v))}</div><div><div className="progress"><span style={{width:Math.min(util,100)+"%"}}/></div><small>{util}% used</small></div></div>})}</section>
 <section className="grid two"><Panel t="Allocation vs Actual" st="Side-by-side monthly control"><ResponsiveContainer width="100%" height={320}><BarChart data={budget}><CartesianGrid strokeDasharray="3 3" stroke="#eadfd4"/><XAxis dataKey="category" angle={-25} textAnchor="end" height={70}/><YAxis/><Tooltip formatter={v=>money(v)}/><Bar dataKey="budget" fill="#d8c4b1"/><Bar dataKey="actual" fill="#6f4e37"/></BarChart></ResponsiveContainer></Panel><Panel t="Control Summary" st="What the numbers indicate"><div className="insight"><b>Budget utilization</b><span>{Math.round(totalA/totalB*100)}%</span></div><div className="insight"><b>Categories over plan</b><span>{over} of {budget.length}</span></div><div className="insight"><b>Largest variance</b><span>Housing · -₹2,500</span></div><p className="recommendation">A negative variance means actual expenditure has exceeded the allocation. Review the corresponding category before revising the budget.</p></Panel></section></>
}
function Categories(){
 const total=categories.reduce((a,x)=>a+x.spend,0);
 return <><section className="cards"><Card t="Categories" v={categories.length} n="tracked spending groups"/><Card t="Total Spend" v={money(total)} n="category dataset"/><Card t="Top Category" v="Housing" n="largest concentration"/><Card t="Top Share" v={Math.round(categories[0].spend/total*100)+"%"} n="of category spend"/></section>
 <section className="grid two"><Panel t="Category Spend" st="Cumulative expenditure by category"><ResponsiveContainer width="100%" height={340}><BarChart data={categories} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#eadfd4"/><XAxis type="number" tickFormatter={v=>"₹"+Math.round(v/1000)+"k"}/><YAxis dataKey="category" type="category" width={85}/><Tooltip formatter={v=>money(v)}/><Bar dataKey="spend" fill="#6f4e37"/></BarChart></ResponsiveContainer></Panel><Panel t="Category Distribution" st="Share of total tracked spend"><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={categories} dataKey="spend" nameKey="category" innerRadius={55} outerRadius={105}>{categories.map((_,x)=><Cell key={x} fill={colors[x%colors.length]}/>)}</Pie><Tooltip formatter={v=>money(v)}/><Legend/></PieChart></ResponsiveContainer></Panel></section>
 <section className="cat-grid">{categories.map((x,i)=>{const share=Math.round(x.spend/total*100);const variance=x.spend-x.budget;return <div className="cat-card" key={x.category}><div className="cat-top"><h3>{x.category}</h3><b>{share}%</b></div><p>{money(x.spend)} cumulative spend · Budget {money(x.budget)}</p><div className="progress"><span style={{width:share*3+"%"}}/></div><p className={variance>0?"bad":"good"}>{variance>0?"Above":"Below"} category budget by {money(Math.abs(variance))}</p></div>})}</section></>
}
function Transactions(){
 const [q,setQ]=useState("");const [cat,setCat]=useState("All");
 const filtered=transactions.filter(t=>(cat==="All"||t.category===cat)&&Object.values(t).join(" ").toLowerCase().includes(q.toLowerCase()));
 return <><section className="cards"><Card t="Records" v={transactions.length} n="sample transaction dataset"/><Card t="Filtered" v={filtered.length} n="matching current filters"/><Card t="Transaction Value" v={money(transactions.reduce((a,x)=>a+x.amount,0))} n="sample period"/><Card t="Export" v="CSV" n="download available above"/></section>
 <section className="table-panel"><h2>Transaction Register</h2><p className="page-note">Search by ID, description, date or category. Use Export Data to download the complete CSV.</p>
 <div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search transactions..."/><select value={cat} onChange={e=>setCat(e.target.value)}><option>All</option>{categories.map(x=><option key={x.category}>{x.category}</option>)}</select><button className="button-secondary" onClick={()=>{setQ("");setCat("All")}}>Clear Filters</button></div>
 <table><thead><tr><th>ID</th><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead><tbody>{filtered.length?filtered.map(t=><tr key={t.id}><td><b>{t.id}</b></td><td>{t.date}</td><td>{t.category}</td><td>{t.description}</td><td>{money(t.amount)}</td></tr>):<tr><td colSpan="5" className="empty">No transactions match your filters.</td></tr>}</tbody></table></section></>
}
function Insights(){
 const maxMonth=monthly.reduce((a,b)=>b.spend>a.spend?b:a);const minMonth=monthly.reduce((a,b)=>b.spend<a.spend?b:a);
 return <><section className="insight-grid"><div className="insight-box"><h3>Highest Monthly Spend</h3><div className="big-stat">{money(maxMonth.spend)}</div><p>{maxMonth.month} recorded the highest monthly expenditure in the 12-month series.</p></div><div className="insight-box"><h3>Lowest Monthly Spend</h3><div className="big-stat">{money(minMonth.spend)}</div><p>{minMonth.month} recorded the lowest monthly expenditure in the 12-month series.</p></div><div className="insight-box"><h3>Top Concentration</h3><div className="big-stat">Housing · 23%</div><p>Housing is the largest tracked category, so changes here have a material effect on total spend.</p></div></section>
 <section className="grid two"><Panel t="12-Month Trend" st="Identify periods of higher and lower expenditure"><ResponsiveContainer width="100%" height={320}><LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#eadfd4"/><XAxis dataKey="month"/><YAxis tickFormatter={v=>"₹"+Math.round(v/1000)+"k"}/><Tooltip formatter={v=>money(v)}/><Line type="monotone" dataKey="spend" stroke="#6f4e37" strokeWidth={3}/></LineChart></ResponsiveContainer></Panel><Panel t="Actionable Observations" st="Data-driven checks for financial review"><div className="alert"><b>Housing</b><span>₹2,500 over monthly budget</span></div><div className="alert"><b>Food</b><span>₹1,400 over monthly budget</span></div><div className="alert"><b>Shopping</b><span>₹700 over monthly budget</span></div><p className="recommendation">Use the Transactions page to inspect the underlying entries, then use Budget Control to compare category-level allocation and utilization.</p></Panel></section>
 <section className="table-panel"><h2>Analytics Notes</h2><div className="insight"><b>Trend monitoring</b><span>Compare month-to-month movement rather than relying on one month.</span></div><div className="insight"><b>Variance analysis</b><span>Prioritize categories where actual spending consistently exceeds plan.</span></div><div className="insight"><b>Concentration analysis</b><span>Large categories have a greater effect on total financial performance.</span></div></section></>
}
createRoot(document.getElementById("root")).render(<App/>);
