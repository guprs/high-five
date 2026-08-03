import { motion } from "framer-motion";
import { X } from "lucide-react";

import type { Child } from "../../types/dashboard";
import type { KidTheme } from "../../data/themes";


interface Props {

  child: Child;

  theme: KidTheme;

  onExit: () => void;

}



export default function KidHeader({

  child,

  theme,

  onExit,

}:Props){

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Hello" : "Good evening";
  const journeyMessage = `${theme.emoji} Ready for a ${theme.name} adventure?`;



  return (

    <header

      className="
      relative
      z-10
      flex
      items-center
      justify-between
      px-5
      pt-5
      pb-3
      flex-shrink-0
      "

    >






      {/* CHILD INFO */}


      <div

        className="
        flex
        items-center
        gap-3
        min-w-0
        "

      >




        <motion.div

          whileHover={{

            y:-3

          }}

          transition={{

            type:"spring",

            stiffness:300,

            damping:20

          }}


          className="
          w-14
          h-14
          rounded-2xl
          flex
          items-center
          justify-center
          text-4xl
          shadow-xl
          "

          style={{

            background:

            `${child.color}55`

          }}

        >

          {child.avatar}


        </motion.div>







        <div className="min-w-0">


          <h1

            className="
            text-white
            font-black
            text-2xl
            leading-none
            "

            style={{

              fontFamily:
              "Nunito, sans-serif"

            }}

          >

            {greeting}, {child.name}!


          </h1>






          <div

            className="
            flex
            items-center
            gap-2
            mt-1
            "

          >


            <span

              className="
              text-white/70
              text-xs
              font-bold
              "

            >

              Lv.{child.level}

            </span>





            <span

              className="
              text-yellow-300
              text-xs
              font-bold
              "

            >

              🔥 {child.streak} day streak

            </span>



          </div>

          <p className="mt-1 max-w-64 text-[10px] font-bold leading-tight text-white/65">
            {journeyMessage}
          </p>




        </div>




      </div>









      {/* RIGHT SIDE */}


      <div

        className="
        flex
        items-center
        gap-2
        "

      >





        {/* COINS */}


        <motion.div

          whileHover={{

            y:-3

          }}

          transition={{

            type:"spring",

            stiffness:300,

            damping:20

          }}


          className="
          rounded-2xl
          px-3
          py-2
          bg-black/25
          backdrop-blur-md
          text-center
          shadow-lg
          "

        >


          <div

            className="
            text-yellow-300
            font-black
            text-base
            leading-none
            "

            style={{

              fontFamily:
              "Nunito, sans-serif"

            }}

          >

            ⭐ {child.coins}


          </div>




          <div

            className="
            text-white/50
            text-[9px]
            font-bold
            mt-1
            "

          >

            COINS


          </div>



        </motion.div>









        {/* EXIT BUTTON */}


        <motion.button


          whileHover={{

            y:-3,

            backgroundColor:
            "rgba(0,0,0,.35)"

          }}


          whileTap={{

            scale:.9

          }}


          transition={{

            type:"spring",

            stiffness:300,

            damping:20

          }}



          onClick={onExit}


          className="
          w-11
          h-11
          rounded-2xl
          bg-black/20
          backdrop-blur-md
          flex
          items-center
          justify-center
          text-white/70
          "

        >


          <X
            className="w-5 h-5"
          />


        </motion.button>



      </div>





    </header>


  );

}
