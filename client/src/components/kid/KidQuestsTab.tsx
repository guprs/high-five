import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import type { Child } from "../../types/dashboard";
import type { KidTheme } from "../../data/themes";


interface Props {
  child: Child;
  theme: KidTheme;
  onComplete: () => void;
}



const INITIAL_QUESTS = [
  {
    id:1,
    title:"Clean your room",
    emoji:"🧹",
    xp:20,
    coins:10,
    from:"#8B5CF6",
    to:"#6366F1",
    completed:false,
  },

  {
    id:2,
    title:"Read a book",
    emoji:"📚",
    xp:30,
    coins:15,
    from:"#10B981",
    to:"#059669",
    completed:false,
  },

  {
    id:3,
    title:"Help parents",
    emoji:"❤️",
    xp:25,
    coins:12,
    from:"#EC4899",
    to:"#F43F5E",
    completed:false,
  },

];

const WORLD_PROGRESS: Record<string, { companion: string; companionName: string; destination: string; reward: string }> = {
  space: { companion: "🤖", companionName: "Nova", destination: "Moon Base", reward: "Galaxy Explorer badge" },
  princess: { companion: "🦄", companionName: "Lumi", destination: "Crystal Castle", reward: "Royal crown" },
  ocean: { companion: "🐢", companionName: "Bubbles", destination: "Coral Palace", reward: "Pearl treasure" },
  jungle: { companion: "🦁", companionName: "Kito", destination: "Sun Temple", reward: "Jungle hero badge" },
  rainbow: { companion: "🦄", companionName: "Spark", destination: "Cloud Kingdom", reward: "Rainbow trail" },
  dino: { companion: "🦕", companionName: "Rex", destination: "Volcano Valley", reward: "Fossil treasure" },
  pirate: { companion: "🦜", companionName: "Captain Pip", destination: "Hidden Cove", reward: "Treasure chest" },
  pixel: { companion: "👾", companionName: "Byte", destination: "Level 8 Castle", reward: "Pixel power-up" },
};

const SKILLS = [
  { name: "Teamwork", icon: "🤝" },
  { name: "Knowledge", icon: "📚" },
  { name: "Kindness", icon: "💛" },
];





