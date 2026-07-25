import {
  CheckCircle,
  Clock,
} from "lucide-react";

import { ChildAvatar } from "../ChildAvatar";

import {
  Stars,
} from "../Stars";

import {
  CatBadge,
} from "../CatBadge";


import type {
  Task,
} from "../../types/dashboard";



interface Props {

  tasks: Task[];

}



export default function TaskSnapshot({
  tasks,
}: Props) {



return (

<div
className="
bg-white
rounded-2xl
p-5
shadow-sm
border
border-gray-100
"
>


<div
className="
flex
items-center
justify-between
mb-4
"
>

<h3
className="
font-semibold
text-gray-900
"
>

Today's Task Snapshot

</h3>


<button
className="
text-xs
text-indigo-600
font-semibold
"
>

View all tasks →

</button>


</div>





<div className="space-y-1.5">


{

tasks.slice(0,6).map(task=>{


// temporary until completion backend exists
const isCompleted = false;



return (

<div
key={task.id}
className="
flex
items-center
gap-4
px-3
py-2.5
rounded-xl
hover:bg-gray-50
"
>


{/* STATUS */}

<div

className={`
w-7
h-7
rounded-lg
flex
items-center
justify-center

${
isCompleted
?
"bg-emerald-100"
:
"bg-gray-100"
}

`}

>


{
isCompleted

?

<CheckCircle
className="
w-4
h-4
text-emerald-600
"
/>

:

<Clock
className="
w-4
h-4
text-gray-400
"
/>

}


</div>






{/* TITLE */}

<span

className="
flex-1
text-sm
font-medium
text-gray-800
"

>

{task.title}

</span>






{/* CATEGORY */}

{
task.category && (

<CatBadge
category={task.category}
/>

)

}





{/* DIFFICULTY */}

{
task.difficulty && (

<Stars
level={task.difficulty}
/>

)

}





{/* XP */}

<span

className="
text-xs
font-bold
text-indigo-600
w-12
text-right
"

>

+{task.points} XP

</span>







{/* CHILDREN */}

<div
className="
flex
-space-x-1
"
>


{

task.childTasks?.map(childTask=>(


<div

key={childTask.child.id}

title={childTask.child.name}

className="
w-5
h-5
rounded-full
flex
items-center
justify-center
text-[10px]
ring-1
ring-white
bg-indigo-100
"

>

<ChildAvatar
  child={{
    id: childTask.child.id,
    name: childTask.child.name,
    age: 0,
    avatar: childTask.child.avatar,
    color: "#6366f1",
    xp: 0,
    maxXp: 1000,
    level: 1,
    coins: 0,
    streak: 0,
    tasksToday: 0,
    tasksComplete: 0,
    theme: childTask.child.theme,
    themeId: childTask.child.theme,
    pin: "",
  }}
  size="sm"
/>

</div>


))


}


</div>




</div>

);


})


}


</div>



</div>


);


}