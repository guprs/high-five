import ChildrenTab from "../components/children/ChildrenTab";

export default function Children() {

  function handleKidMode(child:any){
    console.log("Switch to kid mode:", child);
  }


  return (
    <ChildrenTab
      onKidMode={handleKidMode}
    />
  );

}