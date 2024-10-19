import SiderSection from "./SiderSection";

const Aside = () => {
 return (
  <aside
   className="fixed top-0 left-0 z-40 w-[20%] min-h-screen pt-12 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 "
   aria-label="Sidenav"
   id="drawer-navigation"
  >
   <SiderSection></SiderSection>
  </aside>
 );
};

export default Aside;
