interface Props {

  current: number;

  max: number;

  color?: string;

  thick?: boolean;

}



export function XPBar({

  current,

  max,

  color = "#4F46E5",

  thick = false,

}: Props) {


  const percentage = Math.min(
    100,
    Math.round((current / max) * 100)
  );


  return (

    <div
      className={`
        w-full
        bg-gray-100
        rounded-full
        overflow-hidden
        ${thick ? "h-3" : "h-1.5"}
      `}
    >

      <div

        className="
          h-full
          rounded-full
          transition-all
          duration-700
        "

        style={{
          width:`${percentage}%`,
          backgroundColor:color,
        }}

      />

    </div>

  );

}