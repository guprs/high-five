import { useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";

import {
  ParentSidebar,
} from "../components/dashboard/ParentSidebar";

import DashboardTab from "../components/dashboard/DashboardTab";

import ChildrenTab from "../components/children/ChildrenTab";
import SettingsTab from "../components/settings/SettingsTab";
import TasksPage from "./Tasks";
import RewardsPage from "./Rewards";
import AnalyticsPage from "./Analytics";
import CalendarPage from "./Calendar";

import type {
  ParentTab,
  Child,
} from "../types/dashboard";

import KidMode from "../components/kid/KidMode";



export default function ParentDashboard() {


  const [tab, setTab] =
    useState<ParentTab>("dashboard");


  const [collapsed, setCollapsed] =
    useState(false);

    const [kidModeChild, setKidModeChild] =
  useState<Child | null>(null);



  function handleKidMode(child: Child) {

  setKidModeChild(child);

}

function handleExitKidMode(){

  setKidModeChild(null);

}



  function handleLogout(){

    console.log("logout");

   
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

        return <TasksPage />;


      case "rewards":

        return <RewardsPage />;


      case "analytics":

        return <AnalyticsPage />;



      case "calendar":

        return <CalendarPage />;



      case "settings":

  return (

    <SettingsTab />

  );


      default:

        return null;


    }

  }


if (kidModeChild) {

  return (

    <KidMode
      child={kidModeChild}
      onExit={handleExitKidMode}
    />

  );

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
