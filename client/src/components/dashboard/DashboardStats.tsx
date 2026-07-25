import { CheckCircle, Flame, Zap, Gift } from "lucide-react";
import { motion } from "framer-motion";


interface Props {
  totalDone: number;
  totalToday: number;
  percentage: number;
}


export default function DashboardStats({
  totalDone,
  totalToday,
  percentage,
}: Props) {


  const stats = [
    {
      label: "Tasks Done Today",
      value: `${totalDone}/${totalToday}`,
      sub: `${percentage}% complete`,
      Icon: CheckCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },

    {
      label: "Top Streak",
      value: "14 days 🔥",
      sub: "Lucas leading",
      Icon: Flame,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },

    {
      label: "Family XP Earned",
      value: "+680 XP",
      sub: "This week",
      Icon: Zap,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },

    {
      label: "Pending Rewards",
      value: "2 requests",
      sub: "Waiting approval",
      Icon: Gift,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
    },
  ];



  return (

    <div
      className="
      grid grid-cols-2 xl:grid-cols-4 gap-4
      "
    >

      {
        stats.map(stat => {

          const Icon = stat.Icon;


          return (

            <motion.div

              key={stat.label}

              whileHover={{ y: -2 }}

              className="
              bg-white
              rounded-2xl
              p-5
              border
              border-gray-100
              shadow-sm
              "

            >

              <div
                className={`
                w-10 h-10
                rounded-xl
                ${stat.iconBg}
                flex
                items-center
                justify-center
                mb-3
                `}
              >

                <Icon
                  className={`
                  w-5 h-5
                  ${stat.iconColor}
                  `}
                />

              </div>


              <div
                className="
                text-xl
                font-bold
                text-gray-900
                "
              >
                {stat.value}
              </div>


              <div
                className="
                text-xs
                text-gray-500
                mt-0.5
                "
              >
                {stat.label}
              </div>


              <div
                className="
                text-xs
                text-gray-400
                mt-1
                "
              >
                {stat.sub}
              </div>


            </motion.div>

          );

        })
      }

    </div>

  );

}