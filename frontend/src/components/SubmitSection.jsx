import { useContext, useEffect, useState } from "react";
import { OptionContext } from "../OptionContext";
import axios from "axios";

const SubmitSection = () => {
 const {
  added,
  sessionId,
  setSessionId,
  setAdded,
  evaluationId,
  setEvaluationId,
 } = useContext(OptionContext);
 const handleSessionID = async () => {
  const response = await axios.post(
   " https://eventretrieval.one/api/v2/login",
   {
    username: "team13",
    password: "x3uRJaTVdy",
   }
  );
  localStorage.setItem("sessionId", response.data.sessionId);
  setSessionId(response.data.sessionId);
 };
 const handleEvaluationID = async () => {
  const response = await axios.get(
   "https://eventretrieval.one/api/v2/client/evaluation/list",
   {
    params: {
     session: sessionId,
    },
   }
  );
  localStorage.setItem("evaluationId", response.data[0].id);
  localStorage.setItem("name", response.data[0].name);
  setEvaluationId({ id: response.data[0].id, name: response.data[0].name });
 };
 const handleRemove = (item) => {
  setAdded((prev) => prev.filter((i) => i.id !== item.id));
 };
 console.log(sessionId);
 return (
  <div className="rounded-lg p-4 w-full">
   <div className="flex flex-wrap ">
    <div className="flex w-full gap-2 mb-4">
     <div
      className="hover:cursor-pointer basis-[11%] text-center rounded-lg font-semibold w-full px-3 py-1 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300"
      onClick={() => handleSessionID()}
     >
      Get sessionID
     </div>
     <input
      type="text"
      value={sessionId}
      onChange={(e) => setSessionId(e.target.value)}
      disabled
      className="basis-[30%] px-4 c bg-slate-200 cursor-not-allowed  border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg"
     />
    </div>
    <div className="flex w-full gap-2">
     <div
      className="hover:cursor-pointer basis-[13%] text-center rounded-lg font-semibold w-full px-3 py-1 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300"
      onClick={() => handleEvaluationID()}
     >
      Get evaluationID
     </div>
     <input
      type="text"
      value={evaluationId.id}
      className="basis-[30%] px-4  bg-slate-100  border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg"
      onChange={(e) =>
       setEvaluationId((prev) => ({ ...prev, id: e.target.value }))
      }
     />
     <input
      type="text"
      value={evaluationId.name}
      onChange={(e) =>
       setEvaluationId((prev) => ({ ...prev, name: e.target.value }))
      }
      className="basis-[20%] px-4 bg-slate-100  border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg"
     />
    </div>
   </div>
   <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-6 mb-8 ">
    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700">
     <tr>
      <th scope="col" className="px-6 py-3">
       Folder
      </th>
      <th scope="col" className="px-6 py-3">
       Image
      </th>
      <th scope="col" className="px-6 py-3">
       Milisecond
      </th>
      <th scope="col" className="px-6 py-3">
       Action
      </th>
     </tr>
    </thead>
    <tbody>
     {added &&
      added.map((item) => (
       <tr key={item.id} className="bg-white">
        <th
         scope="row"
         className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
        >
         {item.folder}
        </th>
        <td className="px-6 py-4">{item.image}</td>
        <td className="px-6 py-4">{item.milisecond}</td>
        <td className="px-6 py-4">
         <button
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          onClick={() => handleRemove(item)}
         >
          Removed
         </button>
        </td>
       </tr>
      ))}
    </tbody>
   </table>
  </div>
 );
};

export default SubmitSection;
