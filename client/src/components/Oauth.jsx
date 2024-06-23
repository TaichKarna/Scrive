import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import {app} from '../firebase'
import {signinSuccess} from '../redux/user/userSlice'
import { useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom';

export default function Oauth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth(app);
    const clickGoogleHandler = async() => {

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: 'select_account'});

        try{
            const resultsFromGoogle = await signInWithPopup(auth,provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL
                })
            }
            )

            const data = await res.json();
            if(res.ok){
                dispatch(signinSuccess(data));
                navigate('/');
            }

        } catch(error) {
            ///
        }
    }
  return (
    <Button type="button" gradientDuoTone={"pinkToOrange"} outline className="flex items-center font-semibold"
    onClick={clickGoogleHandler}>
        <AiFillGoogleCircle className="w-6 h-6 mr-2"/> Continue with Google
    </Button>
  )
}
