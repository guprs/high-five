import { CheckCircle, Flame, Zap, Gift, Clock } from "lucide-react";
import { motion } from "framer-motion";

import {
  CHILDREN,
  TASKS,
  PENDING_REWARDS_INIT,
} from "../../data/dashboardData";

import { ChildAvatar } from "../ChildAvatar";
import { XPBar } from "../XPBar";


export default function DashboardTab() {


const totalToday = CHILDREN.reduce(
  (sum, child)=>sum + child.tasksToday,
  0
);


const totalDone = CHILDREN.reduce(
  (sum, child)=>sum + child.tasksComplete,
  0
);


const percentage = Math.round(
  (totalDone / totalToday) * 100
);



return (

<div className="space-y-5">


{/* HEADER */}

<div className="flex items-center justify-between">


<div>

<h1 className="
text-xl font-semibold text-gray-900
">
Good morning, Jane! 👋
</h1>


<p className="
text-sm text-gray-400 mt-1
">
Here's your family overview
</p>


</div>



<button
className="
px-4 py-2.5
bg-indigo-600
hover:bg-indigo-700
text-white
rounded-xl
text-sm
font-semibold
"
>

+ Quick Add Task

</button>


</div>





{/* STATS */}


<div className="
grid grid-cols-2 xl:grid-cols-4 gap-4
">


{[
{
label:"Tasks Done Today",
value:`${totalDone}/${totalToday}`,
sub:`${percentage}% complete`,
Icon:CheckCircle
},

{
label:"Top Streak",
value:"14 days 🔥",
sub:"Lucas leading",
Icon:Flame
},

{
label:"Family XP Earned",
value:"+680 XP",
sub:"This week",
Icon:Zap
},

{
label:"Pending Rewards",
value:"2 requests",
sub:"Waiting approval",
Icon:Gift
}

].map(stat=>{


const Icon=stat.Icon;


return (

<motion.div

key={stat.label}

whileHover={{y:-2}}

className="
bg-white rounded-2xl
p-5 border border-gray-100
shadow-sm
"

>


<div className="
w-10 h-10 rounded-xl
bg-indigo-50
flex items-center justify-center
mb-3
">

<Icon
className="
w-5 h-5 text-indigo-600
"
/>

</div>


<div className="
text-xl font-bold
">
{stat.value}
</div>


<div className="
text-xs text-gray-500
">
{stat.label}
</div>


<div className="
text-xs text-gray-400 mt-1
">
{stat.sub}
</div>


</motion.div>

)

})}


</div>





{/* CHILDREN + REWARDS */}


<div className="
grid grid-cols-1 xl:grid-cols-3 gap-4
">


<div className="
xl:col-span-2
bg-white rounded-2xl
p-5 border border-gray-100
">


<h3 className="
font-semibold text-gray-900 mb-5
">
Children Overview
</h3>



<div className="space-y-5">


{
CHILDREN.map(child=>(


<div
key={child.id}
className="
flex items-center gap-4
"
>


<ChildAvatar
child={child}
size="md"
/>


<div className="
flex-1
">


<div className="
flex justify-between mb-2
">


<span className="
font-bold text-sm
">
{child.name}
</span>


<span className="
text-xs text-gray-500
">
Lv. {child.level}
</span>


</div>


<XPBar
current={child.xp}
max={child.maxXp}
color={child.color}
/>



<div className="
flex justify-between text-xs
text-gray-400 mt-1
">

<span>
{child.xp} XP
</span>


<span>
🔥 {child.streak} days
</span>


</div>



</div>


</div>


))
}



</div>


</div>





{/* REWARDS */}


<div className="
bg-white rounded-2xl
p-5 border border-gray-100
">


<div className="
flex justify-between mb-4
">

<h3 className="font-semibold">
Reward Requests
</h3>


<span className="
bg-rose-100
text-rose-600
px-2 rounded-full text-xs
">
2
</span>


</div>



{
PENDING_REWARDS_INIT.map(req=>(


<div
key={req.id}
className="
bg-gray-50 rounded-xl p-3
"
>


<div className="font-semibold text-sm">
{req.childEmoji} {req.childName}
</div>


<p className="text-sm mt-2">
{req.reward}
</p>


<p className="
text-xs text-amber-600 font-bold
">
⭐ {req.cost} coins
</p>


<div className="
flex gap-2 mt-3
">

<button
className="
flex-1 bg-emerald-500
text-white rounded-lg py-1 text-xs
"
>
Approve
</button>


<button
className="
flex-1 bg-gray-200
rounded-lg py-1 text-xs
"
>
Decline
</button>


</div>


</div>


))

}


</div>


</div>





{/* TASKS */}


<div className="
bg-white rounded-2xl
p-5 border border-gray-100
">


<h3 className="
font-semibold mb-4
">
Today's Task Snapshot
</h3>



{
TASKS.map(task=>(


<div
key={task.id}
className="
flex items-center gap-3
py-2
"
>


{
task.status==="completed"
?
<CheckCircle
className="text-emerald-500"
size={18}
/>
:
<Clock
className="text-gray-400"
size={18}
/>
}



<span className="flex-1 text-sm">
{task.title}
</span>


<span className="
text-indigo-600 text-sm font-bold
">
+{task.points} XP
</span>


</div>


))

}



</div>


</div>

)

}