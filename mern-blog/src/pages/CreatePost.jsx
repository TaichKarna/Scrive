import {
  TextInput, Select,
  FileInput, Button,
} from 'flowbite-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function CreatePost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className="text-center text-3xl my-7  font-semibold">Create a post</h1>
      <form className='flex flex-col gap-4'>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput type='text' placeholder='Title' required
          className='flex-1' id='title'>
          </TextInput>
            <Select>
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
          <FileInput type='file' accept='image/.*'/>
          <Button type='button' gradientDuoTone="purpleToBlue" size='sm' outline>Upload Image</Button>
        </div>
        <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required></ReactQuill>
        <Button type='submit' gradientDuoTone={'purpleToPink'} className='w-full'>Publish</Button>
      </form>
    </div>
  )
}
