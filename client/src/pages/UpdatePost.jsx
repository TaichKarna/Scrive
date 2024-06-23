import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {
  TextInput, Select,
  FileInput, Button,
  Alert,
} from 'flowbite-react'
import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import {useNavigate, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [value, setValue] = useState('');
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigator = useNavigate();
  const { currentUser } = useSelector( state => state.user)
  const {postId} = useParams();


  useEffect( () => {
    setFormData({...formData,content: value})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value])


useEffect(() => {
  try {
    const fetchPosts = async () => {

      const res = await fetch(`/api/post/getposts?postId=${postId}`);
      const data = await res.json();
      if(res.ok){
          setFormData(data.posts[0]);
      } 
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
    }
    
    fetchPosts();
  
  } catch(error) {
    console.log(error.message);
  }


},[postId]);



  const handleUploadImage = async () => {
    try{
      if(!file){
        setImageUploadError("No file has been selected");
        return;
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {snapshot
          const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          setImageUploadProgress(progress.toFixed(0)); 
        },
        () => {
          setImageUploadError("Could not upload image");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( (downloadUrl) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({...formData, image: downloadUrl})
          })
        }
      )

    } catch(error) {
      setImageUploadError("Image upload failed");
      setImageUploadError(null);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/update-post/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
      if(res.ok){
        setPublishError(null);
        navigator(`/post/${data.slug}`);
      }
    } catch(error) {
      setPublishError('something went wrong')
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className="text-center text-3xl my-7  font-semibold">Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput type='text' placeholder='Title' required
          className='flex-1' id='title' value={formData.title || ''} 
          onChange={(e) => { 
            setFormData({...formData,title: e.target.value})
        }}  
          />
            <Select value={formData.category || 'uncategorized'} onChange={(e) => setFormData({...formData, category: e.target.value})}>
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
        <div className='flex justify-between gap-4 items-center border-4 border-dotted border-teal-500 p-3 1'>
          <FileInput type='file' accept='image/.*' onChange={(e) => setFile(e.target.files[0])}/>
          <Button type='button' gradientDuoTone="purpleToBlue" size='sm' outline
          onClick={handleUploadImage} disabled={imageUploadProgress}>
            {
              imageUploadProgress ? ( 
              <div className='w-16 h-16 text-lg'>
                <CircularProgressbar value={imageUploadProgress} 
              text={`${imageUploadProgress || 0}%`} strokeWidth={4} />
              </div>
              ) :
              "Upload Image"
            }
          </Button>
        </div>
        {
        imageUploadError && 
        <Alert color={'failure'} className='my-3'>
          {imageUploadError}
        </Alert>
        }
        {
          formData && formData.image && (
          <img src={formData.image}
          alt='upload'
          className='w-full h-72 object-cover'></img>
          )
        }
        <ReactQuill theme='snow' placeholder='Write something...' 
          className='h-72 mb-12' required
          onChange={setValue} value={formData.content}
        />
        <Button type='submit' gradientDuoTone={'purpleToPink'} className='w-full'>
          Update
        </Button>
        {
          publishError && <Alert color={'failure'} className='mt-4' >{publishError}</Alert>
        }
      </form>
    </div>
  )
}
