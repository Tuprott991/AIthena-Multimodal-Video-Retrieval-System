import { createContext, useState } from "react";

export const OptionContext = createContext();
export const OptionProvider = ({ children }) => {
 const [data, setData] = useState();
 const [selectedOption, setSelectedOption] = useState("CLIP");
 const [isKeywords, setIsKeywords] = useState(false);
 const [keywords, setKeywords] = useState("");
 const [isCQ, setIsCQ] = useState(false);
 const [loading, setLoading] = useState(false);
 const [range, setRange] = useState(100);
 const [iframe, setIframe] = useState(null);
 const [footer, setFooter] = useState();

 const handleOptionChange = (value) => {
  if (value === "CLIP + OCR" || value === "CLIP + ASR") {
   setIsKeywords(true);
  } else {
   setIsKeywords(false);
  }
  setSelectedOption(value);
 };
 const handleKeywordChange = (value) => {
  setKeywords(value);
 };
 const handleDataChange = (value) => {
  setData(value);
 };
 const handleCQChange = (value) => {
  setIsCQ(value);
 };
 const handleLoading = (value) => {
  setLoading(value);
 };
 const handleRange = (value) => {
  setRange(value);
 };
 return (
  <OptionContext.Provider
   value={{
    data,
    setData,
    footer,
    setFooter,
    selectedOption,
    isKeywords,
    keywords,
    loading,
    isCQ,
    range,
    iframe,
    setIframe,
    handleCQChange,
    handleOptionChange,
    handleKeywordChange,
    handleDataChange,
    handleLoading,
    handleRange,
   }}
  >
   {children}
  </OptionContext.Provider>
 );
};
