import { useState, useEffect } from "react"
import {Button, TextInput} from 'flowbite-react'
import {useNavigate, useLocation} from 'react-router-dom';
import { Select } from "flowbite-react";
import PostCard from '../components/PostCard'


export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect( () => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if(searchTermFromUrl || categoryFromUrl || sortFromUrl){
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl || sidebarData.searchTerm,
                sort: sortFromUrl || sidebarData.sort,
                category: categoryFromUrl || sidebarData.category
            })
        }
        const fetchPosts = async() => {
            try{
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/post/getposts?${searchQuery}`);

                if(!res.ok){
                    setLoading(false);
                    return;
                }

                if(res.ok){
                    const data = await res.json();
                    setPosts(data.posts);
                    setLoading(false);
                    setTotalPosts(data.totalPosts);
                    if(data.posts.length < data.totalPosts) setShowMore(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location.search]);

    const handleChange = (e) => {
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }
        if(e.target.id === 'sort'){
            setSidebarData({...sidebarData, sort: e.target.value || "desc"})
        }
        if(e.target.id === 'category'){
            setSidebarData({...sidebarData, category: e.target.value || "uncategorized"})
        }
        
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }


    const handleShowMore = async () => {
        const startIndex = posts.length;
        try {
            const urlParams = new URLSearchParams(location.search);
            const searchQuery = urlParams.toString();

            const res = await fetch(`/api/post/getposts?${searchQuery}&startIndex=${startIndex}`);
                const data = await res.json();

                if(res.ok){
                    const updatedPosts = posts.concat(data.posts)
                    setPosts(updatedPosts);
                    if(updatedPosts.length >= data.totalPosts) setShowMore(false) ;
                } else {
                    setPosts([]);
                }
        } catch(error) {
            console.log(error.message)
        }
    }



    return (
      <div className="flex flex-col md:flex-row ">
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500 ">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Search Term:</label>
                    <TextInput 
                    placeholder="Search for..."
                    id="searchTerm"
                    type="text"
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Sort</label>
                   <Select onChange={handleChange} id="sort" defaultValue={sidebarData.sort || "desc"}>
                        <option value={"desc"}>Latest</option>
                        <option value="asc">Oldest</option>
                   </Select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Sort</label>
                   <Select onChange={handleChange} id="category" defaultValue={sidebarData.category || "uncategorized"}>
                        <option value={"uncategorized"}>
                            Select a category
                        </option>
                        <option value={"Javascript"}>
                            Javascript
                        </option>
                        <option value={"React"}>
                            React
                        </option>
                        <option value={"NodeJs"}>
                            NodeJs
                        </option>
                        <option value={"Redux"}>
                            Redux
                        </option>          
                        <option value={"TailwindCss"}>
                            TailwindCss
                        </option>
                   </Select>
                </div>
                <Button type="submit" gradientDuoTone={"purpleToPink"} outline className="mt-5">Apply filters</Button>
            </form>
        </div>
        <div className="w-full">
            <h1 className="text-3xl sm:border-b border-gray-500 p-3 mt-5 text-nowrap ">Posts results:</h1>
            <div className="p-7 flex flex-wrap gap-4">
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
                        <PostCard post={post} key={post._id}/>
                    ))
                }
            </div>
            {
                    showMore && (posts.length >= 9 && posts.length < totalPosts) && 
                    <button className="w-full text-teal-500 self-center text-sm py-7 hover:underline" onClick={handleShowMore}>
                        Show More
                    </button>
            }
        </div>
      </div>
    )
  }
  