import {useSelector} from 'react-redux';
import {TextInput, Button, Alert} from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import  {CircularProgressbar} from 'react-circular-progressbar';
import {updateSuccess, updateFailure, updateStart} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashProfile() {

  const {currentUser} = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading,setImageFileUploading] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError,setUpdateUserError] = useState(null);
  const filePickerRef = useRef();
  const [formData,setFormData] = useState({});
  const dispatch = useDispatch();


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  const handleFormChange = (e) => {
    setFormData({...formData,
       [e.target.id]: e.target.value})
  }

  useEffect( () => {1
    if(imageFile){
      uploadImageFile();
    }
  },[imageFile]);

  
  const uploadImageFile = async() => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.bytesTransferred/snapshot.totalBytes * 100;
        setImageFileUploadingProgress(progress.toFixed(0))
      },
      (error) => {
        setImageFileUploadError('Could not upload image (image size must be less than 2MB)');
        setImageFile(null);
        setImageFileUploadingProgress(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then( (downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({...formData, profilePicture: downloadUrl});
          setImageFileUploading(false);
        })
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);


    if(imageFileUploading){
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes made');
      return;
    }
    
    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json();
      
      if(!response.ok){
        dispatch(updateFailure(data.messsage));
        setUpdateUserError(data.messsage);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User profile updated successfully");
        setFormData({});
      }

    } catch(error) {
     /// 
      dispatch(updateFailure(error.message))
      setUpdateUserError(error);

    }

  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type='file' accept='images/*' onChange={handleImageChange} ref={filePickerRef} hidden></input>
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden"
          onClick={() => filePickerRef.current.click()}>
          {
            imageFileUploadingProgress && (
              <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={4}
              styles={{
                root:{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',

                },
                path:{
                  stroke: `rgba(62,152,199,${imageFileUploadingProgress/100})`,
                },

              }}
              />
            )
          }
          <img src={imageFileUrl || currentUser.profilePicture} alt="user"
           className={`rounded-full
            w-full h-full border-8 border-[lightgray] object-cover
          ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}
          `}/>
        </div>
        {imageFileUploadError &&   <Alert color={'failure'}>{imageFileUploadError}</Alert>
      }
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username} onChange={handleFormChange}
          />
          <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email} onChange={handleFormChange}
          />
          <TextInput
          type='password'
          id='password'
          placeholder='password'
          defaultValue="**********" onChange={handleFormChange}
          />
          <Button type='submit' gradientDuoTone={'purpleToBlue'} outline
          >
            Update
          </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      { 
        updateUserSuccess && 
        <Alert color={'success'} className='mt-5'>
          {updateUserSuccess}
        </Alert>
      }
      {
        updateUserError &&  
        <Alert color={'failure'} className='mt-5'>
          {updateUserError}
        </Alert>
      }
    </div>
  )
}
