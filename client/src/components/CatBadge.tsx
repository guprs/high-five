interface Props {

  category:string;

  color:string;

}



export function CatBadge({
  category,
  color,
}:Props){


  const colors:Record<string,string>={

    indigo:
      "bg-indigo-50 text-indigo-700",

    emerald:
      "bg-emerald-50 text-emerald-700",

    amber:
      "bg-amber-50 text-amber-700",

    rose:
      "bg-rose-50 text-rose-700",

  };


  return (

    <span
      className={`
        inline-flex
        items-center
        px-2
        py-0.5
        rounded-full
        text-xs
        font-medium
        ${colors[color] ?? colors.indigo}
      `}
    >

      {category}

    </span>

  );

}