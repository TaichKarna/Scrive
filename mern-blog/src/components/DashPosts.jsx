import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Table, Modal, Button} from 'flowbite-react'
import {Link} from 'react-router-dom'
import {HiOutlineExclamationCircle} from 'react-icons/hi'

export default function DashPosts(){
    const { currentUser } = useSelector( state => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [totalPosts, setTotalPosts] = useState(null);
    
    useEffect(() => {
    
        const fetchPosts = async () => {
           try{
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();

                if(res.ok){
                    setUserPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    if (data.posts.length < 9) setShowMore(false);
                } else {
                    setUserPosts([]);
                }
           } catch (error) {
                console.log(error.message);
           }
        }

        if(currentUser.isAdmin) fetchPosts();
    },[currentUser._id, currentUser.isAdmin]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
                const data = await res.json();

                if(res.ok){
                    const updatedPosts = userPosts.concat(data.posts)
                    setUserPosts(updatedPosts);
                    if(updatedPosts.length >= data.totalPosts) setShowMore(false);
                } else {
                    setUserPosts([]);
                }
        } catch(error) {
            console.log(error.message)
        }
    }

    const handlePostDelete = async () => {
        setShowModal(false);

        try{
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if(!res.ok) {
                console.log(data.message)
            } else {
                setUserPosts( (prev) => prev.filter( (post) => post._id !== postIdToDelete ));
                setPostIdToDelete(null);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && userPosts.length > 0 ? (
                 <>
                 <Table hoverable className="shadow-md">
                    <Table.Head>
                        <Table.HeadCell>Date Updated</Table.HeadCell>
                        <Table.HeadCell>Post Image</Table.HeadCell>
                        <Table.HeadCell>Post Title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell>Edit</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            userPosts.map( (post) => 
                                <Table.Row key={post.title} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={post.image} alt="" className="w-20 h-10 object-cover bg-gray-500"/>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`} className="font-medium text-gray-900 dark:text-white line-clamp-2">
                                            {post.title}    
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {post.category}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-red-500 hover:underline font-medium cursor-pointer" onClick={() => {
                                            setShowModal(true);
                                            setPostIdToDelete(post._id);
                                        }}>
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`} className="text-teal-500">
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                 </Table>
                 {
                    showMore && (userPosts.length >= 9 && userPosts.length < totalPosts) && 
                    <button className="w-full text-teal-500 self-center text-sm py-7" onClick={handleShowMore}>
                        Show More
                    </button>
                 }
                 </>
            ) :
            ( <p>You have no post yet</p> )
            }
            {
             <Modal show={showModal} size={'md'} onClose={() => setShowModal(false)} popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                    <HiOutlineExclamationCircle className='mx-auto w-14 h-14 text-gray-400 mb-4'/>
                    <h3 className='text-gray-500 text-lg font-normal mb-5 dark:text-gray-400'>
                        Are you sure you want to delete this post?
                    </h3>
                    <div className='flex justify-center gap-5'>
                        <Button color='failure' onClick={handlePostDelete}>
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