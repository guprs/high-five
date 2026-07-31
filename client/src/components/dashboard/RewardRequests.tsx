import { PENDING_REWARDS_INIT } from "../../data/dashboardData";


export default function RewardRequests() {


  return (

    <div
      className="
      bg-white
      rounded-2xl
      p-4
      sm:p-5
      shadow-sm
      border
      border-gray-100
      "
    >


      {/* HEADER */}

      <div
        className="
        flex
        items-center
        justify-between
        mb-4
        "
      >

        <h3
          className="
          font-semibold
          text-gray-900
          "
        >
          Reward Requests
        </h3>


        <span
          className="
          bg-rose-100
          text-rose-700
          text-xs
          font-bold
          px-2
          py-0.5
          rounded-full
          "
        >
          {PENDING_REWARDS_INIT.length}
        </span>


      </div>





      <div className="space-y-3">


        {
          PENDING_REWARDS_INIT.map(req => (

            <div
              key={req.id}
              className="
              p-3.5
              bg-gray-50
              rounded-xl
              border
              border-gray-100
              "
            >



              {/* CHILD INFO */}

              <div
                className="
                flex
                items-center
                gap-2
                mb-2
                "
              >

                <span
                  className="
                  text-lg
                  "
                >
                  {req.childEmoji}
                </span>


                <div>

                  <div
                    className="
                    text-sm
                    font-semibold
                    text-gray-900
                    "
                  >
                    {req.childName}
                  </div>


                  <div
                    className="
                    text-[10px]
                    text-gray-400
                    "
                  >
                    {req.requestedAt ?? "Today"}
                  </div>


                </div>


              </div>





              {/* REWARD */}

              <p
                className="
                text-sm
                text-gray-700
                font-medium
                mb-1
                "
              >
                {req.reward}
              </p>



              <p
                className="
                text-xs
                text-amber-600
                font-bold
                mb-3
                "
              >
                ⭐ {req.cost} coins
              </p>





              {/* ACTION BUTTONS */}

              <div
                className="
                flex
                gap-2
                "
              >


                <button
                  className="
                  flex-1
                  py-1.5
                  bg-emerald-500
                  hover:bg-emerald-600
                  text-white
                  text-xs
                  font-bold
                  rounded-lg
                  transition-colors
                  "
                >
                  ✓ Approve
                </button>



                <button
                  className="
                  flex-1
                  py-1.5
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-600
                  text-xs
                  font-bold
                  rounded-lg
                  transition-colors
                  "
                >
                  ✗ Decline
                </button>


              </div>



            </div>

          ))
        }


      </div>



    </div>

  );

}
