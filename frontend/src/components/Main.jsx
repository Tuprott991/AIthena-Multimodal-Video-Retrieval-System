import { useState } from "react";
import Footer from "./Footer";
import MainSection from "./MainSection";
import SubmitSection from "./SubmitSection";
import SketchSection from "./SketchSection";

const Main = () => {
 const [tab, setTab] = useState("main");
 const handleTabClick = (e) => {
  setTab(e.target.value);
 };
 return (
  <>
   <main className="relative md:ml-[20%] h-screen pt-[62px] overflow-y-scroll ">
    <div className="bg-white w-full ">
     <div className="flex items-center ml-6  gap-6 pt-[2px] font-semibold ">
      <button
       value="main"
       onClick={handleTabClick}
       className={`border-b-2  px-2  py-3 ${
        tab == "main"
         ? "text-purple-600 border-purple-600"
         : "border-white hover:border-slate-400"
       } `}
      >
       Main
      </button>
      <button
       value="sketch"
       onClick={(e) => setTab(e.target.value)}
       className={`border-b-2  px-2  py-3 ${
        tab == "sketch"
         ? "text-purple-600 border-purple-600"
         : "border-white hover:border-slate-400"
       } `}
      >
       AI-sketch/image URL
      </button>
      <button
       value="submit"
       onClick={(e) => setTab(e.target.value)}
       className={`border-b-2  px-2  py-3 ${
        tab == "submit"
         ? "text-purple-600 border-purple-600"
         : "border-white hover:border-slate-400"
       } `}
      >
       Submit
      </button>
     </div>
    </div>
    {tab == "main" ? (
     <>
      <MainSection></MainSection>
      <Footer></Footer>
     </>
    ) : tab == "submit" ? (
     <SubmitSection></SubmitSection>
    ) : (
     <SketchSection></SketchSection>
    )}
   </main>
  </>
 );
};

export default Main;
