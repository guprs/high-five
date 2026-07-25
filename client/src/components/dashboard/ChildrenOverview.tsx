import type { Child } from "../../types/dashboard";
import { ChildAvatar } from "../ChildAvatar";
import { XPBar } from "../XPBar";
import { Flame } from "lucide-react";


interface Props {
  children: Child[];
}


export default function ChildrenOverview({
  children,
}: Props) {


  return (

    <div
      className="
      xl:col-span-2
      bg-white
      rounded-2xl
      p-5
      shadow-sm
      border
      border-gray-100
      "
    >


      <div
        className="
        flex
        items-center
        justify-between
        mb-5
        "
      >

        <h3
          className="
          font-semibold
          text-gray-900
          "
        >
          Children Overview
        </h3>


        <span
          className="
          text-xs
          text-gray-400
          "
        >
          Today
        </span>


      </div>





      <div className="space-y-5">


        {
          children.map(child => (

            <div
              key={child.id}
              className="
              flex
              items-center
              gap-4
              "
            >


              {/* AVATAR */}

              <ChildAvatar
                child={child}
                size="md"
              />





              <div
                className="
                flex-1
                min-w-0
                "
              >



                {/* NAME + STATS */}

                <div
                  className="
                  flex
                  items-center
                  justify-between
                  mb-1.5
                  "
                >


                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    "
                  >

                    <span
                      className="
                      text-sm
                      font-bold
                      text-gray-900
                      "
                    >
                      {child.name}
                    </span>


                    <span
                      className="
                      text-xs
                      text-gray-400
                      font-medium
                      "
                    >
                      Lv.{child.level}
                    </span>


                  </div>





                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    text-xs
                    "
                  >


                    <span
                      className="
                      flex
                      items-center
                      gap-1
                      text-orange-500
                      font-semibold
                      "
                    >

                      <Flame
                        className="w-3 h-3"
                      />

                      {child.streak}d

                    </span>




                    <span
                      className="
                      text-amber-600
                      font-semibold
                      "
                    >
                      ⭐ {child.coins}
                    </span>




                    <span
                      className="
                      text-gray-600
                      font-bold
                      "
                    >
                      {child.tasksComplete}/{child.tasksToday}
                    </span>



                  </div>



                </div>







                {/* XP BAR */}

                <XPBar
                  current={child.xp}
                  max={child.maxXp}
                  color={child.color}
                />





                {/* XP FOOTER */}

                <div
                  className="
                  flex
                  justify-between
                  mt-1
                  "
                >

                  <span
                    className="
                    text-[10px]
                    text-gray-400
                    "
                  >
                    {child.xp.toLocaleString()} XP
                  </span>



                  <span
                    className="
                    text-[10px]
                    text-gray-400
                    "
                  >

                    {(child.maxXp - child.xp).toLocaleString()}
                    {" "}
                    XP to Lv.{child.level + 1}

                  </span>


                </div>




              </div>



            </div>

          ))
        }



      </div>



    </div>

  );

}