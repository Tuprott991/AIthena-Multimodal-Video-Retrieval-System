import MainSection from "./MainSection";

const SketchSection = () => {
 return (
  <div className="flex flex-row">
   <div className="w-[45%]">
    <div></div>
   </div>
   <MainSection isSketch={true}></MainSection>
  </div>
 );
};

export default SketchSection;
