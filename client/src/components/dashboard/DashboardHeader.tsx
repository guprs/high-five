import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";


export default function DashboardHeader() {


  return (

    <header
      className="
      h-16
      bg-white
      border-b
      border-gray-100
      flex
      items-center
      justify-between
      px-6
      "
    >


      {/* SEARCH */}

      <div
        className="
        flex
        items-center
        gap-2
        bg-gray-50
        rounded-xl
        px-3
        py-2
        w-80
        "
      >

        <Search
          className="
          w-4
          h-4
          text-gray-400
          "
        />


        <input
          type="text"
          placeholder="Search..."
          className="
          bg-transparent
          outline-none
          text-sm
          w-full
          "
        />

      </div>





      {/* ACTIONS */}

      <div
        className="
        flex
        items-center
        gap-4
        "
      >


        <button
          className="
          relative
          text-gray-400
          hover:text-gray-600
          "
        >

          <Bell
            className="
            w-5
            h-5
            "
          />


          <span
            className="
            absolute
            top-0
            right-0
            w-2
            h-2
            bg-red-500
            rounded-full
            "
          />

        </button>




        <button
          className="
          flex
          items-center
          gap-2
          "
        >

          <div
            className="
            w-9
            h-9
            rounded-full
            bg-indigo-100
            flex
            items-center
            justify-center
            text-indigo-700
            font-bold
            text-sm
            "
          >
            JS
          </div>


          <ChevronDown
            className="
            w-4
            h-4
            text-gray-400
            "
          />

        </button>


      </div>


    </header>

  );

}