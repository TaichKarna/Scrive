import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Table, Modal, Button} from 'flowbite-react'
import {Link} from 'react-router-dom'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";


export default function DashBoardComp(){
    const { currentUser } = useSelector( state => state.user);
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [userPosts, setUserPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);


    useEffect(() => {
        const fetchUsers = async () => {
           try{
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();

                if(res.ok){
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                } else {
                    setUsers([]);
                }
           } catch (error) {
                console.log(error.message);
           }
        }

        if(currentUser.isAdmin) fetchUsers();
    },[currentUser.isAdmin]);

       
    useEffect(() => {
    
        const fetchPosts = async () => {
           try{
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();

                if(res.ok){
                    setUserPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                } else {
                    setUserPosts([]);
                }
           } catch (error) {
                console.log(error.message);
           }
        }

        if(currentUser.isAdmin) fetchPosts();
    },[currentUser._id, currentUser.isAdmin]);


    useEffect(() => {

        const fetchComments = async () => {
           try{
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();

                if(res.ok){
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                } else {
                    setComments([]);
                }
           } catch (error) {
                console.log(error.message);
           }
        }

        if(currentUser.isAdmin) fetchComments();
    },[currentUser.isAdmin]);



    return (
        <div className="p-3 md:mx-auto ">
            <div className="flex flex-wrap gap-3 items-center justify-center">
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md ">
                <div className="flex justify-between">
                    <div>
                    <h3 className="text-md text-gray-500 uppercase">Total Users</h3>
                    <p className="text-2xl">{totalUsers}</p>
                    </div>
                    <HiOutlineUserGroup className="bg-teal-600 rounded-full text-white text-5xl p-3 shadow-lg"/>
                </div>
                <div className="flex  gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthUsers}
                    </span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div>
                    <h3 className="text-md text-gray-500 uppercase">Total Posts</h3>
                    <p className="text-2xl">{totalPosts}</p>
                    </div>
                    <HiAnnotation className="bg-indigo-600 rounded-full text-white text-5xl p-3 shadow-lg"/>
                </div>
                <div className="flex  gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthPosts}
                    </span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div>
                    <h3 className="text-md text-gray-500 uppercase">Total Comments</h3>
                    <p className="text-2xl">{totalComments}</p>
                    </div>
                    <HiDocumentText className="bg-lime-600 rounded-full text-white text-5xl p-3 shadow-lg"/>
                </div>
                <div className="flex  gap-2 text-sm">
                    <span className="text-green-500 flex items-center">
                        <HiArrowNarrowUp/>
                        {lastMonthComments}
                    </span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            </div>

            
            <div className="flex gap-4 flex-wrap mx-auto justify-center my-5 max-w-4xl">
                <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold items-center">
                        <h1 className="p-2">Recent Users</h1>
                        <Button gradientDuoTone={'purpleToPink'} outline>
                            <Link to={'/dashboard?tab=users'}>See all</Link>
                        </Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {
                            users && users.map( user => (
                                <Table.Body key={user._id} className="divide-y">
                                    <Table.Row  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img className="w-10 h-10 bg-gray-500 rounded-full object-cover" src={user.profilePicture} alt="" />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.username}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        }
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold items-center">
                        <h1 className="p-2">Recent Comments</h1>
                        <Button gradientDuoTone={'purpleToPink'} outline>
                            <Link to={'/dashboard?tab=comments'}>See all</Link>
                        </Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {
                            comments && comments.map( comment => (
                                <Table.Body key={comment._id} className="divide-y">
                                    <Table.Row  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="w-96">
                                            <span className="line-clamp-2">{comment.content}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.numberOfLikes}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        }
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800 max-w-2xl">
                    <div className="flex justify-between p-3 text-sm font-semibold items-center">
                        <h1 className="p-2">Recent posts</h1>
                        <Button gradientDuoTone={'purpleToPink'} outline>
                            <Link to={'/dashboard?tab=posts'}>See all</Link>
                        </Button>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {
                            userPosts && userPosts.map( post => (
                                <Table.Body key={post._id} className="divide-y">
                                    <Table.Row  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img className="w-14 h-10 bg-gray-500 rounded-md " src={post.image} alt="" />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p className="line-clamp-2">                                            
                                                {post.title}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell className="">
                                            <p >                                            
                                                {post.category}
                                            </p>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        }
                    </Table>
                </div>           
            </div>         
        </div>
    )
}