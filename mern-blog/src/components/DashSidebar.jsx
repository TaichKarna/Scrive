import {Sidebar} from 'flowbite-react';
import {HiUser, HiArrowSmRight} from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {signOutSuccess} from '../redux/user/userSlice'

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState(''); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            <Sidebar.ItemGroup>
                <Link to={'/dashboard?tab=profile'}>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark'
                    as='div'>
                        Profile
                    </Sidebar.Item> 
                </Link>
                <Sidebar.Item active={tab === 'signout'} icon={HiArrowSmRight} onClick={handleSignOut} >
                    Sign Out
                </Sidebar.Item> 
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
