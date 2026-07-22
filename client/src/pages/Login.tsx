import { useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";


interface LoginProps {
  onLogin: (data: {
    email: string;
    password: string;
  }) => Promise<string | void>;

  onRegister: () => void;
}


export default function Login({
  onLogin,
  onRegister,
}: LoginProps) {


  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setError("");
    setLoading(true);


    const errorMessage = await onLogin({
      email,
      password,
    });


    if(errorMessage){
      setError(errorMessage);
    }


    setLoading(false);

  }



  return (

    <div className="h-screen flex">


      {/* LEFT SIDE */}

      <div
        className="
        hidden lg:flex
        lg:w-[46%]
        bg-linear-to-br
        from-indigo-600
        via-indigo-700
        to-violet-800
        flex-col
        items-center
        justify-center
        p-12
        relative
        overflow-hidden
        "
      >


        <div className="absolute inset-0">

          {[...Array(6)].map((_, i)=>(

            <div
              key={i}
              className="
              absolute
              rounded-full
              border
              border-white/10
              "
              style={{
                width: 140 + i * 110,
                height: 140 + i * 110,
                top:"50%",
                left:"50%",
                transform:"translate(-50%, -50%)"
              }}
            />

          ))}

        </div>



        <div className="relative z-10 text-center">


          <motion.div
            className="text-8xl mb-5"
            initial={{scale:0}}
            animate={{scale:1}}
          >
            🙌
          </motion.div>


          <h1 className="text-4xl font-black text-white mb-3">
            High Five!
          </h1>


          <p className="text-indigo-200 text-base max-w-xs leading-relaxed">
            The family gamification platform where chores become adventures and responsibility becomes a superpower.
          </p>



          <div className="mt-10 grid grid-cols-3 gap-3">

            {[
              ["⭐","XP & Levels"],
              ["🔥","Daily Streaks"],
              ["🏆","Achievements"]
            ].map(([emoji,label])=>(

              <div
                key={label}
                className="
                bg-white/10
                backdrop-blur-sm
                rounded-2xl
                p-4
                border
                border-white/10
                "
              >

                <div className="text-3xl mb-1.5">
                  {emoji}
                </div>

                <div className="text-xs text-indigo-200 font-semibold">
                  {label}
                </div>

              </div>

            ))}

          </div>




          <div className="mt-8 flex flex-col gap-2 text-left">

            {[
              "3 active children profiles",
              "14-day streak record",
              "Family earned 7,940 XP"
            ].map(item=>(

              <div
                key={item}
                className="
                flex items-center gap-2
                text-indigo-200
                text-sm
                "
              >

                <CheckCircle
                  className="
                  w-4
                  h-4
                  text-emerald-400
                  "
                />

                <span>
                  {item}
                </span>

              </div>

            ))}

          </div>


        </div>


      </div>





      {/* RIGHT SIDE */}

      <div className="flex-1 flex items-center justify-center p-8 bg-white">


        <div className="w-full max-w-sm">


          <div className="mb-8">


            <div className="text-5xl mb-4 lg:hidden">
              🙌
            </div>


            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h2>


            <p className="text-gray-500 text-sm mt-1">
              Sign in to your family dashboard
            </p>


          </div>





          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>


              <input

                type="email"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

                className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:bg-white
                "
              />

            </div>





            <div>

              <div className="flex justify-between mb-1.5">

                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>


                <button
                  type="button"
                  className="
                  text-xs
                  text-indigo-600
                  "
                >
                  Forgot password?
                </button>


              </div>




              <div className="relative">


                <input

                  type={showPass ? "text":"password"}

                  value={password}

                  onChange={(e)=>setPassword(e.target.value)}

                  className="
                  w-full
                  px-4
                  py-3
                  pr-10
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  "
                />



                <button

                  type="button"

                  onClick={()=>setShowPass(!showPass)}

                  className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  "

                >

                  {
                    showPass
                    ?
                    <EyeOff className="w-4 h-4"/>
                    :
                    <Eye className="w-4 h-4"/>
                  }


                </button>


              </div>


            </div>


            {
              error &&
              <div
                className="
                bg-red-50
                text-red-600
                text-sm
                rounded-xl
                p-3
                "
              >
                {error}
              </div>
            }




            <motion.button

              type="submit"

              disabled={loading}

              whileHover={{scale: loading ? 1 : 1.01}}

              whileTap={{scale: loading ? 1 : 0.99}}

              className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              disabled:bg-indigo-300
              text-white
              font-semibold
              py-3
              rounded-xl
              text-sm
              "
            >

              {
                loading
                ?
                "Signing in..."
                :
                "Sign In"
              }

            </motion.button>


          </form>





          <p className="text-center text-sm text-gray-500 mt-6">

            New to High Five?

            {" "}

            <button

              onClick={onRegister}

              className="
              text-indigo-600
              font-semibold
              "

            >
              Create an account
            </button>


          </p>



        </div>


      </div>


    </div>

  );
}