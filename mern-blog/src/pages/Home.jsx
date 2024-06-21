import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import FooterBlog from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop"

export default function Home() {

  return (
    <div className="">
      <ScrollToTop/>
      <Header/>
      <Outlet/>
      <FooterBlog/>
    </div>
  )
}
