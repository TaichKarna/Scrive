import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Oauth from "../components/Oauth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessages,setErrorMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]: e.target.value.trim()});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.username || !formData.password || !formData.email){
      return setErrorMessages("All fields are required");
    }

    try {
      setLoading(true);
      setErrorMessages(null);

      const res = await fetch('/api/auth/signup',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if(data.success === false){
        setLoading(false);
        return setErrorMessages(data.message);
      }

      setLoading(false)


      if(res.ok){
        navigate('/sign-in')
      }


    } catch(error){
      setErrorMessages(error.message);
      setLoading(false);

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
          This is a demo blog. You can signup with email or using google.
        </p>
      </div>
      <div className="flex-1">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
              <Label value="Your username"/>
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange}/>
          </div>
          <div>
              <Label value="Your email"/>
              <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange}/>
          </div>          <div>
              <Label value="Your password"/>
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>
          </div> 
          <Button gradientDuoTone={"purpleToPink"} type="submit" disabled={loading}
          > {loading ? (<div> <Spinner size={"sm"} /> <span className="pl-3">loading...</span></div>) : "Sign Up"}</Button>   
        <Oauth/>
        </form>
        <div className="pt-5 flex  gap-2 text-sm">
          <span>Have an account?</span>
          <Link to={'/sign-in'} className="text-blue-500"> Sign in</Link>
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
