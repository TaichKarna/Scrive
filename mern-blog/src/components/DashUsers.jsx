import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Table, Modal, Button} from 'flowbite-react'
import {Link} from 'react-router-dom'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {FaCheck, FaTimes} from 'react-icons/fa'

export default function DashUsers(){
    const { currentUser } = useSelector( state => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {

        const fetchUsers = async () => {
           try{
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();

                if(res.ok){
                    setUsers(data.users);
                    if (data.users.length < 9) setShowMore(false);
                } else {
                    setUsers([]);
                }
           } catch (error) {
                console.log(error.message);
           }
        }

        if(currentUser.isAdmin) fetchUsers();
    },[currentUser.isAdmin]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
                const data = await res.json();

                if(res.ok){
                    const updatedUsers = users.concat(data.users)
                    setUsers(updatedUsers);
                    if(updatedUsers.length >= data.totalUsers) setShowMore(false);
                }

        } catch(error) {
            console.log(error.message)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);

        try{
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if(!res.ok) {
                console.log(data.message)
            } else {
                setUsers( (prev) => prev.filter( (user) => user._id !== userIdToDelete));
                setUserIdToDelete(null);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="table-auto overflow-x-scroll mx-3 md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && users.length > 0 ? (
                 <>
                 <Table hoverable className="shadow-md">
                    <Table.Head>
                        <Table.HeadCell>Date created</Table.HeadCell>
                        <Table.HeadCell>Profile Image</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Admin</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            users.map( (user) => 
                                <Table.Row key={user.username} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        <Link to={`${user.profilePicture}`}>
                                            <img src={user.profilePicture} alt={user.username} className="w-12 h-12 object-cover bg-gray-500 rounded-full mx-auto"/>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.username}    
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.email}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin? (<FaCheck className='text-green-500'/>) : <FaTimes className='text-red-500'/>}
                                    </Table.Cell>
                                    <Table.Cell>                                
                                       <span className="text-red-500 hover:underline font-medium cursor-pointer" onClick={() => {
                                            setShowModal(true);
                                            setUserIdToDelete(user._id);
                                        }}>
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                 </Table>
                 {
                    showMore && 
                    <button className="w-full text-teal-500 self-center text-sm py-7" onClick={handleShowMore}>
                        Show More
                    </button>
                 }
                 </>
            ) :
            ( <p>You have no user yet</p> )
            }
            {
             <Modal show={showModal} size={'md'} onClose={() => setShowModal(false)} popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                    <HiOutlineExclamationCircle className='mx-auto w-14 h-14 text-gray-400 mb-4'/>
                    <h3 className='text-gray-500 text-lg font-normal mb-5 dark:text-gray-400'>
                        Are you sure you want to delete this user?
                    </h3>
                    <div className='flex justify-center gap-5'>
                        <Button color='failure' onClick={handleDeleteUser}>
                        {"Yes, I'm sure"}
                        </Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>
                        {"No, cancel"}
                        </Button>
                    </div>
                    </div>
                </Modal.Body>
            </Modal>
            }
        </div>
    )
}