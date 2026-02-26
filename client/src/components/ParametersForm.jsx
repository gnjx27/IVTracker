import { useState, useEffect } from 'react'
import axios from 'axios';

const ParametersForm = ({ setData, setParameters }) => {
    const [ticker, setTicker] = useState('SPY');
    const [q, setQ] = useState(0.013);
    const [minStrikePct, setMinStrikePct] = useState(80.0);
    const [maxStrikePct, setMaxStrikePct] = useState(120.0);

    // Keep parent in sync whenever parameters change
    useEffect(() => {
        setParameters({ ticker, q, minStrikePct, maxStrikePct });
    }, [ticker, q, minStrikePct, maxStrikePct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Generate button clicked");

        // Make GET request generate IV points
        const payload = { ticker, q, min_strike_pct: minStrikePct, max_strike_pct: maxStrikePct };
        axios
            .post("http://localhost:8000/api/options/ivpoints/", payload)
            .then((response) => {
                setData(response.data);
            })
            .catch(err => {
                console.error("Error sending GET request to /ivpoints", err.message);
            });
    };

    return (
        <div>
            <p className='font-bold text-2xl mt-4'>Parameters Form</p>
            <form onSubmit={handleSubmit}>
                <div className='mt-2'>
                    <label>Dividend Yield (e.g., 0.013 for 1.3%):</label>
                    <input
                        type="number"
                        step="0.0001"
                        value={q}
                        onChange={e => setQ(parseFloat(e.target.value))}
                        name="q"
                        className='border px-2 ml-4'
                    />
                </div>
                <div className='mt-2'>
                    <label>Ticker Symbol:</label>
                    <input
                        type="text"
                        value={ticker} 
                        onChange={e => setTicker(e.target.value)}
                        name="ticker"
                        className='border px-2 ml-4'
                    />
                </div>
                <div className='mt-2'>
                    <label>Minimum Strike Price (% of Spot Price):</label>
                    <input
                        type="number"
                        name="min_strike_pct"
                        min={50.0}
                        max={199.0}
                        value={minStrikePct} 
                        onChange={e => setMinStrikePct(parseFloat(e.target.value))}
                        step={1.0}
                        className='border px-2 ml-4'
                    />
                </div>
                <div className='mt-2'>
                    <label>Maximum Strike Price (% of Spot Price):</label>
                    <input
                        type="number"
                        name="max_strike_pct"
                        min={51.0}
                        max={200.0}
                        value={maxStrikePct} 
                        onChange={e => setMaxStrikePct(parseFloat(e.target.value))}
                        step={1.0}
                        className='border px-2 ml-4'
                    />
                </div>
                <button type='submit' className='border rounded-full px-3 py-1 mt-4'>Generate</button>
            </form>
        </div>
    )
}

export default ParametersForm;
