import {Sidebar} from 'flowbite-react';
import {HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie} from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {signOutSuccess} from '../redux/user/userSlice'

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState(''); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser} = useSelector((state) => state.user);

    useEffect( () => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
    },[location.search]);

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
  
    return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
              {
                 currentUser && currentUser.isAdmin && (
                    <Link to={'/dashboard?tab=dashboard'}>
                    <Sidebar.Item active={tab === 'dashboard'} icon={HiChartPie}  
                    as='div'>
                        Dashboard
                    </Sidebar.Item> 
                </Link>
                  )
                }
                <Link to={'/dashboard?tab=profile'}>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={ currentUser.isAdmin? 'Admin': 'User'} labelColor='dark'
                    as='div'>
                        Profile
                    </Sidebar.Item> 
                </Link>
                {
                  currentUser && currentUser.isAdmin && (
                    <Link to={'/dashboard?tab=posts'}>
                    <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText}  
                    as='div'>
                        Posts
                    </Sidebar.Item> 
                </Link>
                  )
                }
                {
                 currentUser && currentUser.isAdmin && (
                    <Link to={'/dashboard?tab=users'}>
                    <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup}  
                    as='div'>
                        Users
                    </Sidebar.Item> 
                </Link>
                  )
                }
                {
                  currentUser && currentUser.isAdmin && (
                    <Link to={'/dashboard?tab=comments'}>
                    <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation}  
                    as='div'>
                        Comments
                    </Sidebar.Item> 
                </Link>
                  )
                }
                <Sidebar.Item active={tab === 'signout'} icon={HiArrowSmRight} onClick={handleSignOut} >
                    Sign Out
                </Sidebar.Item> 
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
