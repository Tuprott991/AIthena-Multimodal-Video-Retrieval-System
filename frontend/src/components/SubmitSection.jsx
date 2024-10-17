import React, { useContext, useEffect } from "react";
import { OptionContext } from "../OptionContext";

const SubmitSection = () => {
 const { added, setAdded } = useContext(OptionContext);

 const handleRemove = (item) => {
  setAdded((prev) => prev.filter((i) => i.id !== item.id));
 };
 console.log(added);
 return (
  <div>
   <div className="  rounded-lg p-4 w-full ">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 mb-8 ">
     <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700">
      <tr>
       <th scope="col" className="px-6 py-3">
        Folder
       </th>
       <th scope="col" className="px-6 py-3">
        Frame
       </th>
       <th scope="col" className="px-6 py-3">
        Image
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
         <td className="px-6 py-4">{item.id}</td>
         <td className="px-6 py-4">{item.image}</td>
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
  </div>
 );
};

export default SubmitSection;
