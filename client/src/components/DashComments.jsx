import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Table, Modal, Button} from 'flowbite-react'
import {HiOutlineExclamationCircle} from 'react-icons/hi'

export default function DashComments(){
    const { currentUser } = useSelector( state => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [totalComments, setTotalComments] = useState(null);

    useEffect(() => {

        const fetchComments = async () => {
           try{
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();

                if(res.ok){
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    if (data.comments.length < 9) setShowMore(false);
                } else {
                    setComments([]);
                }
           } catch (error) {
                console.log(error.message);
           }
        }

        if(currentUser.isAdmin) fetchComments();
    },[currentUser.isAdmin]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
                const data = await res.json();

                if(res.ok){
                    const updatedComments = comments.concat(data.comments)
                    setComments(updatedComments);
                    if(updatedComments.length >= data.totalComments) setShowMore(false);
                }

        } catch(error) {
            console.log(error.message)
        }
    }

    const handleDeleteComment = async () => {
        setShowModal(false);

        try{
            const res = await fetch(`/api/comment/deletecomment/${commentToDelete}/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if(!res.ok) {
                console.log(data.message)
            } else {
                setComments( (prev) => prev.filter( (comment) => comment._id !== commentToDelete));
                setCommentToDelete(null);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="table-auto overflow-x-scroll mx-3 md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && comments.length > 0 ? (
                 <>
                 <Table hoverable className="shadow-md">
                    <Table.Head>
                        <Table.HeadCell>Date updated</Table.HeadCell>
                        <Table.HeadCell>Content</Table.HeadCell>
                        <Table.HeadCell>Number of likes</Table.HeadCell>
                        <Table.HeadCell>Post Id</Table.HeadCell>
                        <Table.HeadCell>User Id</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            comments.map( (comment) => 
                                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(comment.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}    
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.postId}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.userId}
                                    </Table.Cell>
                                    <Table.Cell>                                
                                       <span className="text-red-500 hover:underline font-medium cursor-pointer" onClick={() => {
                                            setShowModal(true);
                                            setCommentToDelete(comment._id);
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
                    showMore && (comments.length >= 9 && comments.length < totalComments) && 
                    <button className="w-full text-teal-500 self-center text-sm py-7" onClick={handleShowMore}>
                        Show More
                    </button>
                 }
                 </>
            ) :
            ( <p>You have no comment yet</p> )
            }
            {
             <Modal show={showModal} size={'md'} onClose={() => setShowModal(false)} popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                    <HiOutlineExclamationCircle className='mx-auto w-14 h-14 text-gray-400 mb-4'/>
                    <h3 className='text-gray-500 text-lg font-normal mb-5 dark:text-gray-400'>
                        Are you sure you want to delete this comment?
                    </h3>
                    <div className='flex justify-center gap-5'>
                        <Button color='failure' onClick={handleDeleteComment}>
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