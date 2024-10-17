import { useContext, useState } from "react";
import { OptionContext } from "../OptionContext";

const Option = () => {
 const [answer, setAnswer] = useState();
 const {
  qa,
  setQA,
  selectedOption,
  isKeywords,
  keywords,
  handleOptionChange,
  handleKeywordChange,
 } = useContext(OptionContext);
 const handleQA = async (value) => {
  setQA(value);
  if (!value) {
   setAnswer("");
  }
 };
 const handleAnswerChange = async (value) => {
  setAnswer(value);
 };
 const handleSubmit = async () => {};
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
   <div className="flex gap-3">
    <input
     type="text"
     id="default-input"
     className={`${
      !isKeywords ? "cursor-not-allowed bg-slate-200" : ""
     } bg-gray-50 border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20%] p-2.5`}
     placeholder="Keywords"
     onChange={(event) => handleKeywordChange(event.target.value)}
     disabled={!isKeywords}
     value={keywords}
    />
    <label className="inline-flex items-center cursor-pointer ml-1">
     <input
      type="checkbox"
      onChange={(e) => handleQA(e.target.checked)}
      className="sr-only peer"
     />
     <span className="border-l-2 pl-4  h-[100%] text-center flex  items-center border-slate-500 ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
      QA
     </span>
     <div className="ml-2 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-amber-500"></div>
    </label>
    <input
     type="text"
     id="default-input"
     className={`${
      !qa ? "cursor-not-allowed bg-slate-200" : ""
     } bg-gray-50 border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-[30%] p-2.5`}
     placeholder="Keywords"
     onChange={(event) => handleAnswerChange(event.target.value)}
     disabled={!qa}
     value={answer}
    />
    <button className="rounded-lg font-semibold  px-8 py-2 text-sm text-white border bg-amber-500 border-amber-500 hover:bg-amber-600 focus:ring-2 focus:outline-none focus:ring-amber-300 ">
     S
    </button>
   </div>
  </div>
 );
};

export default Option;
