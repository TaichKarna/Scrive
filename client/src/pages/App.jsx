import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import FooterBlog from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop"

export default function App() {

  return (
    <div >
      <ScrollToTop/>
      <Header/>
      <Outlet/>
      <FooterBlog/>
    </div>
  )
}
