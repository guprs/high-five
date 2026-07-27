import { useState } from "react";
import { motion } from "framer-motion";

import type { Child } from "../../types/dashboard";
import type { KidTheme } from "../../data/themes";


interface Props {
  child: Child;
  theme: KidTheme;
}



const ITEMS = [
  {
    id:1,
    title:"Ice Cream",
    emoji:"🍦",
    cost:20,
  },

  {
    id:2,
    title:"Movie Night",
    emoji:"🎬",
    cost:50,
  },

  {
    id:3,
    title:"New Toy",
    emoji:"🧸",
    cost:100,
  },

  {
    id:4,
    title:"Choose Dinner",
    emoji:"🍕",
    cost:80,
  },

  {
    id:5,
    title:"Extra Game Time",
    emoji:"🎮",
    cost:150,
  },

  {
    id:6,
    title:"Adventure Day",
    emoji:"🏕️",
    cost:300,
  },
];





export default function KidShopTab({

  child,

  theme,

}:Props){



  const [coins,setCoins] =
    useState(child.coins);



  const [bought,setBought] =
    useState<number[]>([]);





  function buyItem(
    id:number,
    cost:number
  ){

    if(
      coins >= cost &&
      !bought.includes(id)
    ){

      setCoins(
        prev => prev - cost
      );


      setBought(prev => [
        ...prev,
        id
      ]);

    }

  }





  return (

    <div

      className="
      space-y-5
      overflow-x-hidden
      "

    >





      {/* COINS CARD */}


      <motion.div

        initial={{
          opacity:0,
          y:-20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:.4
        }}


        className="
        rounded-3xl
        p-5
        border
        border-white/20
        bg-white/15
        backdrop-blur-md
        shadow-xl
        flex
        justify-between
        items-center
        "

      >


        <div>


          <p

            className="
            text-white/70
            font-bold
            text-sm
            uppercase
            "

          >

            Your Coins

          </p>




          <h2

            className="
            text-yellow-300
            font-black
            text-4xl
            "

            style={{
              fontFamily:theme.font
            }}

          >

            ⭐ {coins}

          </h2>


        </div>





        <div

          className="
          text-6xl
          "

        >

          🛍️

        </div>


      </motion.div>








      {/* SHOP ITEMS */}


      <div

        className="
        grid
        grid-cols-2
        gap-4
        px-1
        py-2
        "

      >



        {
          ITEMS.map(item => {


            const purchased =
              bought.includes(item.id);



            const canBuy =
              coins >= item.cost;





            return (



              <motion.div


                key={item.id}


                layout



                whileHover={{

                  scale:
                  canBuy && !purchased
                  ?
                  1.02
                  :
                  1

                }}



                whileTap={{

                  scale:.97

                }}



                transition={{

                  type:"spring",

                  stiffness:300,

                  damping:20

                }}



                className="
                rounded-3xl
                p-5
                text-center
                border
                border-white/20
                shadow-lg
                "

                style={{


                  background:

                  purchased

                  ?

                  "rgba(34,197,94,.75)"

                  :

                  `
                  linear-gradient(
                  135deg,
                  ${theme.cardFrom},
                  ${theme.cardTo}
                  )
                  `


                }}



              >





                <motion.div

                  animate={{

                    y:[0,-4,0]

                  }}

                  transition={{

                    repeat:Infinity,

                    duration:3,

                    ease:"easeInOut"

                  }}

                  className="
                  text-5xl
                  mb-2
                  "

                >

                  {item.emoji}


                </motion.div>







                <h3

                  className="
                  text-white
                  font-black
                  text-sm
                  "

                  style={{

                    fontFamily:
                    theme.font

                  }}

                >

                  {item.title}


                </h3>







                <div

                  className="
                  text-yellow-300
                  font-bold
                  mt-2
                  "

                >

                  ⭐ {item.cost}


                </div>







                {
                  purchased


                  ?


                  <div

                    className="
                    mt-3
                    rounded-xl
                    bg-white/30
                    py-2
                    text-white
                    text-xs
                    font-black
                    "

                  >

                    ✓ Requested


                  </div>



                  :



                  <motion.button


                    whileTap={{
                      scale:.9
                    }}



                    disabled={!canBuy}



                    onClick={() =>
                      buyItem(
                        item.id,
                        item.cost
                      )
                    }



                    className={`

                    mt-3
                    w-full
                    rounded-xl
                    py-2
                    font-black
                    text-xs
                    transition

                    ${
                      canBuy

                      ?

                      "bg-white text-purple-700 shadow-lg"

                      :

                      "bg-white/20 text-white/40"

                    }

                    `}

                  >



                    {

                      canBuy

                      ?

                      "Get it 🎁"

                      :

                      `Need ${item.cost-coins}`

                    }



                  </motion.button>


                }





              </motion.div>


            );


          })
        }



      </div>



    </div>


  );

}