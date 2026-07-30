import {
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react";

import type {
  Child,
  ParentTab,
} from "../../types/dashboard";

import {
  SIDEBAR_NAV,
} from "../../data/dashboardData";

import { ChildAvatar } from "../ChildAvatar";


interface Props {
  tab: ParentTab;

  setTab: (tab: ParentTab) => void;

  onKidMode: (child: Child) => void;

  onLogout: () => void;

  collapsed: boolean;

  setCollapsed: (value: boolean) => void;

  // Optional for now.
  // We will connect the real backend children later.
  children?: Child[];
}


export function ParentSidebar({
  tab,
  setTab,
  onKidMode,
  onLogout,
  collapsed,
  setCollapsed,
  children,
}: Props) {


  return (

    <aside
      className={`
        h-screen
        bg-white
        border-r
        border-gray-100
        flex
        flex-col
        shrink-0
        transition-all
        duration-300

        ${collapsed ? "w-15" : "w-56"}
      `}
    >


      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-2.5
          px-3
          py-4
          border-b
          border-gray-100
        "
      >

        <div
          className="
            w-8
            h-8
            bg-indigo-600
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            shadow-sm
          "
        >

          <span className="text-base">
            🙌
          </span>

        </div>


        {!collapsed && (

          <div
            className="
              flex-1
              min-w-0
            "
          >

            <div
              className="
                font-black
                text-gray-900
                text-sm
              "
            >
              High Five!
            </div>


            <div
              className="
                text-[10px]
                text-gray-400
                mt-0.5
                font-medium
              "
            >
              Family Platform
            </div>

          </div>

        )}


        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            text-gray-400
            hover:text-gray-600
            transition-colors
          "
        >

          <Menu className="w-4 h-4" />

        </button>

      </div>


      {/* NAVIGATION */}

      <nav
        className="
          flex-1
          py-3
          px-2
          space-y-0.5
          overflow-y-auto
        "
      >

        {SIDEBAR_NAV.map(item => {

          const active =
            tab === item.id;

          const Icon = item.Icon;


          return (

            <button
              key={item.id}
              onClick={() =>
                setTab(item.id as ParentTab)
              }
              className={`
                w-full
                flex
                items-center
                gap-2.5
                px-2.5
                py-2
                rounded-xl
                text-sm
                font-medium
                transition-all

                ${
                  active
                    ? "bg-indigo-50 text-indigo-700 dark-nav-active"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark-nav-item"
                }
              `}
            >

              <Icon
                className={`
                  w-4
                  h-4
                  shrink-0

                  ${
                    active
                      ? "text-indigo-600"
                      : "text-gray-400"
                  }
                `}
              />


              {!collapsed && (

                <>

                  <span
                    className="
                      truncate
                      flex-1
                      text-left
                    "
                  >
                    {item.label}
                  </span>


                  {active && (

                    <div
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-indigo-500
                      "
                    />

                  )}

                </>

              )}

            </button>

          );

        })}

      </nav>


      {/* KID MODE */}

      {!collapsed && (

        <div
          className="
            px-3
            py-3
            border-t
            border-gray-100
          "
        >

          <p
            className="
              text-[10px]
              font-bold
              text-gray-400
              uppercase
              tracking-wider
              mb-2
            "
          >
            Switch to Kid Mode
          </p>


          <div className="space-y-1">

            {(children ?? []).map(child => (

              <button
                key={child.id}
                onClick={() =>
                  onKidMode(child)
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-2
                  px-2
                  py-2
                  rounded-xl
                  hover:bg-gray-50
                  transition-colors
                  group
                "
              >

                {/* CHILD AVATAR */}

                <ChildAvatar
                  child={child}
                  size="sm"
                />


                {/* NAME */}

                <span
                  className="
                    text-sm
                    text-gray-700
                    font-medium
                    truncate
                    flex-1
                    text-left
                  "
                >
                  {child.name}
                </span>


                <ChevronRight
                  className="
                    w-3
                    h-3
                    text-gray-300
                    group-hover:text-gray-500
                  "
                />

              </button>

            ))}

          </div>

        </div>

      )}


      {/* USER */}

      <div
        className={`
          px-3
          py-3
          border-t
          border-gray-100
          flex
          items-center
          gap-2.5

          ${collapsed ? "justify-center" : ""}
        `}
      >

        <div
          className="
            w-8
            h-8
            rounded-full
            bg-indigo-100
            flex
            items-center
            justify-center
            text-xs
            font-black
            text-indigo-700
          "
        >
          JS
        </div>


        {!collapsed && (

          <>

            <div
              className="
                flex-1
                min-w-0
              "
            >

              <div
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  truncate
                "
              >
                Jane Smith
              </div>


              <div
                className="
                  text-[10px]
                  text-gray-400
                  truncate
                "
              >
                parent@family.com
              </div>

            </div>


            <button
              onClick={onLogout}
              className="
                text-gray-400
                hover:text-gray-600
              "
            >

              <LogOut className="w-4 h-4" />

            </button>

          </>

        )}

      </div>

    </aside>

  );

}


export default ParentSidebar;
