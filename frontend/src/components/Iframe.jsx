import { useContext } from "react";
import { OptionContext } from "../OptionContext";

const Iframe = () => {
 const { iframe, setIframe } = useContext(OptionContext);
 if (iframe) {
  return (
   <div
    className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-black/70"
    onClick={() => setIframe(null)}
   >
    <iframe
     src={iframe}
     title="YouTube video player"
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
     allowFullScreen
     className="w-2/3 h-5/6 relative"
    ></iframe>
   </div>
  );
 }
};

export default Iframe;
