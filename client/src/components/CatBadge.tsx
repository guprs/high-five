interface Props {
  category: string;
}

const colors: Record<string, string> = {

  "🏠 Home":
    "bg-blue-100 text-blue-700",

  Home:
    "bg-blue-100 text-blue-700",


  "📚 School":
    "bg-yellow-100 text-yellow-700",

  School:
    "bg-yellow-100 text-yellow-700",


  "💚 Health":
    "bg-green-100 text-green-700",

  Health:
    "bg-green-100 text-green-700",


  "🐶 Pets":
    "bg-orange-100 text-orange-700",

  Pets:
    "bg-orange-100 text-orange-700",


  Other:
    "bg-gray-100 text-gray-600",

};



export function CatBadge({
  category,
}: Props) {


  return (

    <span
      className={`
      px-2
      py-1
      rounded-full
      text-[10px]
      font-semibold

      ${
        colors[category]
        ??
        "bg-gray-100 text-gray-600"
      }

      `}
    >

      {category}

    </span>

  );

}