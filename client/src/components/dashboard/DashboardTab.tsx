import TaskSnapshot from "./TaskSnapshot";
import DashboardStats from "./DashboardStats";
import ChildrenOverview from "./ChildrenOverview";
import RewardRequests from "./RewardRequests";

import CreateTaskModal from "../tasks/CreateTaskModal";

import { useEffect, useState } from "react";

import { getChildren } from "../../services/child";
import { getTasks } from "../../services/task";

import type {
  Child,
  Task,
} from "../../types/dashboard";



export default function DashboardTab() {


  const [children, setChildren] = useState<Child[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);

  const [showCreateTask, setShowCreateTask] =
    useState(false);



  const loadDashboardData = async () => {

    try {


      const childrenData = await getChildren();



      const mappedChildren: Child[] = childrenData.map(
  (child, index: number) => ({
    id: child.id,
    name: child.name ?? "Unknown",
    age: child.age ?? 0,

    avatar:
      child.avatar ??
      child.emoji ??
      ["🐱", "🐶", "🦊", "🐼", "🐰"][index % 5],

    color:
      child.theme === "Princess Kingdom"
        ? "#ec4899"
        : "#6366f1",

    xp: 0,
    maxXp: 1000,

    level: 1,
    coins: 0,
    streak: 0,

    tasksToday: 0,
    tasksComplete: 0,

    theme: child.theme ?? "default",
    themeId: child.theme ?? "default",

    pin: "",
  })
);

      setChildren(mappedChildren);




      const tasksData =
        await getTasks();


      setTasks(tasksData ?? []);



    } catch(error){

      console.error(
        "Failed loading dashboard:",
        error
      );


    } finally {

      setLoading(false);

    }

  };






  useEffect(()=>{

    // eslint-disable-next-line react-hooks/set-state-in-effect -- This starts the initial async fetch; state updates happen after it resolves.
    loadDashboardData();

  },[]);








  // -----------------------------
  // DYNAMIC DATE + GREETING
  // -----------------------------


  function getGreeting(){

    const hour =
      new Date().getHours();


    if(hour < 12){

      return "Good morning";

    }


    if(hour < 18){

      return "Good afternoon";

    }


    return "Good evening";

  }






  function getTodayDate(){


    return new Intl.DateTimeFormat(
      "en-US",
      {
        weekday:"long",
        month:"long",
        day:"numeric",
      }

    ).format(
      new Date()
    );


  }





  // -----------------------------
  // TEMP STATS
  // Backend stats later
  // -----------------------------


  const totalToday =
    children.reduce(
      (sum,child)=>
        sum + child.tasksToday,
      0
    );



  const totalDone =
    children.reduce(
      (sum,child)=>
        sum + child.tasksComplete,
      0
    );



  const percentage =
    totalToday === 0
    ?
    0
    :
    Math.round(
      (totalDone / totalToday) * 100
    );







  if(loading){

    return (

      <div
        className="
        p-10
        text-center
        text-gray-500
        "
      >

        Loading dashboard...

      </div>

    );

  }








  return (

    <div className="space-y-5">





      {/* HEADER */}

      <div
        className="
        flex
        items-center
        justify-between
        "
      >



        <div>


          <h1
            className="
            text-xl
            font-semibold
            text-gray-900
            "
          >

            {getGreeting()}, Jane! 👋


          </h1>



          <p
            className="
            text-sm
            text-gray-400
            mt-1
            "
          >

            {getTodayDate()} · Here's your family overview


          </p>



        </div>






        <button

          onClick={()=>
            setShowCreateTask(true)
          }

          className="
          px-4
          py-2.5
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









      <DashboardStats

        totalDone={totalDone}

        totalToday={totalToday}

        percentage={percentage}

      />







      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-4
        "
      >



        <ChildrenOverview

          children={children}

        />




        <RewardRequests />



      </div>






      <TaskSnapshot

        tasks={tasks}

      />









      {
        showCreateTask && (

          <CreateTaskModal

            familyChildren={children}

            onCreated={loadDashboardData}

            onClose={()=>
              setShowCreateTask(false)
            }

          />

        )
      }






    </div>

  );

}
