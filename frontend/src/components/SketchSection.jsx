import { useContext, useEffect, useState } from "react";
import MainSection from "./MainSection";
import axios from "axios";
import { OptionContext } from "../OptionContext";

const SketchSection = () => {
 const { setData } = useContext(OptionContext);
 const [loading, setLoading] = useState(null);
 const [loadingQuery, setLoadingQuery] = useState(false);
 const [currentPrompt, setCurrentPrompt] = useState();
 const [currentURL, setCurrentURL] = useState();
 const [generatedImg, setGeneratedImg] = useState();
 const handlePromptSubmit = async (e) => {
  e.preventDefault();
  const prompt = currentPrompt.trim();
  setLoading(true);
  const response = await axios.get(
   `http://localhost:5001/genimg?prompt=${prompt}`
  );
  console.log(response.data);
  setLoading(false);
  localStorage.setItem("generatedImg", response.data.url);
  setCurrentPrompt("");
  setGeneratedImg(response.data.url);
 };
 useEffect(() => {
  if (localStorage.getItem("generatedImg")) {
   setLoading(false);
   setGeneratedImg(localStorage.getItem("generatedImg"));
  }
 }, []);
 const handleIRSketch = async (e) => {
  e.preventDefault();
  setLoadingQuery(true);
  try {
   const response = await axios.post("http://localhost:5001/sketchquery", {
    imgurl: generatedImg,
   });

   console.log(response.data);
   setData(response.data.pagefile);
  } catch (error) {
   console.error("Error fetching data:", error);
  } finally {
   setLoadingQuery(false);
  }
 };
 return (
  <div className="flex flex-row gap-4">
   <div className="w-[45%] ml-4 mt-4">
    <form onSubmit={handlePromptSubmit}>
     <textarea
      value={currentPrompt}
      id="comment"
      rows="1"
      className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none"
      placeholder="Prompt..."
      onChange={(e) => setCurrentPrompt(e.target.value)}
      required
     ></textarea>
     <input
      value={currentURL}
      name="imagePath"
      id="imagePath"
      className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none mb-2"
      placeholder="URL"
      onChange={(e) => setCurrentURL(e.target.value)}
     ></input>
     <button
      type="submit"
      className="flex items-center justify-center gap-1 rounded-lg font-semibold w-full px-4 py-2 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 "
      disabled={loading}
     >
      {loading ? (
       <>
        Generating
        <svg
         aria-hidden="true"
         className="w-4 h-4 text-gray-200 animate-spin  fill-blue-600 inline-block"
         viewBox="0 0 100 101"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
        >
         <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
         />
         <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
         />
        </svg>
       </>
      ) : (
       <>Generate</>
      )}
     </button>
    </form>
    <div className="mt-4 shadow-md rounded bg-white w-full aspect-video flex items-center justify-center">
     {loading ? (
      <svg
       aria-hidden="true"
       className="w-8 h-8 text-gray-200 animate-spin  fill-blue-600 inline-block"
       viewBox="0 0 100 101"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
      >
       <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
       />
       <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
       />
      </svg>
     ) : loading == false ? (
      <>
       <div className="group relative w-full h-full">
        <img src={generatedImg} className="w-full h-full" />
        <button
         className="absolute flex justify-center items-center bottom-2 left-[50%] transform -translate-x-1/2 font-medium group-hover:visible text-lg rounded-sm
             px-4 py-[4px]
             text-white bg-emerald-500 border-none focus:outline-none hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800  opacity-70 hover:opacity-100
             "
         onClick={(e) => handleIRSketch(e)}
        >
         {loadingQuery == false ? (
          <>Query</>
         ) : loadingQuery == true ? (
          <svg
           aria-hidden="true"
           className="w-6 h-6 text-gray-200 animate-spin  fill-blue-600 inline-block"
           viewBox="0 0 100 101"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
          >
           <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
           />
           <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
           />
          </svg>
         ) : (
          <></>
         )}
        </button>
       </div>
      </>
     ) : (
      <div className="text-sm text-gray-400">Generated image...</div>
     )}
    </div>
   </div>
   <MainSection isSketch={true}></MainSection>
  </div>
 );
};

export default SketchSection;
