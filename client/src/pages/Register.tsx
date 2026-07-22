import { useState } from "react";
import { ChevronLeft } from "lucide-react";

interface RegisterProps {
  onRegister: (data: {
    name: string;
    email: string;
    password: string;
    familyName: string;
  }) => void;

  onBack: () => void;
}


export default function Register({
  onRegister,
  onBack,
}: RegisterProps) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onRegister({
      name: `${firstName} ${lastName}`,
      email,
      password,
      familyName,
    });
  }


  return (
    <div className="h-screen flex">


      {/* LEFT SIDE */}

      <div
        className="
        hidden lg:flex lg:w-[46%]
        bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800
        flex-col items-center justify-center
        p-12
        "
      >

        <div className="text-center">


          <div className="text-8xl mb-5">
            🏠
          </div>


          <h2 className="text-3xl font-black text-white mb-3">
            Set up your family
          </h2>


          <p className="text-indigo-200 text-sm max-w-xs">
            Add your children, create tasks, and start the adventure in minutes.
          </p>



          <div className="mt-8 space-y-3 text-left">

            {[
              "Create parent account",
              "Add your children's profiles",
              "Build your first task list",
              "Watch the magic happen! ✨",
            ].map((item, index) => (

              <div
                key={item}
                className="flex items-center gap-3"
              >

                <div
                  className="
                  w-6 h-6 rounded-full
                  bg-white/20
                  flex items-center justify-center
                  text-xs font-bold text-white
                  "
                >
                  {index + 1}
                </div>


                <span className="text-indigo-100 text-sm">
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


          <button
            onClick={onBack}
            className="
            flex items-center gap-1
            text-sm text-gray-500
            hover:text-gray-700
            mb-8
            "
          >

            <ChevronLeft className="w-4 h-4"/>

            Back to login

          </button>




          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Create your account
          </h2>


          <p className="text-sm text-gray-500 mb-6">
            Set up your family dashboard in seconds
          </p>





          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >



            <div className="grid grid-cols-2 gap-3">


              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First name
                </label>


                <input
                  value={firstName}
                  onChange={(e)=>setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-200
                  bg-gray-50 text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-500
                  "
                />

              </div>




              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last name
                </label>


                <input
                  value={lastName}
                  onChange={(e)=>setLastName(e.target.value)}
                  placeholder="Smith"
                  className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-200
                  bg-gray-50 text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-500
                  "
                />

              </div>


            </div>





            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Family name
              </label>


              <input
                value={familyName}
                onChange={(e)=>setFamilyName(e.target.value)}
                placeholder="The Smith Family"
                className="
                w-full px-4 py-3 rounded-xl
                border border-gray-200
                bg-gray-50 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-indigo-500
                "
              />

            </div>






            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>


              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="parent@family.com"
                className="
                w-full px-4 py-3 rounded-xl
                border border-gray-200
                bg-gray-50 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-indigo-500
                "
              />

            </div>






            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>


              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="
                w-full px-4 py-3 rounded-xl
                border border-gray-200
                bg-gray-50 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-indigo-500
                "
              />

            </div>







            <button
              type="submit"
              className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              font-semibold
              py-3
              rounded-xl
              transition-colors
              text-sm
              "
            >
              Create Family Account
            </button>



          </form>





          <p className="text-xs text-center text-gray-400 mt-4">
            By signing up you agree to our Terms of Service and Privacy Policy
          </p>



        </div>


      </div>


    </div>
  );
}