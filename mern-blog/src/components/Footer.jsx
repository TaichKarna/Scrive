import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import { FaInstagram, FaFacebook, FaDiscord, FaGithub} from "react-icons/fa"

export default function FooterBlog() {
  return (
    <Footer container  className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid w-full justify-between sm:flex md:grid-cols-1" >
            <div className="mt-5">
                <Link to={`/`}  className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              rounded-lg text-white">{"Taichi's"}</span>Blog
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 mt-4">
              <div>
                <Footer.Title title="About" />
                <Footer.LinkGroup col>
                  <Footer.Link
                  href="./"
                  target="_blank"
                  rel="noopener noreferrer">
                    100 js projects
                  </Footer.Link>
                  <Footer.Link
                  href="./"
                  target="_blank"
                  rel="noopener noreferrer">
                    Taichi's Blog
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Follow Us" />
                  <Footer.LinkGroup col>
                    <Footer.Link
                    href="./"
                    target="_blank"
                    rel="noopener noreferrer">
                      Github
                    </Footer.Link>
                    <Footer.Link
                    href="./"
                    target="_blank"
                    rel="noopener noreferrer">
                      Discord
                    </Footer.Link>
                  </Footer.LinkGroup>
              </div>
              <div>
              <Footer.Title title="Legal" />
                <Footer.LinkGroup col>
                  <Footer.Link
                  href="./"
                  target="_blank"
                  rel="noopener noreferrer">
                    Privacy
                  </Footer.Link>
                  <Footer.Link
                  href="./"
                  target="_blank"
                  rel="noopener noreferrer">
                    Terms &amp; Conditions
                  </Footer.Link>
                </Footer.LinkGroup>
            </div>
            </div>
          </div>
          <Footer.Divider />
            <div className=" w-full sm:flex sm:justify-between sm:items-center">
              <Footer.Copyright href="#" by="TaichiKarna" year={new Date().getFullYear()}/>
            <div className="flex sm:mt-0 mt-4 gap-6 sm:justify-center">
              <Footer.Icon href="#" icon={FaDiscord}/>
              <Footer.Icon href="#" icon={FaGithub}/>
              <Footer.Icon href="#" icon={FaFacebook}/>
              <Footer.Icon href="#" icon={FaInstagram}/>

            </div>
            </div>
        </div>
    </Footer>
  )
}
