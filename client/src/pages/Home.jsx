import { useState, useEffect } from "react"
import {Button, TextInput} from 'flowbite-react'
import {useNavigate, useLocation} from 'react-router-dom';
import { Select } from "flowbite-react";
import PostCard from '../components/PostCard'


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect( () => {

    const fetchPosts = async() => {
        try{
            setLoading(true);
            const res = await fetch(`/api/post/getposts?sort=desc`);

            if(!res.ok){
                setLoading(false);
                return;
            }

            if(res.ok){
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    fetchPosts();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[location.search]);


  return (
    <div className="mx-auto max-w-6xl p-3">
      <div className="flex flex-col my-20 md:my-36 items-start">
        <div>
          <h1 className="font-bold text-3xl lg:text-6xl dark:text-white">Welcome to my blog</h1>
          <p className="my-7 text-gray-500 text-sm">Here you will find various articles and tutorials on topics such as web development, computer science and prgramming.</p>
        </div>
        <button className=" text-teal-500  text-sm font-bold  hover:underline" onClick={() => navigate('/search')}>
                View all posts
        </button>
      </div>
      <div>
      <div className="w-full  ">
            <h1 className="text-3xl  p-3 mt-5 text-nowrap text-center">Recent Posts</h1>
            <div className="p-7 flex flex-wrap gap-4 justify-center md:justify-normal">
                {
                    !loading && posts.length === 0 && 
                    <p className="text-xl text-gray-500">No posts found.</p>
                }
                {
                    loading && <p className="text-xl text-gray-500">
                        Loading...
                    </p>
                }
                {
                    !loading && posts && posts.map( post => (
                        <PostCard post={post} key={post._id} />
                    ))
                }
            </div>
            <button className="w-full text-teal-500 self-center text-lg py-7 hover:underline" onClick={() => navigate('/search')}>
                View all posts
            </button>
        </div>
      </div>
    </div>
  )
}
