import { Avatar, Dropdown, Navbar,TextInput } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"
import { Button } from "flowbite-react"
import { FaMoon, FaSun } from "react-icons/fa"
import { useSelector, useDispatch} from "react-redux"
import {toggleTheme} from '../redux/theme/themeSlice'
import { useNavigate } from "react-router-dom"
import { signOutSuccess } from "../redux/user/userSlice"
import { useEffect, useState } from "react"

export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser} = useSelector( state => state.user);
    const {theme} = useSelector(state => state.theme)
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    useEffect( () => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        setSearchTerm(searchTermFromUrl);
    },[location.search])

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/user/signout',{
        method: 'POST'
      });
      const data = await response.json();
    
      if(!response.ok){
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/");
      }
    
    } catch(error) {
      console.log(error.message);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  return (
    <Navbar className="border-b-2">
        <Link to={`/`}  className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
           <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
           rounded-lg text-white">Taichi&apos;s</span>Blog
        </Link>
        <form onSubmit={handleSubmit}>
            <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
        <Button className="w-12 h-10 center lg:hidden sm:inline`" color={"gray"} pill>
            <AiOutlineSearch/>
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button className="w-12 h-10 sm:inline" color={"gray"} pill
            onClick={() => dispatch(toggleTheme())}>
                {
                    theme === 'light'? (<FaSun/>) : (<FaMoon/>)
                }
            </Button>
            {
                currentUser ? (
                    <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar
                        alt="user"
                        img={currentUser.profilePicture}
                        rounded/>
                    }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{currentUser.username}</span>
                            <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider/>
                        <Link to={'/dashboard?tab=profile'} onClick={handleSignOut}>
                            <Dropdown.Item>Sign Out</Dropdown.Item>
                        </Link>
                    </Dropdown>
                ) : (
                    <Link to={'/sign-in'}>
                        <Button  gradientDuoTone={"purpleToBlue"}  outline className="font-bold">
                            Sign In
                        </Button>
                    </Link>
                )
            }
            <Navbar.Toggle/>
        </div>
        
        <Navbar.Collapse>
            <Navbar.Link as={"div"} active={path === "/"}>
                <Link to={"/"}>
                   Home
                </Link>
            </Navbar.Link>
            <Navbar.Link as={"div"} active={path === "/about"} >
                <Link to={"/about"}>
                   About
                </Link>
            </Navbar.Link>
            <Navbar.Link as={"div"} active={path === "/projects"}>
                <Link to={"/projects"}>
                   Projects
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}
