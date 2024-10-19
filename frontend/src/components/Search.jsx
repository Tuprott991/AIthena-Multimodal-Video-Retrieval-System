import { useContext, useState } from "react";
import { OptionContext } from "../OptionContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Search = () => {
 const navigate = useNavigate();
 const [query, setQuery] = useState("");
 const {
  data,
  setData,
  selectedOption,
  isKeywords,
  keywords,
  isCQ,
  range,
  handleCQChange,
  handleOptionChange,
  handleKeywordChange,
  handleDataChange,
  handleLoading,
  handleRange,
 } = useContext(OptionContext);

 const handleInputChange = (event) => {
  setQuery(event.target.value);
 };

 const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(selectedOption);
  console.log(range);
  handleKeywordChange("");
  const faiss =
   selectedOption === "CLIP" ||
   selectedOption === "CLIP + OCR" ||
   selectedOption === "CLIP + ASR"
    ? true
    : false;
  const ocr =
   selectedOption === "OCR" || selectedOption === "CLIP + OCR" ? true : false;
  const subtitles =
   selectedOption === "ASR" || selectedOption === "CLIP + ASR" ? true : false;
  const searchQuery = {
   text_query: query,
   faiss: faiss,
   ocr: ocr,
   subtitle: subtitles,
   cq: isCQ,
   keywords: keywords,
   num_images: 100,
  };
  console.log(
   `/textsearch?query=${query}&faiss=${faiss}&ocr=${ocr}&subtitle=${subtitles}&cq=${isCQ}&keywords=${keywords}&num_images=${range}`
  );
  navigate(
   `/textsearch?query=${query}&faiss=${faiss}&ocr=${ocr}&subtitle=${subtitles}&cq=${isCQ}&keywords=${keywords}&num_images=${range}`
  );
 };

 return (
  <div className="flex justify-between items-center w-[600px] gap-2">
   <form className="grow" onSubmit={handleSubmit}>
    <div className="relative">
     <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg
       className="w-4 h-4 text-gray-500 "
       aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 20 20"
      >
       <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
       />
      </svg>
     </div>
     <input
      type="search"
      id="search"
      className="block w-full   p-[10px] ps-10 pe-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
      placeholder="Your query here"
      required
      onChange={handleInputChange}
     />
     <button
      type="submit"
      className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 ffocus:ring-4 focus:outline-none focus:ring-blue-300 "
     >
      <svg
       className="w-4 h-4"
       aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 20 20"
      >
       <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
       />
      </svg>
     </button>
    </div>
   </form>

   <label className="inline-flex items-center cursor-pointer gap-3">
    <input
     type="checkbox"
     onChange={(e) => handleCQChange(e.target.checked)}
     className="sr-only peer "
    />
    <span className="ms-3 text-sm font-medium text-gray-900 ">CQ</span>
    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
   </label>
  </div>
 );
};

export default Search;
