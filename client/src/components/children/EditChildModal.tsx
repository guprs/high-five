import { updateChild } from "../../services/child";
import { useState } from "react";

import type { Child } from "../../types/dashboard";


interface Props {

  child: Child;

  onClose: () => void;

  onUpdated: () => void;

}



const THEMES = [
  {
    id: "princess",
    name: "Princess Kingdom",
    emoji: "👑",
  },
  {
    id: "space",
    name: "Space Adventure",
    emoji: "🚀",
  },
  {
    id: "animals",
    name: "Animal World",
    emoji: "🐼",
  },
  {
    id: "pirates",
    name: "Pirate Island",
    emoji: "🏴‍☠️",
  },
  {
    id: "dinosaurs",
    name: "Dinosaur Land",
    emoji: "🦖",
  },
];



const AVATARS = [
  "🐱",
  "🐶",
  "🦊",
  "🐼",
  "🐰",
  "🦄",
];



export default function EditChildModal({

  child,

  onClose,

  onUpdated,

}: Props) {



  const [name,setName] =
    useState(child.name);


  const [age,setAge] =
    useState(child.age);


  const [theme,setTheme] =
    useState(child.theme);


  const [emoji,setEmoji] =
    useState(child.avatar);



  async function handleSave(){


    try {


      await updateChild(
        child.id,
        {
          name,
          age,
          theme,
          emoji,
        }
      );


      onUpdated();


    } catch(error){


      console.error(
        "Failed updating child:",
        error
      );


    }


  }





  return (

    <div
      className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      "
    >


      <div
        className="
        bg-white
        rounded-2xl
        p-6
        w-full
        max-w-md
        shadow-xl
        max-h-[90vh]
        overflow-y-auto
        "
      >


        <h2
          className="
          text-xl
          font-bold
          mb-5
          "
        >

          Edit {child.name}

        </h2>





        <div className="space-y-5">



          {/* NAME */}

          <div>

            <label
              className="
              text-sm
              font-semibold
              "
            >

              Name

            </label>


            <input

              value={name}

              onChange={(e)=>
                setName(e.target.value)
              }

              className="
              mt-1
              w-full
              border
              rounded-xl
              px-3
              py-2
              "

            />

          </div>






          {/* AGE */}

          <div>

            <label
              className="
              text-sm
              font-semibold
              "
            >

              Age

            </label>


            <input

              type="number"

              value={age}

              onChange={(e)=>
                setAge(
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
              "

            />

          </div>







          {/* AVATAR */}

          <div>

            <label
              className="
              text-sm
              font-semibold
              "
            >

              Avatar

            </label>


            <div
              className="
              flex
              gap-2
              flex-wrap
              mt-2
              "
            >

              {
                AVATARS.map(item=>(

                  <button

                    key={item}

                    onClick={()=>
                      setEmoji(item)
                    }

                    className={`
                    text-2xl
                    w-12
                    h-12
                    rounded-xl
                    border
                    ${
                      emoji === item
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                    }
                    `}

                  >

                    {item}

                  </button>

                ))
              }

            </div>

          </div>







          {/* THEME DROPDOWN */}

<div>

  <label
    className="
    text-sm
    font-semibold
    text-gray-700
    "
  >
    Theme
  </label>


  <select

    value={theme}

    onChange={(e)=>
      setTheme(e.target.value)
    }

    className="
    mt-1
    w-full
    border
    border-gray-200
    rounded-xl
    px-3
    py-2.5
    bg-white
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
    "

  >

    {
      THEMES.map(item => (

        <option
          key={item.id}
          value={item.name}
        >
          {item.emoji} {item.name}
        </option>

      ))
    }


  </select>


</div>




        </div>







        <div
          className="
          flex
          justify-end
          gap-3
          mt-6
          "
        >


          <button

            onClick={onClose}

            className="
            px-4
            py-2
            rounded-xl
            border
            "

          >

            Cancel

          </button>




          <button

            onClick={handleSave}

            className="
            px-4
            py-2
            rounded-xl
            bg-indigo-600
            text-white
            font-semibold
            "

          >

            Save Changes

          </button>


        </div>



      </div>


    </div>

  );

}