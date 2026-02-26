import { useState } from 'react';
import ErrorIcon from '../assets/icons/Error.svg';
import Graph3d from '../components/Graph3d';
import { BarLoader } from 'react-spinners';
import api from '../services/api';

export default function IVSurface() {
    const [ticker, setTicker] = useState("");
    const [q, setQ] = useState(0.013);
    const [minStrikePct, setMinStrikePct] = useState(80);
    const [maxStrikePct, setMaxStrikePct] = useState(120);
    const [data, setData] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData();
        setLoading(true);

        // Make a GET request to generate IV Points
        const payload = { ticker, q, min_strike_pct: minStrikePct, max_strike_pct: maxStrikePct };
        api
            .post("/options/ivpoints/", payload)
            .then((response) => {
                setLoading(false);
                setErrorMessage("");
                setData(response.data);
            })
            .catch(err => {
                setLoading(false);
                const error = err.response?.data?.detail;
                setErrorMessage(error);
                console.error("Error sending POST request to /ivpoints:", err.response?.data?.detail || err.message);
            });
    };

    return (
        <div className='max-w-screen-md mx-auto'>
            <h1 className='text-center text-lg sm:text-2xl md:text-3xl font-semibold text-[#313131]'>
                Implied Volatility Surface Explorer
            </h1>
            <div className='mt-8 md:mt-12'>
                <form onSubmit={handleSubmit} className='border-b border-[#313131]/20 pb-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-31 gap-4 md:gap-4'>
                        {/* Ticker Symbol */}
                        <div className='flex flex-col sm:col-span-1 md:col-span-10'>
                            <label className='mb-2 text-[#313131]/80 font-light text-sm sm:text-base'>Ticker Symbol</label>
                            <input
                                required
                                type='text'
                                className='focus:outline-none border border-[#313131]/20 rounded-lg px-3 py-2 w-full text-[#313131] text-sm sm:text-base uppercase'
                                placeholder='E.g "SPY", "AAPL", "TSLA"'
                                onChange={e => setTicker(e.target.value.toUpperCase())}
                            />
                        </div>

                        {/* Strike Range */}
                        <div className='flex flex-col sm:col-span-1 md:col-span-11'>
                            <label className='mb-2 text-[#313131]/80 font-light text-sm sm:text-base'>Strike Range (% of spot price)</label>
                            <div className='flex flex-row items-center space-x-3'>
                                <div className='flex items-center border border-[#313131]/20 rounded-lg overflow-hidden'>
                                    <input
                                        type='number'
                                        min={50}
                                        max={199}
                                        step={1}
                                        value={minStrikePct}
                                        className='focus:outline-none px-2 py-2 w-12 sm:w-14 text-[#313131] text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                        onChange={e => setMinStrikePct(parseInt(e.target.value))}
                                    />
                                    <div className='flex'>
                                        <button
                                            type='button'
                                            className='px-2 py-0.5 hover:bg-[#313131]/5 text-[#313131] text-sm sm:text-base leading-none'
                                            onClick={() => setMinStrikePct(Math.min(199, minStrikePct + 1))}
                                        >
                                            +
                                        </button>
                                        <button
                                            type='button'
                                            className='px-2 py-0.5 hover:bg-[#313131]/5 text-[#313131] text-sm sm:text-base leading-none'
                                            onClick={() => setMinStrikePct(Math.max(50, minStrikePct - 1))}
                                        >
                                            −
                                        </button>
                                    </div>
                                </div>
                                <p className='text-[#313131]/60 text-sm sm:text-base'>to</p>
                                <div className='flex items-center border border-[#313131]/20 rounded-lg overflow-hidden'>
                                    <input
                                        type='number'
                                        min={51}
                                        max={200}
                                        step={1}
                                        value={maxStrikePct}
                                        className='focus:outline-none px-2 py-2 w-12 sm:w-14 text-[#313131] text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                        onChange={e => setMaxStrikePct(parseInt(e.target.value))}
                                    />
                                    <div className='flex'>
                                        <button
                                            type='button'
                                            className='px-2 py-0.5 hover:bg-[#313131]/5 text-[#313131] text-sm sm:text-base leading-none'
                                            onClick={() => setMaxStrikePct(Math.min(200, maxStrikePct + 1))}
                                        >
                                            +
                                        </button>
                                        <button
                                            type='button'
                                            className='px-2 py-0.5 hover:bg-[#313131]/5 text-[#313131] text-sm sm:text-base leading-none'
                                            onClick={() => setMaxStrikePct(Math.max(51, maxStrikePct - 1))}
                                        >
                                            −
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dividend % */}
                        <div className='flex flex-col md:col-span-5'>
                            <label className='mb-2 text-[#313131]/80 font-light text-sm sm:text-base'>Dividend %</label>
                            <input
                                type='number'
                                step="0.0001"
                                value={q}
                                className='focus:outline-none border border-[#313131]/20 rounded-lg px-3 py-2 w-full text-[#313131]'
                                onChange={e => setQ(parseFloat(e.target.value))}
                            />
                        </div>

                        {/* Generate Button */}
                        <div className='flex flex-col justify-end md:col-span-5'>
                            <button
                                className='bg-[#63C3A1] hover:bg-[#119A6A] rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out text-white font-medium text-md w-full'
                                disabled={loading}
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {(loading) && (
                <div className='bg-[#F0FFF3] mt-8 sm:mt-12 p-4 sm:p-8 max-w-screen-sm mx-auto flex flex-col items-center'>
                    <p className='mb-4 text-center text-[#757575]'>Generating implied volatility surface, please wait...</p>
                    <div className='w-full max-w-[350px]'>
                        <BarLoader
                            loading={loading}
                            color="green"
                            width="100%"
                            className='text-center bg-green-200'
                        />
                    </div>
                </div>
            )}
            {(!data) && (!errorMessage) && (!loading) && (
                <div className='bg-[#F0FFF3] mt-8 sm:mt-12 p-4 sm:p-8 max-w-screen-sm mx-auto'>
                    <p className='text-center text-[#757575]'>Enter a ticker, strike range, and dividend yield, then click <span className='text-[#313131] font-medium'>Generate</span> to visualize the implied volatility surface.</p>
                </div>
            )}
            {(errorMessage) && (!loading) && (
                <div className='bg-[#FFF3F5] mt-8 sm:mt-12 p-4 sm:p-8 max-w-screen-sm mx-auto'>
                    <div className="flex justify-center">
                        <div className="flex items-start bg-[#FFF3F5] px-4 py-3 rounded-md max-w-screen-sm">
                            <img
                                src={ErrorIcon}
                                alt="Error"
                                className="w-6 h-6 mr-2 flex-shrink-0"
                                draggable={false}
                            />
                            <p className="text-[#DA7E8D] text-sm">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}
            {(data) && (
                <div className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
                    <Graph3d data={data} />
                </div>
            )}
        </div>
    )
}
