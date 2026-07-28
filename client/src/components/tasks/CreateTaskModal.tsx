import {
  Check,
  Minus,
  Plus,
  X,
} from "lucide-react";

import { ChildAvatar } from "../ChildAvatar";

import { useState } from "react";

import type {
  Child,
} from "../../types/dashboard";


import {
  createTask,
  assignTaskToChild,
} from "../../services/tasks";



interface Props {

  familyChildren: Child[];

  onClose: () => void;

  onCreated: () => Promise<void>;

}




export default function CreateTaskModal({
  familyChildren,
  onClose,
  onCreated,
}: Props) {



  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
  useState("🧹 Chores");


  const [points, setPoints] =
    useState(20);


  const [difficulty, setDifficulty] =
    useState(2);


  const [selectedChildren, setSelectedChildren] =
    useState<string[]>([]);


  const [recurring, setRecurring] =
    useState(false);


  const [frequency, setFrequency] =
    useState("Daily");


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");






  function toggleChild(id:string){

    setSelectedChildren(prev =>

      prev.includes(id)

      ?

      prev.filter(
        childId => childId !== id
      )

      :

      [
        ...prev,
        id
      ]

    );

  }







  async function handleSubmit(
    e: React.FormEvent
  ){

    e.preventDefault();

    setError("");



    if(!title.trim()){

      setError(
        "Please enter a task name."
      );

      return;

    }



    if(selectedChildren.length === 0){

      setError(
        "Please select at least one child."
      );

      return;

    }





    try{


      setLoading(true);



      const taskData = {

        title:title.trim(),

        description:
          description.trim() || undefined,

        category,

        points,

        difficulty,

        recurring,

        frequency:
          recurring
          ?
          frequency
          :
          undefined,

      };




      const response =
        await createTask(taskData);




      const taskId =
        response.task.id;




      for(const childId of selectedChildren){

        await assignTaskToChild(
          childId,
          taskId
        );

      }




      await onCreated();


      onClose();




    }catch(error: unknown){


      console.error(
        error
      );


      setError(
        (typeof error === "object" && error !== null && "response" in error
          ? (error.response as { data?: { message?: string } }).data?.message
          : undefined)
        ||
        "Could not create task."
      );



    }finally{

      setLoading(false);

    }


  }







return (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
  <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-4xl border border-white/70 bg-white/85 p-5 shadow-2xl backdrop-blur-xl sm:p-7">



{/* HEADER */}

<div
className="
flex justify-between items-start mb-5
"
>


<div>

<h2
className="
text-xl
font-bold
text-gray-900
"
>

Create New Task

</h2>


<p
className="
text-sm
text-gray-400
mt-1
"
>

Add a task for your family

</p>

</div>




<button
type="button"
onClick={onClose}
>

<X
size={20}
className="text-gray-400"
/>

</button>


</div>








<form
onSubmit={handleSubmit}
className="
space-y-4
"
>





{/* TITLE */}

<div>

<label
className="
text-sm
font-semibold
text-gray-700
"
>

Task name

</label>


<input

value={title}

onChange={
e=>setTitle(e.target.value)
}

placeholder="Example: Learn English"

className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"

/>

</div>






{/* DESCRIPTION */}

<div>

<label
className="
text-sm
font-semibold
text-gray-700
"
>

Description

</label>


<textarea

value={description}

onChange={
e=>setDescription(e.target.value)
}

placeholder="Optional details..."

rows={2}

className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"

/>


</div>







{/* SETTINGS ROW */}

<div
className="
grid
grid-cols-3
gap-3
"
>



<div>

<label
className="
text-xs
font-semibold
text-gray-500
"
>

Category

</label>


<select

value={category}

onChange={
e=>setCategory(e.target.value)
}

className="
mt-1
w-full
border
rounded-xl
px-3
py-2
text-sm
"

>

<option>
🧹 Chores
</option>

<option>
🧠 Skills
</option>

<option>
📚 Education
</option>

<option>
⭐ Other
</option>

</select>


</div>







<div>

<label
className="
text-xs
font-semibold
text-gray-500
"
>

Difficulty

</label>


<select

value={difficulty}

onChange={
e=>setDifficulty(
Number(e.target.value)
)
}

className="
mt-1
w-full
border
rounded-xl
px-3
py-2
text-sm
"

>

<option value={1}>
⭐ Easy
</option>

<option value={2}>
⭐⭐ Medium
</option>

<option value={3}>
⭐⭐⭐ Hard
</option>


</select>


</div>







<div>

<label
className="
text-xs
font-semibold
text-gray-500
"
>

XP Reward

</label>



<div
className="mt-1.5 flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5"
>


<button

type="button"

onClick={()=>
setPoints(
Math.max(
5,
points-5
)
)
}

>

<Minus size={14}/>

</button>



<span
className="
text-sm
font-bold
"
>

{points} XP

</span>




<button

type="button"

onClick={()=>
setPoints(points+5)
}

>

<Plus size={14}/>

</button>


</div>



</div>



</div>








{/* CHILDREN */}

<div>

<label
className="
text-sm
font-semibold
text-gray-700
"
>

Assign to

</label>



<div
className="
flex
flex-wrap
gap-2
mt-2
"
>


{
familyChildren.map(child=>{


const selected =
selectedChildren.includes(child.id);



return (

<button

type="button"

key={child.id}

onClick={()=>
toggleChild(child.id)
}

className={`

flex
items-center
gap-2
px-3
py-2
rounded-xl
border
text-sm
transition


${
selected

?

"border-indigo-500 bg-indigo-50 text-indigo-700"

:

"border-gray-200 hover:bg-gray-50"

}

`}

>


<ChildAvatar
  child={child}
  size="sm"
/>


<span
className="
font-medium
"
>

{child.name}

</span>



{
selected && (

<Check
size={14}
/>

)

}



</button>


);


})

}



</div>


</div>









{/* RECURRING */}

<div
className="
flex
items-center
gap-3
border
rounded-xl
px-3
py-2
"
>


<label
className="
flex
items-center
gap-2
text-sm
font-medium
flex-1
"
>


<input

type="checkbox"

checked={recurring}

onChange={
e=>setRecurring(
e.target.checked
)
}

/>


Repeat task


</label>




{
recurring && (

<select

value={frequency}

onChange={
e=>setFrequency(
e.target.value
)
}

className="
border
rounded-lg
px-2
py-1
text-sm
"

>

<option>
Daily
</option>

<option>
Weekly
</option>

<option>
Weekdays
</option>

<option>
Weekends
</option>

<option>
Monthly
</option>


</select>


)

}



</div>







{
error && (

<div
className="
bg-red-50
text-red-600
rounded-xl
p-3
text-sm
"
>

{error}

</div>

)

}







{/* BUTTONS */}

<div
className="
flex
gap-3
pt-2
"
>


<button

type="button"

onClick={onClose}

className="
flex-1
bg-gray-100
rounded-xl
py-2.5
text-sm
font-semibold
"

>

Cancel

</button>





<button

disabled={loading}

className="
flex-1
bg-indigo-600
hover:bg-indigo-700
text-white
rounded-xl
py-2.5
text-sm
font-semibold
"

>

{
loading
?
"Creating..."
:
"Create Task"
}


</button>



</div>






</form>



</div>


</div>


);

}
