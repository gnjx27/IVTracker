import { useState, useEffect } from 'react';
import SnapshotIntervalDropdown from '../components/SnapshotIntervalDropdown';
import Graph3d from '../components/Graph3d';
import { useAuth } from '../contexts/AuthContext';
import { useLoginModal } from '../contexts/LoginModalContext';
import DeleteIcon from '../assets/icons/Delete.svg';
import ErrorIcon from '../assets/icons/Error.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchTrackers, addTracker, fetchSnapshots, deleteTracker } from '../services/trackerServices';
import Toast from '../components/Toast';

export default function Trackers() {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [ticker, setTicker] = useState("");
  const [q, setQ] = useState(0.013);
  const [minStrikePct, setMinStrikePct] = useState(80);
  const [maxStrikePct, setMaxStrikePct] = useState(120);
  const [errorMessage, setErrorMessage] = useState("");
  const [interval, setInterval] = useState("60");
  const [trackers, setTrackers] = useState([]);
  const [selectedTrackerId, setSelectedTrackerId] = useState();
  const [snapshots, setSnapshots] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackerToDelete, setTrackerToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage])

  useEffect(() => {
    if (!selectedTrackerId) return;
    const getSnapshots = async () => {
      try {
        const snapshots = await fetchSnapshots(selectedTrackerId);
        setSnapshots(snapshots);
      } catch (err) {
        console.log(err);
      }
    }
    getSnapshots();
  }, [selectedTrackerId])

  useEffect(() => {
    if (!user) return;
    let data;
    const getTrackers = async () => {
      try {
        data = await fetchTrackers();
        setTrackers(data);
      } catch (err) {
        console.log(err);
      }
    }
    getTrackers();
  }, [user])

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!user) {
      openLoginModal();
      return;
    }

    try {
      await addTracker(ticker, q, minStrikePct, maxStrikePct, interval);
      setSuccessMessage("Tracker added!");
      const updated = await fetchTrackers();
      setTrackers(updated);
    } catch (err) {
      const message = err.response?.data?.detail;
      setErrorMessage(message);
    }
  }

  const handleDelete = async () => {
    await deleteTracker(trackerToDelete);
    setTrackerToDelete(null);
    setSuccessMessage("Tracker deleted.");
    const updated = await fetchTrackers();
    setTrackers(updated);
  }

  return (
    <div className='relative max-w-screen-md mx-auto pb-50'>
      <h1 className='text-center text-lg sm:text-2xl md:text-3xl font-semibold text-[#313131]'>Trackers</h1>
      <Toast message={errorMessage} type="error" />
      <Toast message={successMessage} type="success" />
      <h2 className='mt-8 md:mt-12 text-[#313131] text-lg font-medium'>Add Tracker</h2>
      <div className='mt-4'>
        <form onSubmit={handleTrack} className='border-b border-[#313131]/20 pb-4'>
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
                className='focus:outline-none border border-[#313131]/20 rounded-lg px-3 py-2 w-full text-[#313131] text-sm sm:text-base'
                onChange={e => setQ(parseFloat(e.target.value))}
              />
            </div>

            {/* Snapshot Interval */}
            <div className='flex flex-col sm:col-span-1 md:col-span-7'>
              <SnapshotIntervalDropdown interval={interval} setInterval={setInterval} />
            </div>

            {/* Track Button */}
            <div className='flex flex-col justify-end md:col-span-5'>
              <button
                type='submit'
                className='bg-[#6F86E4] hover:bg-[#6F86E4]/80 rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out text-white font-medium text-md w-full'
              >
                Track
              </button>
            </div>
          </div>
        </form>
      </div>
      <h2 className='mt-10 text-[#313131] text-lg font-medium'>My Trackers</h2>
      <div className='mt-4'>
        {!user ? (
          <p className='text-[#313131]/60 text-sm italic'>Login to view your trackers.</p>
        ) : trackers.length === 0 ? (
          <p className='text-[#313131]/60 text-sm italic'>No trackers yet.</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='min-w-full border border-[#313131]/10 rounded-lg text-left'>
                <thead className='bg-[#F9FAFB] text-[#313131]/70 text-sm font-medium'>
                  <tr>
                    <th className='px-4 py-2 border-b border-[#313131]/10'>Ticker</th>
                    <th className='px-4 py-2 border-b border-[#313131]/10'>Dividend %</th>
                    <th className='px-4 py-2 border-b border-[#313131]/10'>Min Strike %</th>
                    <th className='px-4 py-2 border-b border-[#313131]/10'>Max Strike %</th>
                    <th className='px-4 py-2 border-b border-[#313131]/10'>Interval (min)</th>
                    <th className='px-4 py-2 border-b border-[#313131]/10'>Created</th>
                    <th className='px-4 py-2 border-b border-[#313131]/10'></th>
                  </tr>
                </thead>
                <tbody className='text-[#313131]/80 text-sm'>
                  {trackers.map(t => (
                    <tr
                      key={t.id}
                      className='hover:bg-[#F8FAFF] transition cursor-pointer'
                      onClick={() => setSelectedTrackerId(t.id)}
                    >
                      <td className='px-4 py-2 font-medium'>{t.ticker}</td>
                      <td className='px-4 py-2'>{t.q}</td>
                      <td className='px-4 py-2'>{t.min_strike_pct}</td>
                      <td className='px-4 py-2'>{t.max_strike_pct}</td>
                      <td className='px-4 py-2'>{t.interval}</td>
                      <td className='px-4 py-2'>
                        {new Date(t.created_at).toLocaleString('en-US', {
                          timeZone: 'America/New_York',
                          hour12: false,
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className='px-4 py-2'>
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrackerToDelete(t.id);
                          }}
                          src={DeleteIcon}
                          className='w-4 h-4 cursor-pointer'
                          alt="Delete"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden space-y-3'>
              {trackers.map(t => (
                <div
                  key={t.id}
                  className='border border-[#313131]/10 rounded-lg p-4 hover:bg-[#F8FAFF] transition cursor-pointer'
                  onClick={() => setSelectedTrackerId(t.id)}
                >
                  <div className='flex justify-between items-start mb-3'>
                    <h3 className='text-[#313131] font-semibold text-lg'>{t.ticker}</h3>
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrackerToDelete(t.id);
                      }}
                      src={DeleteIcon}
                      className='w-5 h-5 cursor-pointer'
                      alt="Delete"
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div>
                      <span className='text-[#313131]/60'>Dividend %:</span>
                      <span className='text-[#313131]/80 ml-1 font-medium'>{t.q}</span>
                    </div>
                    <div>
                      <span className='text-[#313131]/60'>Interval:</span>
                      <span className='text-[#313131]/80 ml-1 font-medium'>{t.interval} min</span>
                    </div>
                    <div>
                      <span className='text-[#313131]/60'>Min Strike %:</span>
                      <span className='text-[#313131]/80 ml-1 font-medium'>{t.min_strike_pct}</span>
                    </div>
                    <div>
                      <span className='text-[#313131]/60'>Max Strike %:</span>
                      <span className='text-[#313131]/80 ml-1 font-medium'>{t.max_strike_pct}</span>
                    </div>
                  </div>
                  <div className='mt-2 pt-2 border-t border-[#313131]/10'>
                    <span className='text-[#313131]/60 text-xs'>Created: </span>
                    <span className='text-[#313131]/80 text-xs'>
                      {new Date(t.created_at).toLocaleString('en-US', {
                        timeZone: 'America/New_York',
                        hour12: false,
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <AnimatePresence>
        {trackerToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setTrackerToDelete(null)}
            className="fixed pt-50 inset-0 backdrop-blur-[2px] flex justify-center items-start z-40"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center border border-[#757575]/10"
            >
              <p className="mb-4 text-[#313131]">Are you sure you want to delete this tracker?</p>
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-200 text-[#313131] rounded-full hover:bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={() => setTrackerToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={() => handleDelete()}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {selectedTrackerId && snapshots.length > 0 && (
        <div className="mt-6 mx-auto w-full max-w-7xl px-4">
          <div className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            {snapshots[currentIndex].error_message !== null ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="bg-[#FFF3F5] px-4 sm:px-8 py-4 sm:py-8 max-w-screen-sm mx-4">
                  <div className="flex items-start">
                    <img
                      src={ErrorIcon}
                      alt="Error"
                      className="w-6 h-6 mr-2 flex-shrink-0"
                      draggable={false}
                    />
                    <p className="text-[#DA7E8D] text-sm">
                      {snapshots[currentIndex].error_message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Graph3d data={snapshots[currentIndex].datapoints} />
            )}
          </div>
          <input
            type="range"
            min={0}
            max={snapshots.length - 1}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="w-full mt-4"
          />
          <p className="text-center mt-2 text-sm sm:text-base text-[#313131]/80">
            {new Date(snapshots[currentIndex].created_at).toLocaleString('en-US', {
              timeZone: 'America/New_York',
              hour12: false,
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            <span className="text-[#313131]/60 ml-2">
              ({currentIndex + 1} of {snapshots.length})
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
