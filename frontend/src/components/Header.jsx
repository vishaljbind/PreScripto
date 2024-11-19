
import {assets} from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
        {/* Left Side */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-start gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight'>Book Appointment <br /> With Trusted Doctors</p>
            <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                <img className='w-28' src={assets.group_profiles} alt="" />
                <p>Simply browse through our extensive list of trusted doctors,<br className='hidden md:block'/> schedule your appointment hassle-free.</p>
            </div>
            <a href="#" 
               className='flex items-center gap-2 bg-white px-8 py-3 rounded-full
                         text-gray-600 text-sm m-auto hover:scale-105 
                         transition-all duration-300'
                         >Book appointment 
                          <img src={assets.arrow_icon} alt="" className='w-3'/>
                          </a>
        </div>
        {/* Right Side */}
        <div className='w-full md:w-1/2 relative'>
           <img src={assets.header_img} className="w-full md:absolute bottom-0 h-auto rounded-lg" alt="" />
        </div>
    </div>
  )
}

export default Header