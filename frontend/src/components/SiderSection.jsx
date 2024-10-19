import { useContext } from "react";
import { OptionContext } from "../OptionContext";
import Suggestion from "./Suggestion";
import ChatBox from "./ChatBox";

const SiderSection = () => {
 const { range, handleRange } = useContext(OptionContext);

 return (
  <div className="pl-4 pt-4 relative w-full h-full overflow-hidden scrollbar-slate-200 scrollbar-track-slate-400 ">
   <div className="flex-1 overflow-y-scroll h-[90vh] scrollbar-thin  ">
    <div className="mr-3 mt-2">
     <label
      htmlFor="minmax-range"
      className="block  font-medium text-gray-900 "
     >
      Images: <span className="text-gray-700 font-base">{range}</span>
     </label>
     <input
      id="range"
      type="range"
      min="100"
      max="300"
      value={range}
      step={10}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
      onChange={(e) => handleRange(e.target.value)}
     />

     <div className="mt-4">
      <Suggestion />
     </div>
     <hr className="mt-4 mb-3  border-slate-400 border-[1px] rounded-xl" />
     <ChatBox></ChatBox>
    </div>
   </div>
  </div>
 );
};

export default SiderSection;
