interface Props {

  value:boolean;

  onChange:(value:boolean)=>void;

  disabled?: boolean;

  label?: string;

}



export function Toggle({
  value,
  onChange,
  disabled = false,
  label,
}:Props){


  return (

    <button

      type="button"

      role="switch"

      aria-checked={value}

      aria-label={label}

      disabled={disabled}

      onClick={() => onChange(!value)}

      className={`
        relative
        w-11
        h-6
        rounded-full
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-60
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
