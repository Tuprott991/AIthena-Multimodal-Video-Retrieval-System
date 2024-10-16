import { useContext, useEffect, useRef } from "react";
import { OptionContext } from "../OptionContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Footer = () => {
 const scrollRef = useRef(null);
 const { added, footer, setAdded, setIframe, setFooter } =
  useContext(OptionContext);
 const navigate = useNavigate();
 const handleIR = async (id) => {
  navigate(`/imgsearch?imgid=${id}`);
 };
 const handleYT = async (path) => {
  const response = await axios.get(
   `http://localhost:5001/submit_item?path=${path}`
  );
  console.log("path", response.data);
  setIframe(response.data);
 };
 const handleC = async (path) => {
  const response = await axios.get(
   `http://localhost:5001/get_Answer?path=${path}`
  );
  console.log("C", response.data);
 };
 const handleOnClick = async (index) => {
  const response = await axios.get(
   `http://localhost:5001/getneighbor?imgid=${index}`
  );
  if (response) {
   setFooter(response.data.pagefile);
  }
 };

 const handleAdded = (item) => {
  if (!added.some((i) => i.id === item.id)) {
   setAdded((prev) => [...prev, { id: item.id }]);
  }
 };
 const handleRemove = (item) => {
  setAdded((prev) => prev.filter((i) => i.id !== item.id));
 };
 useEffect(() => {
  // Scroll to the middle position when the component mounts
  if (scrollRef.current) {
   scrollRef.current.scrollLeft =
    scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2;
  }
 }, [footer]);
 return (
  <div
   ref={scrollRef}
   className="fixed  w-[79vw]  left-[20%] overflow-x-scroll  bottom-0 pt-2    bg-gray-300 px-2"
  >
   <div className="inline-flex gap-1 h-full ">
    {footer &&
     footer.map((item) => (
      <div key={item.id} className="h-full w-[150px] relative group ">
       <img
        className="rounded h-full "
        src={item.imgpath}
        alt="image description"
        onClick={() => handleOnClick(item.id)}
       />
       {!added.some((i) => i.id === item.id) ? (
        <button
         className="font-bold absolute text-sm text-center 
             rounded-sm top-1 left-1
             px-2 py-[1px]
             text-white bg-emerald-500 border-none focus:outline-none hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800  opacity-70 hover:opacity-100
             "
         onClick={() => handleAdded(item)}
        >
         +
        </button>
       ) : (
        <button
         className="font-semibold absolute text-sm text-center 
             rounded-sm top-1 left-1
             px-2 py-[1px]
             text-white bg-red-500 border-none focus:outline-none hover:bg-red-800 hover:ring-2 hover:ring-red-800  
             "
         onClick={() => handleRemove(item)}
        >
         Added
        </button>
       )}
       <div className=" absolute bottom-[3px] flex items-center justify-center w-full gap-3 text-white">
        <button
         className="font-medium group-hover:block hidden  text-xs rounded-sm
                  px-2 py-[2px] text-white bg-emerald-500 border-none focus:outline-none 
                  hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800 opacity-70 hover:opacity-100"
         onClick={() => handleIR(item.id)}
        >
         IR
        </button>
        <button
         data-modal-target="default-modal"
         data-modal-toggle="default-modal"
         className="font-medium group-hover:block hidden text-xs rounded-sm
                  px-2 py-[2px] text-white bg-emerald-500 border-none focus:outline-none 
                  hover:bg-emerald-800 hover:ring-2  hover:ring-emerald-800 opacity-70 hover:opacity-100"
         onClick={() => handleYT(item.imgpath)}
        >
         YT
        </button>
        <button
         className="font-medium right-0 group-hover:block hidden text-xs rounded-sm
                  px-2 py-[2px] text-white bg-emerald-500 border-none focus:outline-none 
                  hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800 opacity-70 hover:opacity-100"
         onClick={() => handleC(item.imgpath)}
        >
         C
        </button>
       </div>
      </div>
     ))}
   </div>
  </div>
 );
};

export default Footer;
