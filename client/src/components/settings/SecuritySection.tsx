import FamilyPinCard from "./FamilyPinCard";


export default function SecuritySection(){

  return (

    <div className="space-y-4">

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

        <h3 className="font-semibold mb-4">
          Security
        </h3>

        <p className="text-sm text-gray-500">
          Manage passwords and family access
        </p>

      </div>


      <FamilyPinCard />

    </div>

  );

}