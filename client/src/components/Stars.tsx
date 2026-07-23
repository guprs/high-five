import { Star } from "lucide-react";


interface Props {

  level:number;

}



export function Stars({
  level,
}:Props){


  return (

    <div className="flex gap-0.5">

      {[1,2,3].map(star=>(

        <Star

          key={star}

          className={`
            w-3
            h-3
            ${
              star <= level
              ?
              "text-amber-400 fill-amber-400"
              :
              "text-gray-200 fill-gray-200"
            }
          `}

        />

      ))}

    </div>

  );

}