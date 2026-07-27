import { motion } from "framer-motion";

import type { KidTheme } from "../../data/themes";


interface Props {
  theme: KidTheme;
}



const ACHIEVEMENTS = [

  {
    id:1,
    emoji:"⭐",
    title:"First Quest",
    desc:"Complete your first quest!",
    unlocked:true,
  },


  {
    id:2,
    emoji:"🔥",
    title:"7 Day Streak",
    desc:"Keep your streak alive!",
    unlocked:true,
  },


  {
    id:3,
    emoji:"🏆",
    title:"Super Helper",
    desc:"Help your family!",
    unlocked:false,
  },


  {
    id:4,
    emoji:"💎",
    title:"Coin Collector",
    desc:"Earn 500 coins",
    unlocked:false,
  },


  {
    id:5,
    emoji:"🚀",
    title:"Explorer",
    desc:"Try every theme",
    unlocked:false,
  },


  {
    id:6,
    emoji:"👑",
    title:"Legend",
    desc:"Reach the highest level",
    unlocked:false,
  },

];





export default function KidAchievementsTab({
  theme,
}:Props){



  const unlocked =
    ACHIEVEMENTS.filter(
      a => a.unlocked
    ).length;



  const progress =
    Math.round(
      (unlocked / ACHIEVEMENTS.length) * 100
    );





  return (

    <div

      className="
      space-y-5
      overflow-x-hidden
      "

    >






      {/* HEADER */}


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
        bg-white/15
        backdrop-blur-md
        border
        border-white/20
        shadow-xl
        text-center
        "

      >


        <div
          className="
          text-6xl
          mb-2
          "
        >

          🏆

        </div>




        <h2

          className="
          text-white
          font-black
          text-3xl
          "

          style={{

            fontFamily:
            "Nunito, sans-serif"

          }}

        >

          Hall of Fame

        </h2>




        <p

          className="
          text-white/70
          text-sm
          font-bold
          mt-1
          "

        >

          {unlocked} / {ACHIEVEMENTS.length}
          {" "}
          badges unlocked

        </p>







        <div

          className="
          mt-4
          w-full
          h-3
          rounded-full
          bg-white/20
          overflow-hidden
          "

        >

          <motion.div

            className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-yellow-400
            to-orange-500
            "

            animate={{
              width:`${progress}%`
            }}

            transition={{
              duration:.7
            }}

          />


        </div>



      </motion.div>









      {/* BADGES */}



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
          ACHIEVEMENTS.map(
            (achievement,index)=>(


              <motion.div


                key={achievement.id}


                layout


                initial={{
                  opacity:0,
                  scale:.85
                }}


                animate={{
                  opacity:1,
                  scale:1
                }}


                transition={{

                  delay:index * .08,

                  type:"spring",

                  stiffness:250,

                  damping:20

                }}



                whileHover={{

                  scale:
                  achievement.unlocked
                  ?
                  1.02
                  :
                  1

                }}


                className={`

                rounded-3xl
                p-5
                text-center
                border
                shadow-lg

                ${
                  achievement.unlocked

                  ?

                  "border-white/20"

                  :

                  "border-white/5 opacity-50"

                }

                `}


                style={{

                  background:

                  achievement.unlocked

                  ?

                  `
                  linear-gradient(
                  135deg,
                  ${theme.cardFrom},
                  ${theme.cardTo}
                  )
                  `

                  :

                  "rgba(255,255,255,.08)"

                }}



              >





                <motion.div

                  animate={{

                    y:
                    achievement.unlocked
                    ?
                    [0,-4,0]
                    :
                    0

                  }}

                  transition={{

                    repeat:
                    achievement.unlocked
                    ?
                    Infinity
                    :
                    0,

                    duration:3

                  }}


                  className={`

                  text-5xl
                  mb-3

                  ${
                    !achievement.unlocked
                    ?
                    "grayscale"
                    :
                    ""
                  }

                  `}

                >

                  {achievement.emoji}


                </motion.div>







                <h3

                  className="
                  text-white
                  font-black
                  text-sm
                  "

                  style={{

                    fontFamily:
                    "Nunito, sans-serif"

                  }}

                >

                  {achievement.title}


                </h3>







                <p

                  className="
                  text-white/70
                  text-xs
                  mt-2
                  font-semibold
                  "

                >

                  {achievement.desc}


                </p>








                {
                  achievement.unlocked


                  ?


                  <div

                    className="
                    mt-3
                    inline-block
                    px-3
                    py-1
                    rounded-full
                    bg-yellow-300/80
                    text-yellow-900
                    text-[10px]
                    font-black
                    "

                  >

                    ✓ UNLOCKED

                  </div>



                  :



                  <div

                    className="
                    mt-3
                    inline-block
                    px-3
                    py-1
                    rounded-full
                    bg-white/20
                    text-white/60
                    text-[10px]
                    font-black
                    "

                  >

                    🔒 LOCKED

                  </div>



                }





              </motion.div>


            )
          )
        }



      </div>



    </div>

  );

}