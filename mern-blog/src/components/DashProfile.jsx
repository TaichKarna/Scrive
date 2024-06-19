import {useSelector} from 'react-redux';
import {TextInput, Button, Alert, Modal} from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import  {CircularProgressbar} from 'react-circular-progressbar';
import {updateSuccess, 
  updateFailure, 
  updateStart, 
  deleteFailure, 
  deleteStart, 
  deleteSuccess,
  signOutSuccess
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {useNavigate} from 'react-router-dom';

export default function DashProfile() {

  const {currentUser} = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading,setImageFileUploading] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError,setUpdateUserError] = useState(null);
  const [showDeleteModal,setShowDeleteModal] = useState(false);
  const filePickerRef = useRef();
  const [formData,setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect( () => {
    if(imageFile){
      uploadImageFile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      () => {
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

  const handleDelete = async () => {
    setShowDeleteModal(false);

    try{
      dispatch(deleteStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, 
      {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        },
      });
      const data = await response.json();

      if(!response.ok){
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess());
        navigate("/");
      }

    } catch (error) {
      dispatch(deleteFailure(error.message))
    }
  }


  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/user/signout',{
        method: 'POST'
      });
      const data = await response.json();
    
      if(!response.ok){
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/");
      }
    
    } catch(error) {
      console.log(error.message);
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
          defaultValue={currentUser.password} onChange={handleFormChange}
          />
          <Button type='submit' gradientDuoTone={'purpleToBlue'} outline
          >
            Update
          </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </span>
        <Modal show={showDeleteModal} size={'md'} onClose={() => setShowDeleteModal(false)} popup>
          <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='mx-auto w-14 h-14 text-gray-400 mb-4'/>
              <h3 className='text-gray-500 text-lg font-normal mb-5 dark:text-gray-400'>
                Are you sure you want to delete your account?
              </h3>
              <div className='flex justify-center gap-5'>
                <Button color='failure' onClick={handleDelete}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                  {"No, cancel"}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <span className="cursor-pointer" onClick={handleSignOut}>Sign Out</span>
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
