import { useContext, useState, useEffect } from "react";
import { OptionContext } from "../OptionContext";
import Suggestion from "./Suggestion";
import axios from "axios";
import ChatBox from "./ChatBox";

const SiderSection = () => {
 const { data, range, handleRange, selectedOption } = useContext(OptionContext);
 const [currentPrompt, setCurrentPrompt] = useState("");
 const [dialogue, setDialogue] = useState([]);

 const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent form reload
  const parsedPrompt = currentPrompt.trim(); // Ensure input is valid
  if (!parsedPrompt) return; // Guard clause for empty input

  try {
   const response = await axios.get(
    `http://localhost:5001/openai_prompt?prompt=${parsedPrompt}`
   );

   if (response) {
    // Correctly update the dialogue state
    setDialogue((prev) => [
     ...prev,
     { prompt: parsedPrompt, response: response.data },
    ]);
    console.log("Updated Dialogue State:", [
     ...dialogue,
     { prompt: parsedPrompt, response: response.data },
    ]);
   }
  } catch (error) {
   console.error("Error fetching prompt response:", error);
  } finally {
   setCurrentPrompt(""); // Clear input after submission
  }
 };

 // Log the dialogue state whenever it changes (for debugging)
 useEffect(() => {
  console.log("Dialogue Updated:", dialogue);
 }, [dialogue]);

 return (
  <div className="pl-4 pt-4 relative w-full h-full overflow-hidden scrollbar-slate-200 scrollbar-track-slate-400 ">
   <div className="flex-1 overflow-y-scroll h-[90vh] scrollbar-thin  ">
    <div className="mr-3 mt-2">
     <label
      htmlFor="minmax-range"
      className="block  font-medium text-gray-900 dark:text-white"
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
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      onChange={(e) => handleRange(e.target.value)}
     />

     <div className="mt-4">
      <Suggestion />
     </div>
     <hr className="mt-4 mb-3  border-slate-400 border-[1px] rounded-xl" />
     <ChatBox></ChatBox>

     {/* <div className="text-sm text-black font-semibold mb-1">GPT4</div> */}
     {/* <form onSubmit={handleSubmit}>
      <textarea
       value={currentPrompt}
       id="comment"
       rows="1"
       className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none"
       placeholder="Chatbox..."
       onChange={(e) => setCurrentPrompt(e.target.value)}
       required
      ></textarea>
      <button
       type="submit"
       className="w-full px-4 py-2 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300"
      >
       Ask
      </button>
     </form> */}

     {/* Render dialogue */}
     {/* <div className="overflow-y-scroll mb-4 scrollbar-thin scrollbar-slate-200 scrollbar-track-slate-400 mt-2 h-[30vh] px-2 border border-slate-200 rounded text-sm">
      {dialogue.map((item, index) => (
       <div key={index} className="border-b p-1">
        <div className="font-semibold mt-2 ">Prompt:</div>
        <div>{item.prompt}</div>
        <div className="font-semibold mt-2">Response:</div>
        <div>{item.response}</div>
       </div>
      ))}
     </div> */}
    </div>
   </div>
  </div>
 );
};

export default SiderSection;
