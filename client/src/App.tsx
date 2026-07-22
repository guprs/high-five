import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ParentDashboard from "./pages/ParentDashboard";
import KidMode from "./pages/KidMode";

import { registerUser } from "./services/auth";


type View =
  | "login"
  | "register"
  | "parent"
  | "kid";


export default function App(){

  const [view,setView]=useState<View>("login");


  async function handleRegister(data: {
    name: string;
    email: string;
    password: string;
    familyName: string;
  }) {

    try {

      await registerUser(data);

      setView("parent");

    } catch(error){

      console.error("Registration failed:", error);

    }

  }


  return (

    <div className="h-screen w-full">

      {
        view==="login" &&
        <Login
          onLogin={()=>setView("parent")}
          onRegister={()=>setView("register")}
        />
      }


      {
        view==="register" &&
        <Register
          onRegister={handleRegister}
          onBack={()=>setView("login")}
        />
      }


      {
        view==="parent" &&
        <ParentDashboard/>
      }


      {
        view==="kid" &&
        <KidMode/>
      }


    </div>

  );
}