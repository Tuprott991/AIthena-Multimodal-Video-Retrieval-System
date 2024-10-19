import { useContext, useState } from "react";
import { OptionContext } from "../OptionContext";
import axios from "axios";

const Option = () => {
 const [answer, setAnswer] = useState();
 const [loading, setLoading] = useState(false);
 const [noti, setNoti] = useState(null);
 const {
  qa,
  submit,
  setSubmit,
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
  const showNoti = (message, duration = 3000) => {
   setNoti(message);
   setTimeout(() => setNoti(null), duration);
  };

  if (qa) {
   if (!answer) {
    return showNoti("Enter answer for QA!");
   }

   if (submit.length > 1) {
    return showNoti("More than one frame added!");
   }

   if (submit.length === 0) {
    return showNoti("Add one frame!");
   }

   // If everything is valid, submit data
   try {
    setLoading(true);

    const response = await axios.post(
     `https://eventretrieval.one/api/v2/submit/${evaluationId.id}`,
     {
      answerSets: [
       {
        answers: [
         { text: `${answer}-${submit[0].folder}-${submit[0].milisecond}` },
        ],
       },
      ],
     },
     {
      params: { session: sessionId },
     }
    );
    showNoti(response.data.submission);
    setSubmit([]);
   } catch (error) {
    console.error(error);
    showNoti(error.response.data.description);
   } finally {
    setLoading(false);
    localStorage.removeItem("submit");
   }
  } else {
   if (submit.length > 1) {
    return showNoti("More than one frame added!");
   }

   if (submit.length === 0) {
    return showNoti("Add one frame!");
   }

   try {
    setLoading(true);

    const response = await axios.post(
     `https://eventretrieval.one/api/v2/submit/${evaluationId.id}`,
     {
      answerSets: [
       {
        answers: [
         {
          mediaItemName: `${submit[0].folder}`,
          start: `${submit[0].milisecond}`,
          end: `${submit[0].milisecond}`,
         },
        ],
       },
      ],
     },
     {
      params: { session: sessionId },
     }
    );

    showNoti(response.data.submission);
    setSubmit([]);
   } catch (error) {
    console.error(error);
    showNoti(error.response.data.description);
   } finally {
    setLoading(false);
    localStorage.removeItem("submit");
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
      className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
     <span className="border-l-2 pl-4  h-[100%] text-center flex  items-center border-slate-500 ms-3 text-sm font-medium text-gray-900 ">
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
     placeholder="Answer"
     onChange={(event) => handleAnswerChange(event.target.value)}
     disabled={!qa}
     value={answer}
    />
    <button
     className="flex rounded-lg font-semibold  px-8 py-2 text-sm text-white border bg-amber-500 border-amber-500 hover:bg-amber-600 focus:ring-2 focus:outline-none focus:ring-amber-300 "
     onClick={() => handleSubmit()}
    >
     {!loading ? (
      `Submit ${qa ? "QA" : "KIS"}`
     ) : (
      <div className="px-8 items-center flex justify-center">
       <svg
        aria-hidden="true"
        className="w-6 h-6 text-gray-200 animate-spin fill-gray-800 "
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
      </div>
     )}
    </button>
   </div>

   {/* NOTI */}
   {noti && (
    <div
     id="toast-default"
     className="absolute right-4 top-16 flex items-center  py-2 pr-4 pl-2 text-gray-500 bg-white rounded-lg shadow "
     role="alert"
    >
     {noti === "Submitting!" ? (
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg ">
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
     ) : noti === "CORRECT" ? (
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg ">
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
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg ">
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
