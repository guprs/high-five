import { useState } from "react";

import { updateChild } from "../../services/child";

import type { Child } from "../../types/dashboard";

import { KID_THEMES } from "../../data/themes";



interface Props {

  child: Child;

  onClose: () => void;

  onUpdated: () => void;

}



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



  const [themeId,setThemeId] =
    useState(
      child.themeId || KID_THEMES[0].id
    );



  const [emoji,setEmoji] =
    useState(
      child.avatar
    );






  async function handleSave(){


    try {


      await updateChild(

        child.id,

        {

          name,

          age,

          emoji,

          themeId,

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
        rounded-3xl
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
          font-black
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
              gap-3
              flex-wrap
              mt-2
              "

            >


              {
                AVATARS.map(item => (

                  <button

                    key={item}

                    type="button"

                    onClick={() =>
                      setEmoji(item)
                    }


                    className={`

                    w-12
                    h-12
                    rounded-xl
                    text-2xl
                    border

                    ${
                      emoji === item

                      ?

                      "border-indigo-500 bg-indigo-50"

                      :

                      "border-gray-200"

                    }

                    `}

                  >

                    {item}


                  </button>


                ))
              }



            </div>


          </div>









          {/* THEMES */}




          <div>


            <label

              className="
              text-sm
              font-semibold
              "

            >

              Theme

            </label>





            <div

              className="
              grid
              grid-cols-2
              gap-3
              mt-3
              "

            >



              {
                KID_THEMES.map(theme => (

                  <button


                    key={theme.id}


                    type="button"


                    onClick={() =>
                      setThemeId(theme.id)
                    }



                    className={`

                    rounded-2xl
                    p-4
                    border
                    text-left
                    transition-all


                    ${
                      themeId === theme.id

                      ?

                      "border-indigo-500 ring-2 ring-indigo-200"

                      :

                      "border-gray-200 hover:bg-gray-50"

                    }


                    `}



                    style={{

                      background:

                      themeId === theme.id

                      ?

                      `linear-gradient(
                        135deg,
                        ${theme.from},
                        ${theme.to}
                      )`

                      :

                      "white"

                    }}


                  >



                    <div
                      className="
                      text-3xl
                      "
                    >

                      {theme.emoji}

                    </div>




                    <div

                      className={`

                      text-sm
                      font-black
                      
                      ${
                        themeId === theme.id
                        ?
                        "text-white"
                        :
                        "text-gray-700"
                      }

                      `}

                    >

                      {theme.name}

                    </div>




                  </button>


                ))
              }



            </div>



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
            font-bold
            "

          >

            Save Changes

          </button>



        </div>




      </div>



    </div>


  );

}