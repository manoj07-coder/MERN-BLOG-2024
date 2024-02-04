import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon,FaSun} from 'react-icons/fa'
import {useSelector,useDispatch} from 'react-redux'
import { toggleTheme } from '../redux/theme/themSlice.js'
import { signOutSuccess } from '../redux/user/userSlice.js'


const Header = () => {
    const path = useLocation().pathname;
    const {currentUser} = useSelector((store)=>store.user);
    const {theme} = useSelector((store)=>store.theme)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleSignOut = async ()=>{
        try {
            const res = await fetch('/api/user/signout',{
                method:'POST',
            });
            const data = await res.json();
            dispatch(signOutSuccess());
            navigate('/sign-in')
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap
        text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
         via-purple-500 to-pink-500
        rounded-lg text-white'>Manoj's</span>
        Blog
        </Link>
        <form>
            <TextInput 
                type='text'
                placeholder='Search...'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
            />
        </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill >
            <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill
                onClick={()=>dispatch(toggleTheme())}>
                    {theme === 'light'? <FaMoon /> : <FaSun />}
                </Button>
                {
                    currentUser ? (
                        <Dropdown 
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                            alt='user'
                            img={currentUser.profilePicture}
                            rounded
                            />
                        }>
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-md font-medium truncate'>{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to='/dashboard?tab=profile'>
                                <Dropdown.Item>
                                    Profile
                                </Dropdown.Item>
                            </Link>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to='/sign-in'>
                            <Button gradientDuoTone='purpleToBlue' outline>
                                Sign In
                            </Button>
                        </Link>
                    )
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>
                    Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>
                    About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path==='/projects'} as={'div'}>
                    <Link to='/projects'>
                    Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
    </Navbar>
  )
}

export default Header