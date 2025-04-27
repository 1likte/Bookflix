import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-black/80 to-black"></div>
        </div>

        {/* Floating Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-float"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's',
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          {/* iPhone 16 Pro Max Mockup - Centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-[800px] h-[400px] bg-black rounded-[55px] border-[14px] border-gray-800 shadow-2xl">
              {/* Power Button */}
              <div className="absolute -right-[2px] top-[120px] w-[4px] h-[60px] bg-gray-800 rounded-r-lg"></div>
              
              {/* Volume Buttons */}
              <div className="absolute -left-[2px] top-[100px] w-[4px] h-[40px] bg-gray-800 rounded-l-lg"></div>
              <div className="absolute -left-[2px] top-[160px] w-[4px] h-[40px] bg-gray-800 rounded-l-lg"></div>
              
              {/* Dynamic Island */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl"></div>
              
              {/* Screen Content */}
              <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-blue-900 to-purple-900">
                {/* Book Preview */}
                <div className="h-full flex">
                  {/* Book Cover */}
                  <div className="w-1/2 relative">
                    <img 
                      src="https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg"
                      alt="The Great Gatsby"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                  </div>
                  
                  {/* Book Info */}
                  <div className="w-1/2 p-8 bg-black/30 backdrop-blur-lg flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-2">The Great Gatsby</h3>
                    <p className="text-base text-gray-300 mb-6">By F. Scott Fitzgerald</p>
                    <div className="flex space-x-8 mb-8">
                      <div className="text-center">
                        <span className="block text-2xl font-bold">180</span>
                        <span className="text-sm text-gray-400">Pages</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-bold">1925</span>
                        <span className="text-sm text-gray-400">Published</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-bold">4.8/5</span>
                        <span className="text-sm text-gray-400">Rating</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                      Start Reading
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left Content */}
          <div className="absolute bottom-16 left-16 max-w-lg">
            <h1 className="text-6xl font-bold mb-4">The Great Gatsby</h1>
            <p className="text-xl text-gray-300 mb-8">
              F. Scott Fitzgerald's masterpiece of the Jazz Age follows mysterious millionaire Jay Gatsby and his obsession with beautiful former debutante Daisy Buchanan.
            </p>
            <div className="flex space-x-4">
              <Button 
                onClick={() => navigate('/reader/gatsby')}
                className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 text-lg"
                leftIcon={<Play size={24} />}
              >
                Read Now
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3 text-lg"
                leftIcon={<Info size={24} />}
              >
                More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-6 py-8 space-y-8">
        {/* Trending Now */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-md overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  src={`https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&h=400`}
                  alt={`Trending Book ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Continue Reading */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Continue Reading</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-md overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  src={`https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&h=400`}
                  alt={`Continue Reading Book ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* New Releases */}
        <div>
          <h2 className="text-2xl font-bold mb-4">New Releases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-md overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  src={`https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&h=400`}
                  alt={`New Release Book ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Popular in Your Language */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular in Your Language</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-md overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  src={`https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&h=400`}
                  alt={`Language Book ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Netflix-style Footer */}
      <footer className="bg-black py-16 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Social Links */}
          <div className="flex space-x-4 mb-8">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Youtube size={24} />
            </a>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div className="space-y-4">
              <a href="#" className="block text-gray-400 hover:text-white">Audio Description</a>
              <a href="#" className="block text-gray-400 hover:text-white">Investor Relations</a>
              <a href="#" className="block text-gray-400 hover:text-white">Legal Notices</a>
            </div>
            <div className="space-y-4">
              <a href="#" className="block text-gray-400 hover:text-white">Help Center</a>
              <a href="#" className="block text-gray-400 hover:text-white">Jobs</a>
              <a href="#" className="block text-gray-400 hover:text-white">Cookie Preferences</a>
            </div>
            <div className="space-y-4">
              <a href="#" className="block text-gray-400 hover:text-white">Gift Cards</a>
              <a href="#" className="block text-gray-400 hover:text-white">Terms of Use</a>
              <a href="#" className="block text-gray-400 hover:text-white">Corporate Information</a>
            </div>
            <div className="space-y-4">
              <a href="#" className="block text-gray-400 hover:text-white">Media Center</a>
              <a href="#" className="block text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="block text-gray-400 hover:text-white">Contact Us</a>
            </div>
          </div>

          {/* Service Code Button */}
          <button className="mt-8 px-4 py-2 text-gray-400 border border-gray-400 hover:text-white hover:border-white">
            Service Code
          </button>

          {/* Copyright */}
          <p className="mt-8 text-gray-400 text-sm">
            © 1997-{new Date().getFullYear()} Bookflix, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;