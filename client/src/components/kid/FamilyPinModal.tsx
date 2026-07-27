import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  KeyRound,
  X,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  verifyFamilyPin,
} from "../../services/family";


interface Props {

  onSuccess: () => void;

  onCancel: () => void;

}



export default function FamilyPinModal({

  onSuccess,

  onCancel,

}: Props) {


  const [pin,setPin] =
    useState("");

  const [error,setError] =
    useState("");

  const [loading,setLoading] =
    useState(false);



  const inputRef =
    useRef<HTMLInputElement>(null);



  useEffect(()=>{

    inputRef.current?.focus();


    const handler =
      (e:KeyboardEvent)=>{

        if(e.key==="Escape"){
          onCancel();
        }

      };


    window.addEventListener(
      "keydown",
      handler
    );


    return ()=>{

      window.removeEventListener(
        "keydown",
        handler
      );

    };


  },[onCancel]);





  async function unlock(){


    if(pin.length < 4){

      setError(
        "Enter your PIN"
      );

      return;

    }


    try{


      setLoading(true);

      setError("");


      await verifyFamilyPin(pin);


      onSuccess();


    }
    catch{


      setError(
        "Wrong PIN"
      );

      setPin("");

      inputRef.current?.focus();


    }
    finally{

      setLoading(false);

    }

  }





  function submit(
    e:React.FormEvent
  ){

    e.preventDefault();

    unlock();

  }






return (

<div

className="
fixed
inset-0
z-50
flex
items-center
justify-center
px-6

bg-black/40
backdrop-blur-xl

"

>


<motion.div

initial={{
opacity:0,
scale:.85,
y:20
}}

animate={{
opacity:1,
scale:1,
y:0
}}

transition={{
duration:.25
}}

className="

w-full
max-w-[300px]

rounded-[28px]

p-5

bg-white/20
backdrop-blur-2xl

border
border-white/30

shadow-[0_20px_60px_rgba(0,0,0,0.25)]

"

>





{/* CLOSE */}


<button

onClick={onCancel}

className="
absolute
"

>

</button>





<div

className="
flex
justify-end
"

>

<button

onClick={onCancel}

className="
w-8
h-8

rounded-full

bg-white/20

flex
items-center
justify-center

text-white/70

hover:bg-white/30

"

>

<X
className="
w-4
h-4
"/>


</button>


</div>





{/* ICON */}


<div

className="
flex
justify-center
-mt-5
mb-3

"

>

<div

className="

w-14
h-14

rounded-2xl

bg-gradient-to-br
from-indigo-500
to-purple-600

flex
items-center
justify-center

shadow-xl

"

>

<KeyRound

className="
w-7
h-7
text-white
"

/>


</div>


</div>







<h2

className="
text-center
text-white
font-black
text-lg

"

>

Parent Unlock

</h2>



<p

className="
text-center
text-white/60
text-xs
mt-1
mb-5

"

>

Enter your family PIN

</p>








<form
onSubmit={submit}
>


<input


ref={inputRef}


value={pin}


type="password"


inputMode="numeric"


maxLength={6}


onChange={(e)=>{

setPin(
e.target.value.replace(/\D/g,"")
);

setError("");

}}



className="

absolute
opacity-0
pointer-events-none

"


/>





{/* PIN DISPLAY */}



<div

onClick={()=>
inputRef.current?.focus()
}

className="
flex
justify-center
gap-3
mb-4
cursor-text
"

>


{
[0,1,2,3].map(i=>(


<div

key={i}

className={`

w-12
h-12

rounded-2xl

flex
items-center
justify-center

text-xl
font-black

transition-all

${

pin.length>i

?

"bg-white text-indigo-600 scale-105"

:

"bg-white/20 text-white"

}

`}

>

{

pin.length>i

?
"●"
:
""

}


</div>


))

}


</div>







{
error && (

<p

className="
text-center
text-red-200
text-xs
font-semibold
mb-3
"

>

{error}

</p>

)

}







<button

disabled={loading}

className="

w-full

h-11

rounded-2xl

bg-white

text-indigo-700

font-black

text-sm

shadow-lg

hover:scale-[1.02]

transition

disabled:opacity-50

"

>

{

loading
?
"Checking..."
:
"Unlock"

}


</button>




</form>




</motion.div>


</div>


);

}
