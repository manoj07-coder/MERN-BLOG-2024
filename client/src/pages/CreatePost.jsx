import { Select, TextInput,FileInput, Button } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
            Create a Post</h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4 justify-between'>
                <TextInput className='flex-1' placeholder='Title' id='title'
                type='text' required />
                <Select>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">Javascript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                    <option value="nodejs">Node.js</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between
            border border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*' />
                <Button gradientDuoTone='purpleToBlue' type='button' outline size='sm'>
                    Upload Image</Button>
            </div>
            <ReactQuill theme='snow' className='h-72 mb-12' required />
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Publish
            </Button>
        </form>
    </div>
  )
}

export default CreatePost