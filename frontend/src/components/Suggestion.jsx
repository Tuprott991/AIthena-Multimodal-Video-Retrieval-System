import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { suggestions } from "../data/suggestions";
import { useState } from "react";
const Suggestion = () => {
 const [suggested, setSuggested] = useState([]);
 const handleOnSearch = (string, results) => {
  // onSearch will have as the first callback parameter
  // the string searched and for the second the results.
  console.log(string, results);
 };

 const handleOnHover = (result) => {
  // the item hovered
 };

 const handleOnSelect = (item) => {
  setSuggested((prev) => [...prev, item]);
 };
 const handleOnFocus = () => {};
 const handleSuggested = (item) => {
  setSuggested((prev) => prev.filter((i) => i.id != item.id));
 };
 const handleSuggestedList = () => {
  const suggestedString = suggested.map((item) => item.name).join(",");
  console.log(suggestedString);
 };
 return (
  <>
   <div className="px-[2.5px]">
    <ReactSearchAutocomplete
     styling={{ fontSize: "14px", paddingLeft: "2px" }}
     items={suggestions}
     onSearch={handleOnSearch}
     onHover={handleOnHover}
     onSelect={handleOnSelect}
     onFocus={handleOnFocus}
     autoFocus
     //   formatResult={formatResult}
    />
   </div>
   <div className="py-1 flex flex-wrap text-sm gap-2">
    {suggested?.map((item) => (
     <div
      key={item.id}
      className="hover:cursor-pointer border rounded-lg p-2 mt-1 hover:bg-slate-100 hover:border-slate-300 hover:border"
      onClick={() => handleSuggested(item)}
     >
      {item.name}
     </div>
    ))}
   </div>
   <button
    className="rounded-lg font-semibold w-full px-4 py-2 text-sm text-white border bg-blue-700 border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300"
    onClick={handleSuggestedList}
   >
    Apply
   </button>
  </>
 );
};

export default Suggestion;
