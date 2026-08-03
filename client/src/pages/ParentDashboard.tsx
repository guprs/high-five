import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import LogoutConfirmationModal from "../components/dashboard/LogoutConfirmationModal";

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
import { SIDEBAR_NAV } from "../data/dashboardData";

import type {
  ParentTab,
  Child,
} from "../types/dashboard";

import KidMode from "../components/kid/KidMode";



interface Props {
  onLogout: () => void;
}

export default function ParentDashboard({ onLogout }: Props) {


  const [tab, setTab] =
    useState<ParentTab>("dashboard");


  const [collapsed, setCollapsed] =
    useState(false);

  const [showMobileMore, setShowMobileMore] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const [kidModeChild, setKidModeChild] =
  useState<Child | null>(null);



  function handleKidMode(child: Child) {

  setKidModeChild(child);

}

function handleExitKidMode(){

  setKidModeChild(null);

}



  function renderContent(){


    switch(tab){



      case "dashboard":

        return <DashboardTab onViewTasks={() => setTab("tasks")} />;



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
      h-dvh
      bg-gray-50
      "
    >





      <ParentSidebar


        tab={tab}


        setTab={setTab}


        collapsed={collapsed}


        setCollapsed={setCollapsed}


        onLogout={() => setShowLogoutConfirmation(true)}


      />








      <div
        className="
        flex-1
        min-w-0
        flex
        flex-col
        overflow-hidden
        "
      >





        <DashboardHeader
          onNavigate={setTab}
          onLogout={() => setShowLogoutConfirmation(true)}
        />







        <main
          className="
          flex-1
          overflow-y-auto
          p-4
          pb-24
          sm:p-6
          sm:pb-24
          md:pb-6
          "
        >


          {renderContent()}


        </main>

        {showMobileMore && (
          <>
            <button
              type="button"
              aria-label="Close more navigation"
              onClick={() => setShowMobileMore(false)}
              className="fixed inset-0 z-40 bg-slate-950/20 md:hidden"
            />
            <div className="fixed inset-x-3 bottom-20 z-50 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl md:hidden">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                  More
                </span>
                <button
                  type="button"
                  onClick={() => setShowMobileMore(false)}
                  aria-label="Close more menu"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {SIDEBAR_NAV.filter((item) =>
                  ["rewards", "analytics", "settings"].includes(item.id),
                ).map((item) => {
                  const Icon = item.Icon;
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTab(item.id as ParentTab);
                        setShowMobileMore(false);
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 gap-1 border-t border-gray-200 bg-white/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_18px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
        >
          {SIDEBAR_NAV.filter((item) =>
            ["dashboard", "children", "tasks", "calendar"].includes(item.id),
          ).map((item) => {
            const Icon = item.Icon;
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id as ParentTab)}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            aria-expanded={showMobileMore}
            onClick={() => setShowMobileMore((current) => !current)}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition ${
              showMobileMore || ["rewards", "analytics", "settings"].includes(tab)
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span>More</span>
          </button>
        </nav>

        {showLogoutConfirmation && (
          <LogoutConfirmationModal
            onCancel={() => setShowLogoutConfirmation(false)}
            onConfirm={onLogout}
          />
        )}






      </div>





    </div>

  );

}
