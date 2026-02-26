import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRegisterModal } from '../contexts/RegisterModalContext';
import { useLoginModal } from '../contexts/LoginModalContext';
import { useState } from 'react';
import Hamburger from 'hamburger-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NavBar() {
    const { user, logout } = useAuth();
    const { openRegisterModal, closeRegisterModal } = useRegisterModal();
    const { openLoginModal, closeLoginModal } = useLoginModal();
    const [open, setOpen] = useState(false);

    const handleRegisterClick = () => {
        if (!user) {
            closeLoginModal();
            openRegisterModal();
        } else {
            console.log("User already logged in.");
        }
    }

    const handleLoginClick = () => {
        closeRegisterModal();
        openLoginModal();
    }

    const handleLogoutClick = () => {
        logout();
    }

    return (
        <nav className='fixed top-0 w-full bg-white z-50 h-14 px-4 border-b-1 border-[#313131]/20'>
            <div className='flex max-w-6xl h-full mx-auto justify-between items-center'>
                {/* Logo */}
                <h1 className='flex-1 py-1 text-[#525FF2] font-bold text-2xl'>IVTracker</h1>

                {/* Desktop nav links */}
                <ul className='hidden md:flex space-x-2 text-[#121643] text-md font-medium'>
                    <li><Link to="/iv-surface" className='hover:bg-[#F2F2F2] transition-colors duration-200 ease-in-out px-4 py-2 rounded-xl'>IV Surface</Link></li>
                    <li><Link to="/trackers" className='hover:bg-[#F2F2F2] transition-colors duration-200 ease-in-out px-4 py-2 rounded-xl'>Trackers</Link></li>
                    <li><Link to="/about" className='hover:bg-[#F2F2F2] transition-colors duration-200 ease-in-out px-4 py-2 rounded-xl'>About</Link></li>
                </ul>

                {/* Desktop auth buttons */}
                <div className='hidden md:flex-1 md:flex justify-end space-x-2'>
                    {!user ? (
                        <>
                            <button onClick={handleLoginClick} className='px-6 py-1 border border-[#313131]/50 rounded-full hover:bg-[#F2F2F2] transition-colors duration-200 ease-in-out cursor-pointer'>
                                <p className='text-md font-regular text-[#313131]'>Login</p>
                            </button>
                            <button onClick={handleRegisterClick} className='px-6 py-1 rounded-full bg-[#121643] hover:bg-[#121643]/75 transition-colors duration-200 ease-in-out cursor-pointer'>
                                <p className='text-[#FFFFFF] font-regular text-md'>Register</p>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogoutClick}
                            className='px-6 py-1 border border-[#313131]/50 rounded-full hover:bg-[#F2F2F2] transition-colors duration-200 ease-in-out cursor-pointer'
                        >
                            <p className='text-md font-regular text-[#313131]'>Logout</p>
                        </button>
                    )}
                </div>

                {/* Mobile animated hamburger */}
                <div className="md:hidden -mr-2">
                    <Hamburger
                        toggled={open}
                        toggle={setOpen}
                        size={24}
                        color='#121643'
                    />
                </div>
            </div>
            {/* Mobile menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className='md:hidden absolute right-4 top-14 w-52 bg-white border border-[#313131]/20 rounded-xl shadow-lg origin-top-right'
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <ul className="flex flex-col text-[#121643] text-sm font-medium">
                    <li>
                        <Link
                            to="/iv-surface"
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 hover:bg-[#F2F2F2] transition-colors rounded-t-xl"
                        >
                            IV Surface
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/trackers"
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 hover:bg-[#F2F2F2] transition-colors"
                        >
                            Trackers
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 hover:bg-[#F2F2F2] transition-colors"
                        >
                            About
                        </Link>
                    </li>

                    {/* Divider */}
                    <div className="border-t border-[#313131]/10" />

                    {!user ? (
                        <>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    handleLoginClick();
                                }}
                                className="text-left px-4 py-2 hover:bg-[#F2F2F2] transition-colors cursor-pointer"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    handleRegisterClick();
                                }}
                                className="text-left px-4 py-2 hover:bg-[#F2F2F2] transition-colors cursor-pointer rounded-b-xl"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setOpen(false);
                                logout();
                            }}
                            className="text-left px-4 py-2 hover:bg-[#F2F2F2] transition-colors cursor-pointer rounded-b-xl"
                        >
                            Logout
                        </button>
                    )}
                </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
