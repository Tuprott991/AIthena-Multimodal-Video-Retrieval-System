import { useContext } from "react";
import { OptionContext } from "../OptionContext";

const Option = () => {
 const {
  selectedOption,
  isKeywords,
  keywords,
  handleOptionChange,
  handleKeywordChange,
 } = useContext(OptionContext);

 return (
  <div className="flex items-center gap-2 ">
   <div className="flex gap-4 ">
    <form className="w-full">
     <select
      id="countries"
      onChange={(event) => handleOptionChange(event.target.value)}
      className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
     >
      <option value="CLIP">CLIP L\14</option>
      <option value="OCR">OCR</option>
      <option value="ASR">ASR</option>
      <option value="CLIP + OCR">CLIP L\14 + OCR</option>
      <option value="CLIP + ASR">CLIP L\14 + ASR</option>
     </select>
    </form>
   </div>
   <div className="flex justify-end gap-2 ">
    <div className="w-[400px]">
     <input
      type="text"
      id="default-input"
      className={`${
       !isKeywords ? "cursor-not-allowed bg-slate-200" : ""
      } bg-gray-50 border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      placeholder="Keywords"
      onChange={(event) => handleKeywordChange(event.target.value)}
      disabled={!isKeywords}
      value={keywords}
     />
    </div>
   </div>
  </div>
 );
};

export default Option;
