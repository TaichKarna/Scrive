/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import { useSelector } from "react-redux";
import {Modal, Button, Textarea} from 'flowbite-react';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

export default function Comment({comment, onLike, isLikedByUser, onDelete}){
    const [user, setUser] = useState({});
    const  {currentUser} = useSelector(state => state.user);
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [editComment, setEditComment] = useState(false);
    const [prevContent, setPrevContent] = useState(comment.content);

    useEffect( () => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                if(res.ok){
                    const data = await res.json(); 
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        getUser();
    }, [comment])

    const handleEdit = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`/api/comment/editcomment/${comment._id}`,{
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    content,
                })
            });
            const data = await res.json();
            if(res.ok){
                setEditComment(false);
                setContent(data.content)
                setPrevContent(content)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel = () => {
        setEditComment(false);
        setContent(prevContent);

    }

    return (
        <div className="flex p-4 border-b  dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img src={user.profilePicture} alt={user.username} className="w-10 h-10 bg-gray-200 rounded-full"/>
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="text-sm mr-1 font-bold truncate">{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
                </div>
                {
                    editComment ?
                    (   <div>
                            <form onSubmit={handleEdit}>
                            <Textarea className="mt-2 p-3 w-full text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:bg-gray-100"  rows='3' maxLength='200'
                                onChange={(e) => setContent(e.target.value)} value={content}/>
                                <div>
                                <div className="flex justify-end items-center mt-5 gap-3">
                                <Button type="submit"  gradientDuoTone='purpleToBlue' onClick={handleEdit}>Submit</Button>
                                <Button type="button" outline gradientDuoTone='purpleToPink' onClick={handleCancel}>Cancel</Button>
                            </div>
                            </div>
                            </form>
                        </div>
                    ) :
                    ( 
                        <p className="text-gray-500 pb-2">{prevContent}</p>
                    )
                }
                <div className="flex gap-2 text-xs items-center pt-2 border-t dark:border-gray-700 max-w-fit">
                    <button className={isLikedByUser(comment._id) ? `text-blue-500 text-sm`: `text-gray-500 hover:text-blue-500`} onClick={() => onLike(comment._id)}>
                        <FaThumbsUp className="text-sm"  />
                    </button>
                    {
                        comment.numberOfLikes > 0 &&
                        <p className=" text-gray-500 ">{comment.numberOfLikes} {comment.numberOfLikes ===1 ? "like": "likes"}</p>
                    }
                    {
                        ( currentUser && (currentUser._id === comment.userId ) || currentUser.isAdmin ) && !editComment && 
                        (   <div className="ml-3 flex gap-2">
                            <button type='button' className="text-gray-400 hover:text-blue-500" onClick={() => setEditComment(true)}>
                                Edit
                            </button>
                            <button type='button' className="text-gray-400 hover:text-blue-500" onClick={() => setShowModal(true)}>
                                Delete
                            </button>
                            </div>
                        )

                    }
                </div>
            </div>
            <Modal show={showModal} size={'md'} onClose={() => setShowModal(false)} popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                    <HiOutlineExclamationCircle className='mx-auto w-14 h-14 text-gray-400 mb-4'/>
                    <h3 className='text-gray-500 text-lg font-normal mb-5 dark:text-gray-400'>
                        Are you sure you want to delete this comment?
                    </h3>
                    <div className='flex justify-center gap-5'>
                        <Button color='failure' onClick={() => { 
                            onDelete(comment._id);
                        setShowModal(false)
                    }}>
                        {"Yes, I'm sure"}
                        </Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>
                        {"No, cancel"}
                        </Button>
                    </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}