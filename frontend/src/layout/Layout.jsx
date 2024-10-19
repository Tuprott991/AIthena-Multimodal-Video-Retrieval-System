import Nav from "../components/Nav";
import Aside from "../components/Aside";
import Iframe from "../components/Iframe";
import Main from "../components/Main";

const Layout = () => {
 return (
  <div className="antialiased bg-gray-50  h-full overflow-auto">
   <Nav></Nav>
   <Aside></Aside>
   <Main></Main>
   <Iframe></Iframe>
  </div>
 );
};

export default Layout;
