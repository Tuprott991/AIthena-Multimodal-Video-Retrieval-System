import { useState } from "react";
import Footer from "./Footer";
import MainSection from "./MainSection";
import SubmitSection from "./SubmitSection";

const Main = () => {
 const [tab, setTab] = useState();

 return (
  <>
   <main className="relative md:ml-[20%] h-screen pt-[62px]  ">
    <div className="bg-white w-full mr-[1.1em]">
     <div className="flex items-center ml-6  gap-6 pt-[2px] font-semibold ">
      <button
       value="main"
       onClick={(e) => setTab(e.target.value)}
       className={`border-b-2  px-2  py-2 ${
        tab == "main"
         ? "text-purple-600 border-purple-600"
         : "border-white hover:border-slate-400"
       } `}
      >
       Main
      </button>
      <button
       value="submit"
       onClick={(e) => setTab(e.target.value)}
       className={`border-b-2  px-2  py-2 ${
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
    ) : (
     <SubmitSection></SubmitSection>
    )}
   </main>
  </>
 );
};

export default Main;
