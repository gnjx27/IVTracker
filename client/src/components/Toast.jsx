import { AnimatePresence, motion } from 'framer-motion';
import ErrorIcon from '../assets/icons/Error.svg';
import SuccessIcon from '../assets/icons/Success.svg';

const Toast = ({ message, type }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className={
                            "absolute left-1/2 -translate-x-1/2 top-14 border flex mt-4 rounded-lg px-4 py-2 w-fit mx-auto shadow-sm"
                            + (type === "error" ? " bg-[#FFF3F5] border-[#DA7E8D]/30" : " bg-[#F0FFF3] border-[#63C3A1]")
                        }
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <img
                            src={type === "error" ? ErrorIcon : SuccessIcon}
                            alt="Error"
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            draggable={false}
                        />
                        <p className={"text-sm" + (type === "error" ? " text-[#DA7E8D]" : " text-[#19AB6D]")}>{message}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Toast;