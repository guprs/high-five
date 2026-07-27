import AddChildModal from "./AddChildModal";
import EditChildModal from "./EditChildModal";
import {
  UserPlus,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

import { useEffect, useState } from "react";

import { ChildAvatar } from "../ChildAvatar";
import { XPBar } from "../XPBar";

import { getChildren } from "../../services/child";

import type {
  Child,
} from "../../types/dashboard";



interface Props {

  onKidMode: (child: Child) => void;

}



export default function ChildrenTab({
  onKidMode,
}: Props) {


  const [children, setChildren] =
    useState<Child[]>([]);


  const [loading, setLoading] =
    useState(true);

    const [openMenu, setOpenMenu] =

  useState<string | null>(null);

const [editChild, setEditChild] =

  useState<Child | null>(null);

  const [showEditModal, setShowEditModal] =
  useState(false);

const [showAddChild, setShowAddChild] =
  useState(false);



  async function loadChildren() {


    try {


      const response =
        await getChildren();



      console.log(
        "CHILDREN API RESPONSE:",
        response
      );


      const data = response;


      const mappedChildren: Child[] =
        data.map(
          (child, index: number) => ({

            id: child.id,

            name:
              child.name ?? "Unknown",


            age:
              child.age ?? 0,



            avatar:
              child.avatar ??
              child.emoji ??
              [
                "🐱",
                "🐶",
                "🦊",
                "🐼",
                "🐰",
              ][index % 5],



            color:
              child.color ??
              "#6366f1",



            xp:
              child.xp ?? 0,


            maxXp:
              child.maxXp ?? 1000,


            level:
              child.level ?? 1,


            coins:
              child.coins ?? 0,


            streak:
              child.streak ?? 0,



            tasksToday:
              child.tasksToday ?? 0,



            tasksComplete:
              child.tasksComplete ?? 0,



            theme:
              child.theme ?? "Default",



            themeId:
              child.themeId ?? "default",



            pin:
              child.pin ?? "",

          })

        );



      console.log(
        "MAPPED CHILDREN:",
        mappedChildren
      );



      setChildren(mappedChildren);



    } catch(error) {


      console.error(
        "Failed loading children:",
        error
      );


    } finally {


      setLoading(false);


    }


  }








  useEffect(()=>{


    // eslint-disable-next-line react-hooks/set-state-in-effect -- This starts the initial async fetch; state updates happen after it resolves.
    loadChildren();


  },[]);








  if(loading){


    return (

      <div
        className="
        p-10
        text-center
        text-gray-500
        "
      >

        Loading children...

      </div>

    );


  }








  return (

    <div
      className="
      space-y-5
      "
    >



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

            Children

          </h1>


          <p
            className="
            text-sm
            text-gray-400
            "
          >

            Manage profiles, themes and stats

          </p>


        </div>




        <button
  onClick={() => setShowAddChild(true)}
  className="
  flex
  items-center
  gap-2
  px-4
  py-2.5
  bg-indigo-600
  hover:bg-indigo-700
  text-white
  text-sm
  font-semibold
  rounded-xl
  "
>

          <UserPlus
            className="w-4 h-4"
          />

          Add Child


        </button>


      </div>








      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-4
        "
      >





        {
          children.map(child=>(


            <div
              key={child.id}

              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
              border-gray-100
              "
            >




              <div
                className="
                flex
                items-start
                justify-between
                mb-5
                "
              >


                <div
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >


                  <ChildAvatar
                    child={child}
                    size="lg"
                  />



                  <div>


                    <h3
                      className="
                      font-black
                      text-gray-900
                      text-lg
                      "
                    >

                      {child.name}

                    </h3>



                    <p
                      className="
                      text-sm
                      text-gray-400
                      "
                    >

                      Age {child.age}

                    </p>




                    <span

                      className="
                      inline-block
                      mt-1
                      text-[10px]
                      font-semibold
                      px-2
                      py-0.5
                      rounded-full
                      "

                      style={{
                        backgroundColor:
                          child.color + "22",

                        color:
                          child.color,
                      }}

                    >

                      {child.theme}

                    </span>



                  </div>


                </div>

                <div className="relative">

  <button
    onClick={() =>
      setOpenMenu(
        openMenu === child.id
          ? null
          : child.id
      )
    }
    className="
    text-gray-300
    hover:text-gray-500
    "
  >

    <MoreHorizontal
      className="w-5 h-5"
    />

  </button>



  {
    openMenu === child.id && (

      <div
        className="
        absolute
        right-0
        top-8
        w-48
        bg-white
        rounded-xl
        shadow-lg
        border
        border-gray-100
        z-20
        py-2
        "
      >


        <button

          onClick={() => {

            setEditChild(child);
            setShowEditModal(true);
            setOpenMenu(null);

          }}

          className="
          w-full
          text-left
          px-4
          py-2
          text-sm
          hover:bg-gray-50
          "
        >

          ✏️ Edit profile

        </button>


        <button

          className="
          w-full
          text-left
          px-4
          py-2
          text-sm
          hover:bg-gray-50
          "
        >

          📊 View progress

        </button>




        <button

          className="
          w-full
          text-left
          px-4
          py-2
          text-sm
          text-red-500
          hover:bg-red-50
          "
        >

          🗑 Delete child

        </button>


      </div>

    )

  }


</div>


              </div>

              <div
                className="
                mb-4
                "
              >

                <div
                  className="
                  flex
                  justify-between
                  mb-2
                  "
                >

                  <span
                    className="
                    text-sm
                    font-bold
                    text-gray-700
                    "
                  >

                    Level {child.level}

                  </span>


                  <span
                    className="
                    text-xs
                    text-gray-400
                    "
                  >

                    {child.xp} / {child.maxXp} XP

                  </span>


                </div>



                <XPBar

                  current={child.xp}

                  max={child.maxXp}

                  color={child.color}

                />


              </div>

              <div
                className="
                grid
                grid-cols-3
                gap-2
                mb-5
                "
              >


                <Stat
                  emoji="🔥"
                  value={`${child.streak}d`}
                  label="Streak"
                />


                <Stat
                  emoji="⭐"
                  value={`${child.coins}`}
                  label="Coins"
                />


                <Stat
                  emoji="✅"
                  value={`${child.tasksComplete}/${child.tasksToday}`}
                  label="Today"
                />


              </div>

              <div
                className="
                flex
                gap-2
                "
              >


                <button

                  onClick={() =>
                    onKidMode(child)
                  }

                  className="
                  flex-1
                  py-2.5
                  text-sm
                  font-bold
                  rounded-xl
                  border-2
                  hover:bg-gray-50
                  text-gray-700
                  "

                  style={{
                    borderColor:
                      child.color + "44",
                  }}

                >

                  Enter Kid Mode


                </button>




                <button

  onClick={() => {

    setEditChild(child);
    setShowEditModal(true);

  }}

  className="
  px-3
  py-2.5
  rounded-xl
  border
  border-gray-200
  hover:bg-gray-50
  "

>

                  <Pencil
                    className="w-4 h-4"
                  />

                </button>


              </div>



            </div>


          ))
        }



        {/* ADD CHILD */}

<button

  onClick={() => setShowAddChild(true)}

  className="
  bg-white
  rounded-2xl
  p-6
  shadow-sm
  border-2
  border-dashed
  border-gray-200
  hover:border-indigo-300
  hover:bg-indigo-50/30
  transition-all
  flex
  flex-col
  items-center
  justify-center
  gap-3
  text-gray-400
  hover:text-indigo-600
  min-h-75
  "

>

  <div
    className="
    w-16
    h-16
    rounded-full
    border-2
    border-dashed
    border-current
    flex
    items-center
    justify-center
    "
  >

    <UserPlus
      className="w-7 h-7"
    />

  </div>

  <span
    className="
    text-sm
    font-semibold
    "
  >

    Add a child

  </span>

</button>

</div>

      {showAddChild && (

        <AddChildModal

          onClose={() =>
            setShowAddChild(false)
          }

          onCreated={() => {

            setShowAddChild(false);

            loadChildren();

          }}

        />

      )}


      {showEditModal && editChild && (

        <EditChildModal

          child={editChild}

          onClose={() => {

            setShowEditModal(false);

            setEditChild(null);

          }}

          onUpdated={() => {

            setShowEditModal(false);

            setEditChild(null);

            loadChildren();

          }}

        />

      )}

    </div>

  );

}

function Stat({

  emoji,

  value,

  label,

}: {
  emoji: string;
  value: string;
  label: string;
}) {


  return (

    <div
      className="
      text-center
      bg-gray-50
      rounded-xl
      py-3
      "
    >

      <div>
        {emoji}
      </div>


      <div
        className="
        text-sm
        font-black
        text-gray-900
        "
      >

        {value}

      </div>


      <div
        className="
        text-[10px]
        text-gray-400
        "
      >

        {label}

      </div>


    </div>

  );

}
