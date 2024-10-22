import axios from "axios";
import { useEffect, useState } from "react";

const ChatBox = () => {
 const [tab, setTab] = useState("gpt4");
 const [loading, setLoading] = useState(false);
 const [currentGPT4Prompt, setCurrentGPT4Prompt] = useState("");
 const [dialogueGPT4, setDialogueGPT4] = useState([]);
 const [dialogueQA, setDialogueQA] = useState([]);
 const [dialogueSketch, setDialogueSketch] = useState([]);

 const [currentQA, setCurrentQA] = useState({
  imagePath: "",
  question: "",
 });
 const [currentSketch, setCurrentSketch] = useState({
  prompt: "",
  url: "",
 });

 const handleQAChange = (e) => {
  const { name, value } = e.target;
  setCurrentQA((prevState) => ({
   ...prevState,
   [name]: value,
  }));
 };

 const handleSketchChange = (e) => {
  const { name, value } = e.target;
  setCurrentSketch((prev) => ({
   ...prev,
   [name]: value,
  }));
 };

 const handleGPT4Submit = async (e) => {
  e.preventDefault(); // Prevent form reload
  const parsedPrompt = currentGPT4Prompt.trim(); // Ensure input is valid
  if (!parsedPrompt) return; // Guard clause for empty input

  try {
   setLoading(true);
   const response = await axios.get(
    `http://localhost:5001/openai_prompt?prompt=${parsedPrompt}`
   );

   if (response) {
    // Correctly update the dialogue state
    setDialogueGPT4((prev) => [
     ...prev,
     { prompt: parsedPrompt, response: response.data },
    ]);
    console.log("Updated Dialogue State:", [
     ...dialogueGPT4,
     { prompt: parsedPrompt, response: response.data },
    ]);
   }
  } catch (error) {
   console.error("Error fetching prompt response:", error);
  } finally {
   setLoading(false);
   setCurrentGPT4Prompt(""); // Clear input after submission
  }
 };
 const handleQASubmit = async (e) => {
  e.preventDefault(); // Prevent form reload
  const imagePath = new URL(currentQA.imagePath).pathname.replace(
   "/images/",
   ""
  );
  const question = currentQA.question.trim();
  try {
   setLoading(true);
   const response = await axios.get(
    `http://localhost:5001/qa?imgpath=${imagePath}&question=${question}`
   );

   if (response) {
    // Correctly update the dialogue state
    setDialogueQA((prev) => [...prev, response.data]);
    console.log("Updated Dialogue State:", [...dialogueQA, response.data]);
   }
  } catch (error) {
   console.error("Error fetching prompt response:", error);
  } finally {
   setLoading(false);
   setCurrentQA(""); // Clear input after submission
  }
 };
 const handleSketchSubmit = async (e) => {
  e.preventDefault();
  console.log(currentSketch.prompt);
  console.log(currentSketch.url);
 };

 return (
  <div>
   <div className="mb-4 border-b border-gray-200 ">
    <div className="flex justify-center items-center gap-2 text-sm font-semibold">
     <button
      value="gpt4"
      onClick={(e) => setTab(e.target.value)}
      className={`border-b-2  px-2  py-2 ${
       tab == "gpt4"
        ? "text-purple-600 border-purple-600"
        : "border-white hover:border-slate-400"
      } `}
     >
      GPT4
     </button>
     <button
      value="dashboard"
      onClick={(e) => setTab(e.target.value)}
      className={`border-b-2  px-2  py-2 ${
       tab == "dashboard"
        ? "text-purple-600 border-purple-600"
        : "border-white hover:border-slate-400"
      } `}
     >
      QA
     </button>
     {/* <button
      value="AI-sketch/image url"
      onClick={(e) => setTab(e.target.value)}
      className={`border-b-2  px-2  py-2 ${
       tab == "AI-sketch/image url"
        ? "text-purple-600 border-purple-600"
        : "border-white hover:border-slate-400"
      } `}
     >
      AI-sketch/image url
     </button> */}
    </div>
   </div>

   {tab == "gpt4" ? (
    <>
     <form onSubmit={handleGPT4Submit}>
      <textarea
       value={currentGPT4Prompt}
       id="comment"
       rows="1"
       className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none"
       placeholder="Chatbox..."
       onChange={(e) => setCurrentGPT4Prompt(e.target.value)}
       required
      ></textarea>
      <button
       type="submit"
       className="flex items-center justify-center gap-1 rounded-lg font-semibold w-full px-4 py-2 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 "
      >
       Ask
       {loading && (
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
       )}
      </button>
     </form>

     <div className="overflow-y-scroll mb-4 scrollbar-thin scrollbar-slate-200 scrollbar-track-slate-400 mt-2 h-[30vh] px-2 border border-slate-200 rounded text-sm">
      {dialogueGPT4.map((item, index) => (
       <div key={index} className="border-b p-1">
        <div className="font-semibold mt-2 ">Prompt:</div>
        <div>{item.prompt}</div>
        <div className="font-semibold mt-2">Response:</div>
        <div>{item.response}</div>
       </div>
      ))}
     </div>
    </>
   ) : tab == "dashboard" ? (
    <>
     <form onSubmit={handleQASubmit}>
      <input
       value={currentQA.imagePath}
       name="imagePath"
       id="imagePath"
       className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none mb-2"
       placeholder="Image..."
       onChange={handleQAChange}
       required
      ></input>
      <input
       value={currentQA.question}
       name="question"
       id="question"
       className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none  mb-2"
       placeholder="Question..."
       onChange={handleQAChange}
       required
      ></input>
      <button
       type="submit"
       className="flex items-center justify-center gap-1 rounded-lg font-semibold w-full px-4 py-2 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 "
      >
       Ask
       {loading && (
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
       )}
      </button>
     </form>

     <div className="overflow-y-scroll mb-4 scrollbar-thin scrollbar-slate-200 scrollbar-track-slate-400 mt-2 h-[30vh] px-2 border border-slate-200 rounded text-sm">
      {dialogueQA.map((item, index) => (
       <div key={index} className="border-b p-1">
        {/* <div className="font-semibold mt-2 ">Prompt:</div>
        <div>{item.prompt}</div> */}
        <div className="font-semibold mt-2">Response:</div>
        <div>{item}</div>
       </div>
      ))}
     </div>
    </>
   ) : (
    // SKETCH
    <></>
    // <>
    //  <form onSubmit={handleSketchSubmit}>
    //   <input
    //    value={currentSketch.prompt}
    //    name="prompt"
    //    id="prompt"
    //    className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none mb-2"
    //    placeholder="Sketch prompt..."
    //    onChange={handleSketchChange}
    //    required
    //   ></input>
    //   <input
    //    value={currentSketch.url}
    //    name="url"
    //    id="url"
    //    className="border w-full text-sm px-3 py-2 focus:border-slate-400 rounded-lg focus:outline-none  mb-2"
    //    placeholder="URL...  "
    //    onChange={handleSketchChange}
    //    required
    //   ></input>
    //   <button
    //    type="submit"
    //    className="flex items-center justify-center gap-1 rounded-lg font-semibold w-full px-4 py-2 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 "
    //   >
    //    Ask
    //    {loading && (
    //     <svg
    //      aria-hidden="true"
    //      className="w-4 h-4 text-gray-200 animate-spin  fill-blue-600 inline-block"
    //      viewBox="0 0 100 101"
    //      fill="none"
    //      xmlns="http://www.w3.org/2000/svg"
    //     >
    //      <path
    //       d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
    //       fill="currentColor"
    //      />
    //      <path
    //       d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
    //       fill="currentFill"
    //      />
    //     </svg>
    //    )}
    //   </button>
    //  </form>

    //  <div className="overflow-y-scroll mb-4 scrollbar-thin scrollbar-slate-200 scrollbar-track-slate-400 mt-2 h-[30vh] px-2 border border-slate-200 rounded text-sm">
    //   {dialogueSketch.map((item, index) => (
    //    <div key={index} className="border-b p-1">
    //     {/* <div className="font-semibold mt-2 ">Prompt:</div>
    //     <div>{item.prompt}</div> */}
    //     <div className="font-semibold mt-2">Response:</div>
    //     <div>{item}</div>
    //    </div>
    //   ))}
    //  </div>
    // </>
   )}
  </div>
 );
};

export default ChatBox;
