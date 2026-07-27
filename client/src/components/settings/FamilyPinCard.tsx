import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";

import { setFamilyPin } from "../../services/family";


export default function FamilyPinCard() {

  const [showModal, setShowModal] =
    useState(false);

  const [pin, setPin] =
    useState("");

  const [saved, setSaved] =
    useState(false);


  async function handleSave() {

    try {

      await setFamilyPin(pin);

      setSaved(true);
      setPin("");

      setTimeout(() => {
        setSaved(false);
        setShowModal(false);
      }, 1000);


    } catch(error) {

      console.error(
        "Failed setting Kid Mode PIN:",
        error
      );

    }

  }



  return (

    <>

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

        <div
          className="
          flex
          items-center
          justify-between
          "
        >

          <div
            className="
            flex
            items-center
            gap-3
            "
          >

            <div
              className="
              w-10
              h-10
              rounded-xl
              bg-indigo-50
              flex
              items-center
              justify-center
              "
            >

              <Lock
                className="
                w-5
                h-5
                text-indigo-600
                "
              />

            </div>


            <div>

              <h3
                className="
                text-sm
                font-semibold
                text-gray-900
                "
              >
                Kid Mode Security PIN
              </h3>


              <p
                className="
                text-xs
                text-gray-400
                "
              >
                Protect parent access when leaving Kid Mode
              </p>


            </div>


          </div>



          <button

            onClick={() =>
              setShowModal(true)
            }

            className="
            text-sm
            font-semibold
            text-indigo-600
            hover:text-indigo-800
            "
          >

            Set PIN

          </button>


        </div>


      </div>





      {showModal && (

        <div
          className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
          "
        >

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            w-full
            max-w-sm
            "
          >

            <div
              className="
              flex
              items-center
              gap-2
              mb-5
              "
            >

              <KeyRound
                className="
                w-5
                h-5
                text-indigo-600
                "
              />

              <h2
                className="
                font-bold
                text-lg
                "
              >
                Create Kid Mode PIN
              </h2>

            </div>


            <input

              type="password"

              maxLength={8}

              value={pin}

              onChange={(e) =>
                setPin(e.target.value)
              }

              placeholder="4-8 digit PIN"

              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              mb-4
              "
            />



            {saved && (

              <div
                className="
                text-sm
                text-green-600
                mb-3
                "
              >
                PIN saved successfully
              </div>

            )}



            <div
              className="
              flex
              justify-end
              gap-3
              "
            >

              <button

                onClick={() =>
                  setShowModal(false)
                }

                className="
                px-4
                py-2
                rounded-xl
                border
                "
              >
                Cancel

              </button>



              <button

                disabled={
                  pin.length < 4
                }

                onClick={handleSave}

                className="
                px-4
                py-2
                rounded-xl
                bg-indigo-600
                text-white
                disabled:opacity-50
                "
              >
                Save

              </button>


            </div>


          </div>


        </div>

      )}

    </>
  );
}