import X from '../assets/icons/X.svg';
import Eye from '../assets/icons/Eye.svg';
import EyeOff from '../assets/icons/EyeOff.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useRegisterModal } from '../contexts/RegisterModalContext';
import { useLoginModal } from "../contexts/LoginModalContext"

export default function LoginModal() {
    const { loginModalIsOpen, closeLoginModal } = useLoginModal();
    const { openRegisterModal } = useRegisterModal();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrorMessage("");
            await login(credentials);
            setCredentials("");
            setShowPassword(false);
            closeLoginModal();
        } catch (err) {
            setErrorMessage("Invalid credentials.")
        }
    }

    const handleCreateClick = () => {
        closeLoginModal();
        openRegisterModal();
    }

    return (
        <AnimatePresence>
            {loginModalIsOpen && (
                <motion.div
                    className="fixed pt-16 sm:pt-36 inset-0 backdrop-blur-[2px] flex justify-center items-start z-40 px-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={closeLoginModal}
                >
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[560px]"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="w-full bg-white rounded-2xl border border-[#757575]/10 shadow-md px-5 sm:px-4 py-6 sm:py-4 flex flex-col items-center"
                        >
                            <img
                                src={X}
                                onClick={closeLoginModal}
                                className="ml-auto w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                                draggable={false}
                            />

                            <div className="flex flex-col items-center pt-4 pb-10 sm:pb-16 w-full">
                                <p className="text-center text-[#313131] font-semibold text-lg sm:text-xl">
                                    Welcome back!
                                </p>

                                <p className="text-[#313131]/90 text-xs sm:text-sm font-normal sm:font-light text-center w-full sm:w-90 mt-4 sm:mt-6 px-2 sm:px-0">
                                    Login to access implied volatility surface snapshots for your tracked tickers over time.
                                </p>

                                <div className="w-full sm:w-80">
                                    <div className="flex flex-col mt-6 sm:mt-8">
                                        {errorMessage && (
                                            <p className="text-center text-xs sm:text-sm text-[#DA7E8D] mb-4">
                                                {errorMessage}
                                            </p>
                                        )}

                                        <label className="text-[#313131] text-xs sm:text-sm font-medium sm:font-normal">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            required
                                            className="bg-[#F6F8FB] text-[#313131] text-sm sm:text-base px-4 py-2.5 sm:py-2 rounded-lg mt-2 focus:outline-none"
                                            placeholder="example@gmail.com"
                                            value={credentials.email}
                                            onChange={(e) =>
                                                setCredentials({ ...credentials, email: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col mt-5 sm:mt-6 relative">
                                        <label className="text-[#313131] text-xs sm:text-sm font-medium sm:font-normal">
                                            Password
                                        </label>

                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            className="bg-[#F6F8FB] text-[#313131] text-sm sm:text-base px-4 py-2.5 sm:py-2 rounded-lg mt-2 focus:outline-none"
                                            value={credentials.password}
                                            onChange={(e) =>
                                                setCredentials({ ...credentials, password: e.target.value })
                                            }
                                        />

                                        <img
                                            src={showPassword ? EyeOff : Eye}
                                            alt="Toggle password visibility"
                                            className="absolute right-3 top-[38px] w-5 h-5 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-[#6F86E4] hover:bg-[#6F86E4]/80 w-full rounded-full px-4 py-2.5 sm:py-2 text-white text-sm sm:text-md font-medium sm:font-regular mt-6 sm:mt-8 cursor-pointer transition-colors duration-200 ease-in-out"
                                    >
                                        Login
                                    </button>

                                    <p className="text-xs sm:text-sm font-normal sm:font-light text-center mt-4 text-[#313131]/90">
                                        Don't have an account?
                                        <b
                                            onClick={handleCreateClick}
                                            className="ml-1 text-[#313131] hover:text-[#313131]/80 font-medium transition-colors duration-100 ease-in-out cursor-pointer"
                                        >
                                            Create Account
                                        </b>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
