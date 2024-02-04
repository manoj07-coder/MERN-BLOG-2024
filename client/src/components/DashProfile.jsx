import React, { useEffect, useRef, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {Alert, Button, TextInput} from 'flowbite-react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice.js'

const DashProfile = () => {
  const {currentUser} =  useSelector((state)=>state.user)
  const [image,setImage] = useState(null)
  const [imageUrl,setImageUrl] = useState(null);
  const [uploadProgress,setUploadProgress] = useState(null)
  const [uploadError,setUploadError] = useState(null)
  const [formData, setFormData] = useState({});
  const [imageUploading,setImageUploading] = useState(false)
  const [updateUserSuccess,setUpdateUserSuccess]= useState(null)
  const [updateUserError,setUpdateUserError] = useState(null)
  const imagePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImage = (e)=>{
    const file = e.target.files[0];
    if(file){
      setImage(file);
    }
  }

  useEffect(()=>{
    if(image){
      uploadImage();
    }
  },[image])

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  console.log(formData);

  const uploadImage = ()=>{
    setImageUploading(true);
    setUploadError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime()+ image.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,image);
    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        if(!uploadError){
          const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        }
        },
      (error)=>{
        setUploadError('Could not upload image (file must be less than 2MB)')
        setUploadProgress(null)
        setImageUrl(null)
        setImageUploading(false)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
          setImageUrl(downloadUrl);
          setFormData({...formData,profilePicture:downloadUrl})
          setImageUploading(false);
        })
        
      }
      
    )
  }

  const handleSubmit = async (e)=>{
  e.preventDefault();
  setUpdateUserError(null)
  setUpdateUserSuccess(null)
  if(Object.keys(formData).length === 0){
    setUpdateUserError('No changes made')
  return;
  }
  if(imageUploading){
    setUpdateUserError('Please wait for image to upload')
    return;
  }
  try {
    const res = await fetch(`/api/user/update/${currentUser._id}`,{
    method:'PUT',
    headers:{
    'Content-Type':'application/json',
    },
    body:JSON.stringify(formData),
    });
    const data = await res.json();
    if(!res.ok){
      dispatch(updateFailure(data.message))
      setUpdateUserError(data.message)
    }else{
      dispatch(updateSuccess(data))
      setUpdateUserSuccess("User's profile updated successfully")
    }
  } catch (error) {
    dispatch(updateFailure(error.message))
    setUpdateUserError(error.message)
  }
}

  return (
    <div className='max-w-lg mx-auto w-full p-3'>
    <h1 className='text-center my-7 font-semibold text-3xl'>Profile</h1>
    <form className='flex flex-col gap-5' onSubmit={handleSubmit} >
      <input type="file" accept='images/*' onChange={handleImage}
      ref={imagePickerRef} hidden/>
         <div className='relative w-32 h-32 self-center shadow-md rounded-full cursor-pointer overflow-hidden'
         onClick={()=>imagePickerRef.current.click()} >
          {
            uploadProgress && (
              
              <CircularProgressbar  value={uploadProgress || 0}
              text={`${uploadProgress}%`}
              strokeWidth={5}
              styles={{
                root:{
                  width:'100%',
                  height:'100%',
                  position:'absolute',
                  top:0,
                  left:0,
                },
                path:{
                  stroke:`rgba(62,152,199,${uploadProgress / 100})`,
                }
              }} />
              )
            }
          <img src={imageUrl || currentUser.profilePicture} alt="user"
          className={` rounded-full w-full h-full object-cover border-4 border-[lightgray] 
          ${uploadProgress && uploadProgress < 100 && 'opacity-60'}`}
           />
         </div>
         {
          uploadError && <Alert color='failure'>{uploadError}</Alert>
         }
         <TextInput id='username' type='text' placeholder='username'
         defaultValue={currentUser.username} onChange={handleChange}/>
         <TextInput id='email' type='email' placeholder='email'
         defaultValue={currentUser.email} onChange ={handleChange} />
         <TextInput id='password' type='password' placeholder='password' onChange= {handleChange} />
         <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
         </Button>
    </form>
    <div className='text-red-500 flex justify-between mt-5'>
      <span className='cursor-pointer'>Delete Account</span>
      <span>Sign Out</span>
    </div>
    {
      updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )
    }
    {
      updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )
    }
    </div>

  )
}

export default DashProfile