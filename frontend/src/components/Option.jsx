import { useContext, useState } from "react";
import { OptionContext } from "../OptionContext";
import axios from "axios";

const Option = () => {
 const [answer, setAnswer] = useState();
 const [noti, setNoti] = useState(null);
 const {
  qa,
  setQA,
  added,
  evaluationId,
  sessionId,
  setAdded,
  selectedOption,
  isKeywords,
  keywords,
  handleOptionChange,
  handleKeywordChange,
 } = useContext(OptionContext);
 const handleQA = async (value) => {
  setQA(value);
  setAnswer("");
 };
 const handleAnswerChange = async (value) => {
  setNoti(null);
  setAnswer(value);
 };
 const handleSubmit = async () => {
  // Helper function to display notification temporarily
  const showNoti = (message, duration = 4000) => {
   setNoti(message);
   setTimeout(() => setNoti(null), duration);
  };

  // Validate answer for QA
  if (qa) {
   if (!answer) {
    return showNoti("Enter answer for QA!");
   }

   if (added.length > 1) {
    return showNoti("More than one frame added!");
   }

   if (added.length === 0) {
    return showNoti("Add one frame!");
   }

   // If everything is valid, submit data
   try {
    setNoti("Submitting!");

    const response = await axios.post(
     `https://eventretrieval.one/api/v2/submit/${evaluationId.id}`,
     {
      answerSets: [
       {
        answers: [
         { text: `${answer}-${added[0].folder}-${added[0].milisecond}` },
        ],
       },
      ],
     },
     {
      params: { session: sessionId },
     }
    );

    if (!response.data.status) {
     showNoti(response.data.description);
    } else {
     showNoti("Submitted!");
    }
   } catch (error) {
    console.error(error);
    showNoti(error.response.data.description);
   }
  }
  // Non-QA scenario
  else {
   if (added.length > 1) {
    return showNoti("More than one frame added!");
   }

   if (added.length === 0) {
    return showNoti("Add one frame!");
   }

   // If everything is valid, submit data
   try {
    setNoti("Submitting!");

    const response = await axios.post(
     `https://eventretrieval.one/api/v2/submit/${evaluationId.id}`,
     {
      answerSets: [
       {
        answers: [
         //  {
         //   mediaItemName: "L03_V006",
         //   start: 880000,
         //   end: 890000,
         //  },
         {
          mediaItemName: `${added[0].folder}`,
          start: `${added[0].milisecond}`,
          end: `${added[0].milisecond}`,
         },
        ],
       },
      ],
     },
     {
      params: { session: sessionId },
     }
    );

    if (!response.data.status) {
     showNoti(response.data.description);
    } else {
     showNoti("Submitted!");
    }
   } catch (error) {
    console.error(error);
    showNoti(error.response.data.description);
   }
  }
 };

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
    <button
     className="rounded-lg font-semibold  px-8 py-2 text-sm text-white border bg-amber-500 border-amber-500 hover:bg-amber-600 focus:ring-2 focus:outline-none focus:ring-amber-300 "
     onClick={() => handleSubmit()}
    >
     Submit {qa ? "QA" : "KIS"}
    </button>
   </div>

   {/* NOTI */}
   {noti && (
    <div
     id="toast-default"
     className="absolute right-4 top-16 flex items-center  py-2 pr-4 pl-2 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
     role="alert"
    >
     {noti === "Submitting!" ? (
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
       <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
       >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
       </svg>
       <span className="sr-only">Warning icon</span>
      </div>
     ) : noti === "Submitted!" ? (
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
       <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
       >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
       </svg>
       <span className="sr-only">Check icon</span>
      </div>
     ) : (
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
       <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
       >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
       </svg>

       <span className="sr-only">Error icon</span>
      </div>
     )}
     <div className="ms-3 text-sm font-normal">{noti}</div>
    </div>
   )}
  </div>
 );
};

export default Option;
