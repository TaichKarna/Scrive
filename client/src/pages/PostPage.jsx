import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {Button, Spinner} from 'flowbite-react';
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function Post(){
    const {postSlug} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    const [loadingRecent, setLoadingRecent] = useState(false);

    useEffect( () => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();

                if(!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                if(res.ok){
                    setError(false);
                    setLoading(false);
                    setPost(data.posts[0])
                 }

            } catch(error) {
                setError(false);
                setLoading(false);
                console.log(error);
            }
        }

        fetchPost(); 
    },[postSlug]);

    useEffect(() => {
        const fetchRecent = async() => {
            setLoadingRecent(true);
            try{
                const res = await fetch(`/api/post/getposts?order=desc&limit=3`);
                const data = await res.json();
                setRecentPosts(data.posts);
                setLoadingRecent(false);
            } catch(error) {
                console.log(error)
            }
        }
        fetchRecent();
    },[])

    if(loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size={"xl"}/>
        </div>
    )

    return(
        <main className="max-w-6xl mx-auto p-3 flex flex-col min-h-screen">
            <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                {post && post.title}
            </h1>
            <Link to={`/search?category=${post && post.category}`} className="self-center mt-5"> 
                <Button color={"gray"} pill size={"xs"}>
                     {post && post.category}
                </Button>
            </Link>
            <img src={post && post.image} alt={post && post.image} className="mt-10 p-3 max-h-[600px] w-full object-cover"/>
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div dangerouslySetInnerHTML={{__html: post && post.content}} className="post-content 1p-3 max-w-2xl mx-auto pt-5 w-full">
            </div>
            <CommentSection postId={post && post._id}/>
            <div className=" flex flex-col justify-center items-center mb-5 mt-5">
                <h1 className="mb-5 text-xl">Recent articles</h1>
                <div className="flex flex-wrap items-center gap-5 justify-center mt-5">
                    {recentPosts && 
                        recentPosts.map(post => 
                            <PostCard
                            post={post}
                            key={post._id}/>
                        )
                    }
                </div>
            </div>
        </main>
    )
}