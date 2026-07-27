import { motion } from "framer-motion";

import { KID_THEMES } from "../../data/themes";


interface Props {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}


export default function KidThemeSelector({
  currentTheme,
  onThemeChange,
}: Props) {


  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 15,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="
        rounded-3xl
        p-4
        bg-black/10
        backdrop-blur-xl
        border
        border-white/10
      "

    >


      <h3

        className="
          text-white
          font-black
          text-lg
          mb-4
          text-center
        "

      >

        🎨 Choose Your World

      </h3>



      <div

        className="
          flex
          flex-wrap
          justify-center
          gap-4
        "

      >

        {
          KID_THEMES.map(theme => (

            <motion.button

              key={theme.id}

              onClick={() =>
                onThemeChange(theme.id)
              }


              whileHover={{
                scale: 1.08,
              }}


              whileTap={{
                scale: 0.92,
              }}


              className={`
                relative
                flex
                flex-col
                items-center
                gap-1
              `}

            >


              <div

                className={`
                  w-20
                  h-20
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-4xl
                  shadow-lg
                  border
                  transition-all
                  
                  ${
                    currentTheme === theme.id

                    ?

                    `
                    border-white
                    ring-4
                    ring-white/50
                    scale-110
                    `

                    :

                    `
                    border-white/20
                    `
                  }
                `}

                style={{

                  background:
                    currentTheme === theme.id

                    ?

                    `
                    linear-gradient(
                      135deg,
                      ${theme.from},
                      ${theme.to}
                    )
                    `

                    :

                    "rgba(255,255,255,0.12)"

                }}

              >

                {theme.emoji}


                {
                  currentTheme === theme.id && (

                    <span

                      className="
                        absolute
                        -top-1
                        -right-1
                        w-5
                        h-5
                        rounded-full
                        bg-white
                        text-indigo-600
                        text-xs
                        font-black
                        flex
                        items-center
                        justify-center
                        shadow
                      "

                    >

                      ✓

                    </span>

                  )
                }


              </div>



              <span

                className="
                  text-white
                  text-[11px]
                  font-bold
                  text-center
                  max-w-[80px]
                  truncate
                "

              >

                {
                  theme.name
                }

              </span>


            </motion.button>

          ))
        }


      </div>


    </motion.div>

  );

}
