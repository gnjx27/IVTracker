import DjangoIcon from '../assets/icons/Django.svg';
import PostgresIcon from '../assets/icons/Postgres.svg';
import ReactIcon from '../assets/icons/React.svg';
import TailwindIcon from '../assets/icons/Tailwind.svg';

export default function () {
  return (
    <div className="pb-50 max-w-screen-md mx-auto">
      <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold text-[#313131]">
        About
      </h1>

      <h2 className="mt-8 md:mt-12 text-center font-semibold text-[#313131] text-base sm:text-lg">
        Overview
      </h2>

      <h3 className="mt-4 text-center text-sm sm:text-base font-normal text-[#313131] leading-relaxed">
        IVTracker is a web-based tool designed to help traders and learners visualise implied volatility surfaces for options. It allows users to explore how implied volatility changes across strike prices and expiration dates, and to automatically track these surfaces over time.
      </h3>

      <h2 className="mt-24 text-center font-semibold text-[#313131] text-base sm:text-lg">
        How it works
      </h2>

      <div className="mt-6 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-[#F0FFF3] p-6">
          <div className="flex">
            <div className="mr-5">
              <span className="text-[#6F86E4] text-3xl sm:text-4xl font-semibold">1</span>
            </div>
            <div>
              <span className="text-[#757575] text-lg sm:text-xl font-medium">
                Data Retrieval
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-2">
            <span className="text-[#757575] text-sm sm:text-sm font-normal sm:font-light leading-relaxed">
              IVTracker fetches real-time options data from Yahoo Finance using the open-source Python library yfinance.
            </span>
          </div>
        </div>

        <div className="bg-[#F0FFF3] p-6">
          <div className="flex">
            <div className="mr-5">
              <span className="text-[#6F86E4] text-3xl sm:text-4xl font-semibold">2</span>
            </div>
            <div>
              <span className="text-[#757575] text-lg sm:text-xl font-medium">
                Filtering
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-2">
            <span className="text-[#757575] text-sm sm:text-sm font-normal sm:font-light leading-relaxed">
              The system filters out invalid options (zero bid/ask prices, strikes outside the user's specified range, or expirations within one week).
            </span>
          </div>
        </div>

        <div className="bg-[#F0FFF3] p-6">
          <div className="flex">
            <div className="mr-5">
              <span className="text-[#6F86E4] text-3xl sm:text-4xl font-semibold">3</span>
            </div>
            <div>
              <span className="text-[#757575] text-lg sm:text-xl font-medium">
                IV Calculation
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-2">
            <span className="text-[#757575] text-sm sm:text-sm font-normal sm:font-light leading-relaxed">
              Implied volatility for each valid call option is calculated by inverting the Black-Scholes model.
            </span>
          </div>
        </div>

        <div className="bg-[#F0FFF3] p-6">
          <div className="flex">
            <div className="mr-5">
              <span className="text-[#6F86E4] text-3xl sm:text-4xl font-semibold">4</span>
            </div>
            <div>
              <span className="text-[#757575] text-lg sm:text-xl font-medium">
                Risk Free Rate
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-2">
            <span className="text-[#757575] text-sm sm:text-sm font-normal sm:font-light leading-relaxed">
              U.S Treasury yields are fetched through fredapi (FRED API) and interpolated to match each option's time to expiration.
            </span>
          </div>
        </div>

        <div className="bg-[#F0FFF3] p-6">
          <div className="flex">
            <div className="mr-5">
              <span className="text-[#6F86E4] text-3xl sm:text-4xl font-semibold">5</span>
            </div>
            <div>
              <span className="text-[#757575] text-lg sm:text-xl font-medium">
                Dividend Yield
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-2">
            <span className="text-[#757575] text-sm sm:text-sm font-normal sm:font-light leading-relaxed">
              Users input the expected dividend yield manually, as dividend forecasting is non-trivial.
            </span>
          </div>
        </div>

        <div className="bg-[#F0FFF3] p-6">
          <div className="flex">
            <div className="mr-5">
              <span className="text-[#6F86E4] text-3xl sm:text-4xl font-semibold">6</span>
            </div>
            <div>
              <span className="text-[#757575] text-lg sm:text-xl font-medium">
                Snapshots
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-2">
            <span className="text-[#757575] text-sm sm:text-sm font-normal sm:font-light leading-relaxed">
              Registered users can create trackers that capture periodic IV snapshots for comparing changes over time.
            </span>
          </div>
        </div>

      </div>
      
      <h2 className="mt-24 text-center font-semibold text-[#313131] text-base sm:text-lg">
        Intended Users
      </h2>

      <h3 className="mt-4 text-center text-sm sm:text-base font-normal text-[#313131] leading-relaxed">
        IVTracker is designed for traders, analysts, and students who want to better understand option pricing and the behaviour of implied volatility in a visual, data-driven way.
      </h3>

      <h2 className="mt-24 text-center font-semibold text-[#313131] text-base sm:text-lg">
        Tech Stack
      </h2>

      <div className='flex gap-6 sm:gap-12 w-fit mx-auto mt-12'>
        <img className='w-10 sm:w-14' src={DjangoIcon} alt="" />
        <img className='w-10 sm:w-14' src={PostgresIcon} alt="" />
        <img className='w-10 sm:w-14' src={ReactIcon} alt="" />
        <img className='w-10 sm:w-14' src={TailwindIcon} alt="" />
      </div>
    </div>
  )
}