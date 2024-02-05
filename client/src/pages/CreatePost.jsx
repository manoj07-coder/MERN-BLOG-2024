import { Select, TextInput,FileInput, Button, Alert } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {app} from '../../firebase.js'
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

    const [file,setFile] = useState(null);
    const [imageUploadProgress,setImageUploadProgress] = useState(null);
    const [imageUploadError,setImageUploadError] = useState(null);
    const [formData,setFormData] = useState({});
    const [publishError,setPublishError] = useState(null)
    const navigate = useNavigate();


    const handelUploadImage = async ()=>{
        if(!file){
            setImageUploadError('Please select an Image');
            return;
        }
         try {
            setImageUploadProgress(null)
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime()+"-"+file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress = (
                        snapshot.bytesTransferred / snapshot.totalBytes
                    ) * 100;
                    setImageUploadProgress(progress.toFixed());
                },
                (error)=>{
                    setImageUploadProgress(null);
                    setImageUploadError('Image upload failed')
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({...formData,image:downloadUrl});
                    })
                }
            )
         } catch (error) {
            setImageUploadProgress(null);
            setImageUploadError('Image upload failed')
            console.log(error);
         }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const res = await fetch('/api/post/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok){
                setPublishError(data.message)
                return;
            }
            if(res.ok){
                setPublishError(null);
                navigate(`/post/${data.slug}`)
            }

        }catch(error){
            setPublishError('Something went wrong!')
        }
    }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
            Create a Post</h1>
        <form className='flex flex-col gap-4'onSubmit={handleSubmit} >
            <div className='flex flex-col sm:flex-row gap-4 justify-between'>
                <TextInput className='flex-1' placeholder='Title' id='title'
                type='text' required onChange={(e)=>setFormData({...formData,title:e.target.value})} />
                <Select onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">Javascript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                    <option value="nodejs">Node.js</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between
            border border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
                <Button gradientDuoTone='purpleToBlue' type='button' outline size='sm'
                onClick={handelUploadImage}>
                    {
                        imageUploadProgress ? 
                        <div className='w-16 h-16'>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                        </div> : ('Upload Image')
                    }
                    </Button>
            </div>
            {
                imageUploadError && (
                    <Alert color='failure'>
                        {imageUploadError}
                    </Alert>
                )
            }
            {
                formData.image && (
                    <img
                    src={formData.image}
                    alt='image'
                    className='w-full h-72 object-cover' />
                )
            }
            <ReactQuill theme='snow' className='h-72 mb-12' required
            onChange={(value)=>setFormData({...formData,content:value})} />
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Publish
            </Button>
            {publishError && <Alert color='failure'>{publishError}</Alert>}
        </form>
    </div>
  )
}

export default CreatePost