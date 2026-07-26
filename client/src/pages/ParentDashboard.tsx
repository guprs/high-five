import { useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";

import {
  ParentSidebar,
} from "../components/dashboard/ParentSidebar";

import DashboardTab from "../components/dashboard/DashboardTab";

import ChildrenTab from "../components/children/ChildrenTab";

import type {
  ParentTab,
  Child,
} from "../types/dashboard";



export default function ParentDashboard() {


  const [tab, setTab] =
    useState<ParentTab>("dashboard");


  const [collapsed, setCollapsed] =
    useState(false);





  function handleKidMode(child: Child) {

    console.log(
      "Switch to kid mode:",
      child
    );

    // later:
    // open PIN screen
    // setView("kid")

  }





  function handleLogout(){

    console.log("logout");

    // later:
    // remove token
    // return to login

  }








  function renderContent(){


    switch(tab){



      case "dashboard":

        return <DashboardTab />;





      case "children":

        return (

          <ChildrenTab

            onKidMode={handleKidMode}

          />

        );







      case "tasks":

        return (

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            border
            border-gray-100
            "
          >

            Tasks page coming soon

          </div>

        );








      case "rewards":

        return (

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            border
            border-gray-100
            "
          >

            Rewards page coming soon

          </div>

        );








      case "analytics":

        return (

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            border
            border-gray-100
            "
          >

            Analytics page coming soon

          </div>

        );








      case "calendar":

        return (

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            border
            border-gray-100
            "
          >

            Calendar page coming soon

          </div>

        );








      case "settings":

        return (

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            border
            border-gray-100
            "
          >

            Settings page coming soon

          </div>

        );








      default:

        return null;


    }

  }









  return (

    <div
      className="
      flex
      h-screen
      bg-gray-50
      "
    >





      <ParentSidebar


        tab={tab}


        setTab={setTab}


        collapsed={collapsed}


        setCollapsed={setCollapsed}


        onKidMode={handleKidMode}


        onLogout={handleLogout}


      />








      <div
        className="
        flex-1
        flex
        flex-col
        overflow-hidden
        "
      >





        <DashboardHeader />







        <main
          className="
          flex-1
          overflow-y-auto
          p-6
          "
        >


          {renderContent()}


        </main>






      </div>





    </div>

  );

}