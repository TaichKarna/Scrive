/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'

export default function Comment({comment, onLike, isLikedByUser}){
    const [user, setUser] = useState({});

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
                <p className="text-gray-500 pb-2">{comment.content}</p>
                <div className="flex gap-2 text-xs items-center pt-2 border-t dark:border-gray-700 max-w-fit">
                    <button className={isLikedByUser(comment._id) ? `text-blue-500 text-sm`: `text-gray-500 hover:text-blue-500`} onClick={() => onLike(comment._id)}>
                        <FaThumbsUp className="text-sm"  />
                    </button>
                    {
                        comment.numberOfLikes > 0 &&
                        <p className=" text-gray-500">{comment.numberOfLikes} {comment.numberOfLikes ===1 ? "like": "likes"}</p>
                    }
                </div>
            </div>
        </div>
    )
}