export default function KidQuestsTab({

  child,
  theme,
  onComplete,

}:Props){



  const [quests,setQuests] =
    useState(INITIAL_QUESTS);

  const [lastCompleted, setLastCompleted] = useState<number | null>(null);




  function completeQuest(id:number){

    if (quests.find((quest) => quest.id === id)?.completed) return;


    setQuests(prev =>

      prev.map(q =>

        q.id === id

        ?

        {
          ...q,
          completed:true
        }

        :

        q

      )

    );

    setLastCompleted(id);


    onComplete();

  }





  const completed =
    quests.filter(q => q.completed).length;



  const progress =
    Math.round(
      (completed / quests.length) * 100
    );

  const encouragement =
    completed === quests.length
      ? `Legendary work, ${child.name}! You completed the whole ${theme.name} route — a big reward is yours! 🏆`
      : completed === quests.length - 1
        ? `So close, ${child.name}! One more checkpoint unlocks your big reward! 🎁`
        : `Amazing job, ${child.name}! ${quests.length - completed} more checkpoint${quests.length - completed === 1 ? "" : "s"} until a big reward! ✨`;

  const world = WORLD_PROGRESS[theme.id] ?? WORLD_PROGRESS.space;
  const companionEnergy = Math.round((completed / quests.length) * 100);






  return (

    <div

      className="
      space-y-5
      overflow-x-hidden
      "

    >





      {/* Progress */}

      <motion.div

        initial={{
          opacity:0,
          y:-20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        className="
        rounded-3xl
        p-5
        bg-white/15
        backdrop-blur-md
        border
        border-white/20
        shadow-xl
        "

      >

        <div
          className="
          flex
          justify-between
          mb-3
          "
        >

          <span
            className="
            text-white/80
            text-sm
            font-bold
            "
          >

            Today's Quests ⚔️

          </span>



          <span
            className="
            text-white
            text-sm
            font-black
            "
          >

            {completed}/{quests.length}

          </span>


        </div>





        <div
          className="
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
            bg-linear-to-r
            from-green-400
            to-emerald-500
            "

            animate={{
              width:`${progress}%`
            }}

            transition={{
              duration:.6
            }}

          />

        </div>



        <div
          className="
          mt-2
          text-xs
          text-white/60
          font-bold
          "
        >

          {progress}% complete

        </div>


      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/20 bg-white/15 p-4 shadow-xl backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -7, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-4xl shadow-inner"
          >
            {world.companion}
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-white">{world.companionName} is travelling with you!</p>
            <p className="mt-0.5 text-xs font-semibold text-white/70">Complete quests to give them energy for {world.destination}.</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
              <motion.div
                animate={{ width: `${companionEnergy}%` }}
                className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400"
              />
            </div>
          </div>
          <span className="text-xs font-black text-yellow-200">{companionEnergy}%</span>
        </div>
      </motion.section>

      <section className="rounded-3xl border border-white/15 bg-black/10 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">This week’s chapter</p>
            <h2 className="text-lg font-black text-white">Reach {world.destination}</h2>
          </div>
          <span className="rounded-full bg-yellow-300/20 px-2 py-1 text-[10px] font-black text-yellow-100">🎁 {world.reward}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {SKILLS.map((skill, index) => (
            <div key={skill.name} className="rounded-2xl bg-white/10 p-2 text-center">
              <div className="text-xl">{skill.icon}</div>
              <div className="text-[10px] font-bold text-white">{skill.name}</div>
              <div className="mt-1 flex justify-center gap-0.5">
                {[0, 1, 2].map((star) => <span key={star} className={star < completed && star === index ? "text-yellow-300" : "text-white/25"}>★</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/15 p-4 shadow-xl backdrop-blur-sm"
      >
        <div className="absolute inset-x-8 top-12 h-1 rounded-full bg-white/25" />
        <div className="relative mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">{theme.name} map</p>
            <h2 className="text-lg font-black text-white">Your adventure trail</h2>
          </div>
          <span className="text-3xl">{theme.emoji}</span>
        </div>
        <div className="relative grid grid-cols-3 gap-2">
          {quests.map((quest, index) => {
            const reached = quest.completed;
            const landmark = theme.decorations[index % theme.decorations.length];

            return (
              <div key={quest.id} className="min-w-0 text-center">
                <motion.div
                  animate={reached ? { scale: [1, 1.15, 1] } : { y: [0, -4, 0] }}
                  transition={{ duration: reached ? 0.45 : 2.2, repeat: reached ? 0 : Infinity, delay: index * 0.2 }}
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-2xl shadow-lg ${
                    reached ? "border-white bg-emerald-400" : "border-white/50 bg-white/20"
                  }`}
                >
                  {reached ? "✓" : landmark}
                </motion.div>
                <p className="mt-2 truncate text-[10px] font-bold text-white/90">{quest.title}</p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {lastCompleted !== null && (
        <motion.div
          key={lastCompleted}
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="rounded-3xl border border-white/25 bg-white/20 p-4 text-center shadow-lg backdrop-blur-sm"
        >
          <div className="mb-1 text-3xl">{completed === quests.length ? "🏆" : "🌟"}</div>
          <p className="text-sm font-black text-white">{encouragement}</p>
          {completed < quests.length && (
            <p className="mt-1 text-xs font-semibold text-white/70">📡 Mission sent to Mission Control for a grown-up to celebrate. Keep exploring — the next stop is waiting for you.</p>
          )}
        </motion.div>
      )}








      {/* QUEST CARDS */}


      <div
        className="
        space-y-4
        px-1
        "
      >


        {
          quests.map((quest,index)=>(


            <motion.div

              key={quest.id}

              layout

              initial={{
                opacity:0,
                y:25
              }}

              animate={{
                opacity:
                quest.completed
                ?
                .7
                :
                1,

                y:0
              }}

              transition={{
                delay:index*.08,
                type:"spring",
                stiffness:250,
                damping:22
              }}

            >


              <div

                className="
                rounded-3xl
                p-5
                border
                border-white/20
                shadow-xl
                "

                style={{

                  background:

                  `
                  linear-gradient(
                  135deg,
                  ${quest.from},
                  ${quest.to}
                  )
                  `

                }}

              >


                <div

                  className="
                  flex
                  items-center
                  gap-4
                  "

                >



                  <div

                    className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-white/20
                    flex
                    items-center
                    justify-center
                    text-4xl
                    shadow-inner
                    "

                  >

                    {quest.emoji}


                  </div>





                  <div
                    className="
                    flex-1
                    "
                  >

                    <h3

                      className="
                      text-white
                      font-black
                      text-lg
                      "

                      style={{
                        fontFamily:"Nunito, sans-serif"
                      }}

                    >

                      {quest.title}

                    </h3>



                    <div
                      className="
                      flex
                      gap-3
                      mt-1
                      text-sm
                      font-bold
                      text-white/80
                      "
                    >

                      <span>
                        ⚡ +{quest.xp} XP
                      </span>

                      <span>
                        ⭐ +{quest.coins}
                      </span>


                    </div>


                  </div>







                  {
                    quest.completed

                    ?

                    <div

                      className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-white/30
                      flex
                      items-center
                      justify-center
                      text-3xl
                      "

                    >

                      ✅

                    </div>


                    :


                    <motion.button


                      whileHover={{
                        scale:1.04
                      }}

                      whileTap={{
                        scale:.92
                      }}

                      transition={{
                        type:"spring",
                        stiffness:300,
                        damping:20
                      }}


                      onClick={() =>
                        completeQuest(quest.id)
                      }


                      className="
                      w-14
                      h-14
                      bg-white
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      shadow-xl
                      "

                    >

                      <Check
                        className="w-7 h-7"
                        style={{
                          color:quest.from
                        }}
                      />


                    </motion.button>


                  }



                </div>


              </div>



            </motion.div>


          ))
        }


      </div>






    </div>


  );

}
