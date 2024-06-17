import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import FooterBlog from "../components/Footer"

export default function Home() {
  return (
    <div>
      <Header/>
      <Outlet/>
      <FooterBlog/>
    </div>
  )
}
