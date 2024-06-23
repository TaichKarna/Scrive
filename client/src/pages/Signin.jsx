import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import {signinFailure, signinStart, signinSuccess} from "../redux/user/userSlice"
import Oauth from "../components/Oauth";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessages} = useSelector( (state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]: e.target.value.trim()})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.password || !formData.email){
      return dispatch(signinFailure("All fields are required"));
    }

    try {
      dispatch(signinStart());

      const res = await fetch('/api/auth/signin',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if(data.success === false){
        dispatch(signinFailure(data.message));
      }

      if(res.ok){
        dispatch(signinSuccess(data));
        navigate('/');
      }

    } catch(error){
      dispatch(signinFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex mx-auto p-3 max-w-3xl flex-col md:flex-row md:items-center gap-3">
      <div className="flex-1 flex-wrap">
        <Link to={`/`}  className=" whitespace-nowrap font-bold dark:text-white text-4xl">
           <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
           rounded-lg text-white">Taichi&apos;(s</span>Blog
        </Link>
        <p className="text-sm mt-5">
          This is a demo blog. You can sign in with email or using google.
        </p>
      </div>
      <div className="flex-1">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
              <Label value="Your email"/>
              <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange}/>
          </div>          <div>
              <Label value="Your password"/>
              <TextInput type="password" placeholder="**********" id="password" onChange={handleChange}/>
          </div> 
          <Button gradientDuoTone={"purpleToPink"} type="submit" disabled={loading}
          > {loading ? (<div> <Spinner size={"sm"} /> <span className="pl-3">loading...</span></div>) : "Sign In"}</Button>   
          <Oauth/>
        </form>
        <div className="pt-5 flex  gap-2 text-sm">
          <span>Don&apos;t have an account?</span>
          <Link to={'/sign-up'} className="text-blue-500"> Sign up</Link>
        </div>
        {
          errorMessages && (
            <Alert color={"failure"} className="mt-5">{errorMessages}</Alert>
          )
        }
      </div>
      </div>
    </div>
  )
}
