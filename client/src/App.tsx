import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ParentDashboard from "./pages/ParentDashboard";

import {
  loginUser,
  registerUser,
} from "./services/auth";


type View =
  | "login"
  | "register"
  | "parent"
  | "kid";



export default function App() {


  const [view, setView] = useState<View>("login");




  function getErrorMessage(error: unknown) {

    const backendError =
      typeof error === "object" && error !== null && "response" in error
        ? (error.response as { data?: { errors?: Record<string, unknown>; message?: string } }).data
        : undefined;



    // Validation errors from Zod
    if (backendError?.errors) {

      const firstError = Object.values(
        backendError.errors
      )[0];


      if (Array.isArray(firstError)) {

        return firstError[0];

      }


      return String(firstError);

    }



    // Normal backend message
    if (backendError?.message) {

      return backendError.message;

    }



    return "Something went wrong. Please try again.";

  }





  async function handleLogin(data: {
    email: string;
    password: string;
  }): Promise<string | void> {


    try {


      await loginUser(data);


      setView("parent");



    } catch (error: unknown) {


      console.error("Login failed:", error);


      return getErrorMessage(error);


    }

  }







  async function handleRegister(data: {
    name: string;
    email: string;
    password: string;
    familyName: string;
  }): Promise<string | void> {


    try {


      await registerUser(data);


      setView("parent");



    } catch (error: unknown) {


      console.error("Registration failed:", error);


      return getErrorMessage(error);


    }

  }






  return (

    <div className="h-screen w-full">


      {
        view === "login" &&

        <Login

          onLogin={handleLogin}

          onRegister={() => setView("register")}

        />

      }




      {
        view === "register" &&

        <Register

          onRegister={handleRegister}

          onBack={() => setView("login")}

        />

      }





      {
        view === "parent" &&

        <ParentDashboard />

      }



    </div>

  );


}
