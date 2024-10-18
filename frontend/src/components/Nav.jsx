import { useNavigate } from "react-router-dom";
import HeaderSearch from "./HeaderSearch";

const Nav = () => {
 const navigate = useNavigate();
 const handleClick = () => {
  navigate("/");
 };
 return (
  <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50 flex">
   <div
    className="cursor-pointer self-center text-xl font-bold whitespace-nowrap dark:text-white mr-8"
    onClick={handleClick}
    style={{ fontFamily: "'Montserrat', 'Poppins', 'Raleway', sans-serif" }}
   >
    <span style={{ color: "orange" }}>AI</span>
    <span style={{ color: "limegreen" }}>thena</span>
   </div>
   <HeaderSearch></HeaderSearch>
  </nav>
 );
};

export default Nav;
