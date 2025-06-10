import { Instagram } from 'lucide-react';
import logo from '../assets/image/logo_artanita.png';
import { Input } from './ui/input';
import { Button } from './ui/button';
import bg from '../assets/image/bg-wa.png';

export default function Footer() {
  return (
    <footer style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
       >
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col  space-y-4">
            <div className="w-18 lg:w-24 lg:h-24">
              <img src={logo} alt="Artanita Logo" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-white max-w-xs">
              Panti Asuhan Artanita Sangat Menerima Kebaikan Dari Semua Orang
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex  flex-col  justify-start space-y-4">
            <h3 className="!text-lg !text-white font-semibold !mb-4">Fitur</h3>
            <nav className="flex flex-col  space-y-3">
              <a href="/" className="text-sm !text-white hover:text-gray-300">Beranda</a>
              <a href="/about/sejarah" className="text-sm !text-white hover:text-gray-300">Tentang Panti</a>
              <a href="/campaign" className="text-sm !text-white hover:text-gray-300">Program Donasi</a>
              <a href="/activity" className="text-sm !text-white hover:text-gray-300">Aktivitas</a>
            </nav>
          </div>

          {/* Newsletter and Social */}
          <div className="flex flex-col space-y-6">
            <div className="!space-y-6">
              <h3 className="!text-lg !text-white font-semibold">Get the latest information from us</h3>
              <div className="flex gap-4">
                <div className="relative flex-grow gap-5 ">
                 
                  <Input placeholder="Enter your email address" className="w-full py-2 pl-10 pr-3 rounded-full text-white focus:outline-none" />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
                <Button className='bg-[#379777] !px-4 hover:bg-[#2a7057] text-white py-4 rounded-full font-medium focus:outline-none'>Subscribe</Button>
              </div>
            </div>

            <div className="!space-y-4">
              <h3 className="!text-lg !text-white font-semibold">Join social platform</h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/yayasan_artanita/" target="_blank" rel="noopener noreferrer" className="!text-white hover:text-gray-300">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}