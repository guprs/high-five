import ChildrenTab from "../components/children/ChildrenTab";
import type { Child } from "../types/dashboard";

export default function Children() {

  function handleKidMode(child: Child){
    console.log("Switch to kid mode:", child);
  }


  return (
    <ChildrenTab
      onKidMode={handleKidMode}
    />
  );

}
