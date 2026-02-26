import ArrowDropDown from '../assets/icons/ArrowDropDown.svg';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SnapshotIntervalDropdown = ({ interval, setInterval }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { label: "60 minutes", value: "60" },
        { label: "More to come", value: null },
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    const handleSelect = (value, event) => {
        event.stopPropagation();
        setInterval(value);
        setOpen(false);
    }

    return (
        <div className="flex flex-col">
            <label className="mb-2 text-[#313131]/80 font-light text-md">
                Snapshot Interval
            </label>
            <div
                className="relative border border-[#313131]/20 rounded-lg px-3 py-2 w-40 cursor-pointer bg-white"
                ref={dropdownRef}
                onClick={() => setOpen(prev => !prev)}
            >
                <span className='text-[#313131]'>{options.find(o => o.value === interval)?.label || "Select interval"}</span>
                <span className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`}>
                    <img src={ArrowDropDown} />
                </span>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#313131]/20 rounded-lg shadow-md z-10"
                        >
                            {options.map(opt => (
                                <div
                                    key={opt.value}
                                    className="px-3 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[#313131]"
                                    onClick={(event) => handleSelect(opt.value, event)}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default SnapshotIntervalDropdown;