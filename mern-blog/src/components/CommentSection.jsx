import { useSelector } from "react-redux"
import {Link} from 'react-router-dom'
import {Alert, Button, Textarea} from 'flowbite-react'
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Comment from '../components/Comment'

// eslint-disable-next-line react/prop-types
export default function CommentSection({postId}){
    const {currentUser} = useSelector( state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        try {
            const fetchComments = async () => {
                const res = await fetch(`/api/comment/getcomments/${postId}`);

                if(res.ok){
                    const data = await res.json();
                    setCommentList(data);
                } 
            }       
            fetchComments();    
        } catch (error) {
            console.log(error);
        }
    },[postId])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(comment.length > 200) return;

        try{
            const res = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            });
            const data = await res.json();

            if(res.ok){
                setComment('');
                setCommentError(null);
                setCommentList([data, ...commentList])
            }

        } catch(error) {
            setCommentError(error.message);
        }
        
    }
    const handleLike = async (commentId) => {
        if(!currentUser) navigate('/sign-in'); 

        try{
            const res = await fetch(`/api/comment/likecomment/${commentId}`,{
                method: "PUT"
            });
            const data = await res.json();
            if(res.ok){
                const index = commentList.findIndex( (comment) => comment._id === data._id);
                const newCommentList = commentList.toSpliced(index, 1, data);
                setCommentList(newCommentList);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleDelete = async (commentId) => {
        try{
            const res = await fetch(`/api/comment/deletecomment/${commentId}/${currentUser._id}`,{
                method: "DELETE",
            });
            const data = await res.json();
            if(res.ok){
                const index = commentList.findIndex( (comment) => comment._id === commentId);
                const newCommentList = commentList.toSpliced(index, 1);
                setCommentList(newCommentList);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const isLikedByUser = (commentId) => {
        const comment = commentList.filter( comment => comment._id === commentId);
        const commentLiked = comment[0].likes.includes(currentUser._id);
        return commentLiked; 
    } 

    return (
        <div className="max-w-2xl mx-auto w-full p-3">
            {currentUser ?
            (
                <div className="flex items-center gap-1 my-5 text-grap-500">
                    <p>Signed in as:</p>
                    <img src={currentUser.profilePicture} alt="" className="h-5 w-5 object-cover rounded-full" />
                    <Link to={'/dashboard?tab=profile'} className="text-xs text-cyan-600 hover:underline">
                        @{currentUser.username}
                    </Link>
               </div>    
            ) :
            (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    You must be signed in to comment.
                    <Link to={'/sign-in'} className="text-blue-500 hover:underline">Sign In</Link>
                </div>
            )
            }
            {
                currentUser?
                (
                    <form className="border border-teal-500 max-w-2xl mx-auto p-3" onSubmit={handleSubmit}>
                        <Textarea className="" placeholder="Add a comment...." rows='3' maxLength='200'
                        onChange={(e) => setComment(e.target.value)} value={comment}/>
                       <div className="flex justify-between items-center mt-5">
                        <p className="text-xs text-gray-500">{200-comment.length} characters remaining</p>
                        <Button type="submit" outline gradientDuoTone='purpleToBlue'>Submit</Button>
                       </div>
                       {
                            
                            commentError && 
                            <Alert color='failure' className="mt-5">{commentError}</Alert>
                       }
                        </form>
                ) :
                (
                    null
                )
            }
            {
                commentList.length === 0 ? 
                (
                    <p className="text-sm my-5">No comments yet</p>
                ) : 
                (  <>
                     <div className="text-sm my-5 items-center flex gap-1">
                        <p>Comments</p>
                        <div  className="border border-gray-400 px-2 py-1 rounded-sm">
                            <p>{commentList.length}</p>
                        </div>
                    </div>
                    {
                        commentList.map( (comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onLike={handleLike}
                            isLikedByUser={isLikedByUser}
                            onDelete={handleDelete}
                        />   
                    ))
                    }
                    </>
                )
            }

        </div>
    )
}