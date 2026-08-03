import { useState } from "react";

import type { Child } from "../../types/dashboard";

import KidHeader from "./KidHeader";
import KidBottomNav from "./KidBottomNav";
import KidQuestsTab from "./KidQuestsTab";
import KidShopTab from "./KidShopTab";
import KidAchievementsTab from "./KidAchievementsTab";
import KidProfileTab from "./KidProfileTab";
import FamilyPinModal from "./FamilyPinModal";
import Confetti from "../Confetti";
import ThemeAtmosphere from "./ThemeAtmosphere";

import { KID_THEMES } from "../../data/themes";
import { getChildren, updateChild } from "../../services/child";
import { normalizeChildren } from "../../utils/calendar";


type KidTab =
  | "quests"
  | "shop"
  | "achievements"
  | "profile";


interface Props {
  child: Child;
  onExit: () => void;
}


export default function KidMode({
  child,
  onExit,
}: Props) {

  const [currentChild, setCurrentChild] = useState(child);


  const [kidTab, setKidTab] =
    useState<KidTab>("quests");



  const [themeId, setThemeId] =
    useState(
      child.themeId || "space"
    );



  const theme =
    KID_THEMES.find(
      t => t.id === themeId
    ) ?? KID_THEMES[0];



  const [showPinModal, setShowPinModal] =
    useState(false);



  const [confetti, setConfetti] =
    useState(false);




  async function refreshChild() {
    const children = normalizeChildren(await getChildren());
    const refreshedChild = children.find((item) => item.id === child.id);
    if (refreshedChild) setCurrentChild(refreshedChild);
  }

  function handleComplete() {

    setConfetti(true);

    setTimeout(() => {
      setConfetti(false);
    }, 2500);

  }

  async function handleThemeChange(nextThemeId: string) {
    const previousThemeId = themeId;
    setThemeId(nextThemeId);
    setCurrentChild((current) => ({ ...current, themeId: nextThemeId }));
    try {
      await updateChild(child.id, { themeId: nextThemeId });
      await refreshChild();
    } catch {
      setThemeId(previousThemeId);
      setCurrentChild((current) => ({ ...current, themeId: previousThemeId }));
    }
  }





  function handleExitRequest() {

    setShowPinModal(true);

  }





  function handlePinSuccess() {

    setShowPinModal(false);

    onExit();

  }






  return (

    <div>


      {/* Kid Mode local fonts */}
      <style>
        {`

        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');


        .kid-mode {
          font-family: 'Nunito', sans-serif;
        }


        .kid-mode h1,
        .kid-mode h2,
        .kid-mode h3 {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
        }


        `}
      </style>





      <div

        className="
        kid-mode
        h-screen
        flex
        flex-col
        overflow-hidden
        transition-all
        duration-500
        "

        style={{

          background:

          `
          linear-gradient(
            145deg,
            ${theme.from},
            ${theme.via},
            ${theme.to}
          )
          `

        }}

      >

        <ThemeAtmosphere theme={theme} />






        {/* CONFETTI */}

        <Confetti active={confetti} />








        {/* HEADER */}

        <KidHeader

          child={currentChild}

          theme={theme}

          onExit={handleExitRequest}

        />









        {/* CONTENT */}

        <main

          className="
          relative
          z-10
          flex-1
          overflow-y-auto
          px-5
          pb-5
          "

        >




          {kidTab === "quests" && (

            <KidQuestsTab

              child={currentChild}

              theme={theme}

              onComplete={handleComplete}

              onDataChanged={refreshChild}

            />

          )}







          {kidTab === "shop" && (

            <KidShopTab

              child={currentChild}

              theme={theme}

            />

          )}







          {kidTab === "achievements" && (

            <KidAchievementsTab

              theme={theme}

              childId={currentChild.id}

            />

          )}







          {kidTab === "profile" && (

            <KidProfileTab

              child={currentChild}

              currentTheme={themeId}

              onThemeChange={(nextThemeId) => void handleThemeChange(nextThemeId)}

            />

          )}






        </main>









        {/* BOTTOM NAV */}

        <KidBottomNav

          activeTab={kidTab}

          setActiveTab={setKidTab}

        />









        {/* FAMILY PIN */}

        {showPinModal && (

          <FamilyPinModal

            onSuccess={handlePinSuccess}

            onCancel={() =>
              setShowPinModal(false)
            }

          />

        )}






      </div>


    </div>

  );

}
