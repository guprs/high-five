interface Props {

  value:boolean;

  onChange:(value:boolean)=>void;

}



export function Toggle({
  value,
  onChange,
}:Props){


  return (

    <button

      onClick={() => onChange(!value)}

      className={`
        relative
        w-11
        h-6
        rounded-full
        transition-colors
        ${
          value
          ?
          "bg-indigo-600"
          :
          "bg-gray-200"
        }
      `}

    >

      <div

        className={`
          absolute
          top-0.5
          left-0.5
          w-5
          h-5
          rounded-full
          bg-white
          shadow
          transition-transform
          ${
            value
            ?
            "translate-x-5"
            :
            "translate-x-0"
          }
        `}

      />


    </button>

  );

}