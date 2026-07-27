import SecuritySection from "./SecuritySection";

import NotificationSection from "./NotificationSection";

import AccessibilitySection from "./AccessibilitySection";



export default function SettingsTab() {


  return (

    <div
      className="
      space-y-5
      max-w-2xl
      "
    >

      {/* HEADER */}

      <div>

        <h1
          className="
          text-xl
          font-semibold
          text-gray-900
          "
        >
          Settings
        </h1>


        <p
          className="
          text-sm
          text-gray-400
          "
        >
          Manage your account, security and preferences
        </p>

      </div>




      {/* Parent Profile */}
      <div
        className="
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        border
        border-gray-100
        "
      >

        <h3
          className="
          font-semibold
          text-gray-900
          mb-4
          "
        >
          Parent Profile
        </h3>


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
            bg-indigo-100
            flex
            items-center
            justify-center
            text-indigo-700
            font-black
            "
          >
            JS
          </div>


          <div>

            <div
              className="
              font-bold
              text-gray-900
              "
            >
              Jane Smith
            </div>


            <div
              className="
              text-sm
              text-gray-500
              "
            >
              jane@test.com
            </div>


          </div>

        </div>

      </div>




      <SecuritySection />


      <NotificationSection />


      <AccessibilitySection />


    </div>

  );

}