import { useContext, useEffect } from "react";
import { OptionContext } from "../OptionContext";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const MainSection = () => {
 const navigate = useNavigate();
 const {
  data,
  setData,
  footer,
  setFooter,
  selectedOption,
  isKeywords,
  keywords,
  loading,
  handleLoading,
  iframe,
  setIframe,
  handleOptionChange,
  handleKeywordChange,
  handleDataChange,
 } = useContext(OptionContext);
 const [searchParams] = useSearchParams();
 console.log("searchParams", searchParams.size);
 useEffect(() => {
  const fetchData = async () => {
   handleLoading(true);
   try {
    let response;
    if (searchParams.size == 0) {
     response = await axios.get("http://localhost:5001/");
    } else if (searchParams.size == 7) {
     response = await axios.get("http://localhost:5001/textsearch", {
      params: {
       text_query: searchParams.get("query"),
       faiss: searchParams.get("faiss"),
       ocr: searchParams.get("ocr"),
       cq: searchParams.get("cq"),
       subtitle: searchParams.get("subtitle"),
       keywords: searchParams.get("keywords") || "",
       num_images: parseInt(searchParams.get("num_images") || "0", 10),
      },
     });
    } else {
     response = await axios.get("http://localhost:5001/imgsearch", {
      params: {
       imgid: searchParams.get("imgid"),
      },
     });
    }
    console.log("Search Results:", response.data);
    let filteredData = [];
    if (response.data) {
     filteredData = response.data.pagefile
      .map((item) => {
       if (item.imgpath) {
        return {
         id: item.id,
         imgpath: item.imgpath,
        };
       }
       return null; // Return null for items without imgpath
      })
      .filter((item) => item !== null); // Filter out null values
    }
    handleLoading(false);
    setData(filteredData);
   } catch (error) {
    console.error("Error fetching search results:", error);
   }
  };
  fetchData();
 }, [searchParams]);
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
 console.log(footer);

 if (loading) {
  return (
   <div className="w-full h-full flex items-center justify-center ">
    <svg
     aria-hidden="true"
     className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 "
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
  );
 }
 return (
  <>
   <div className="p-4 w-full ">
    <div className="grid grid-cols-5 mb-[12%] gap-1 ">
     {data &&
      data.map((item, index) => (
       <div key={index} className="group relative w-full h-full">
        <img
         key={index}
         className="h-full w-full rounded "
         src={item.imgpath}
         //     src={}
         alt="image description"
         onClick={() => handleOnClick(index)}
        />
        <button
         className="font-bold absolute text-sm text-center 
             rounded-sm top-1 left-1
             px-2 py-[1px]
             text-white bg-emerald-500 border-none focus:outline-none hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800
             "
        >
         <span>+</span>
        </button>
        <div className="invisible absolute bottom-[3px] flex items-center justify-center w-full gap-3 text-white">
         <button
          className="font-medium group-hover:visible text-sm rounded-sm
             px-2 py-[2px]
             text-white bg-emerald-500 border-none focus:outline-none hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800
             "
          onClick={() => handleIR(item.id)}
         >
          IR
         </button>

         <button
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          className="font-medium group-hover:visible text-sm rounded-sm 
               px-2 py-[2px]
               text-white bg-emerald-500 border-none focus:outline-none hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800"
          onClick={() => handleYT(item.imgpath)}
         >
          YT
         </button>
         <button
          className="font-medium right-0 group-hover:visible  text-sm  rounded-sm 
          px-2 py-[2px]
               text-white bg-emerald-500 border-none focus:outline-none hover:bg-emerald-800 hover:ring-2 hover:ring-emerald-800"
          onClick={() => handleC(item.imgpath)}
         >
          C
         </button>
        </div>
       </div>
      ))}
    </div>
   </div>
  </>
 );
};

export default MainSection;
