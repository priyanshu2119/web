import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { toast, Toaster } from 'react-hot-toast';
import { Triangle } from 'lucide-react';

// Wheel configuration - You can modify probabilities by adjusting the number of segments
const wheelData = [
  { option: 'A', style: { backgroundColor: '#FF4B4B', textColor: 'white' } },
  { option: 'B', style: { backgroundColor: '#4BB4FF', textColor: 'white' } },
  { option: 'C', style: { backgroundColor: '#4BFF4B', textColor: 'white' } },
  { option: 'D', style: { backgroundColor: '#FFB74B', textColor: 'white' } },
  // Uncomment below for more options
  /*
  { option: 'E', style: { backgroundColor: '#B74BFF', textColor: 'white' } },
  { option: 'F', style: { backgroundColor: '#FF4B87', textColor: 'white' } },
  { option: 'G', style: { backgroundColor: '#4BFFB7', textColor: 'white' } },
  */
];

// Store used mobile numbers in localStorage to prevent duplicate entries
const usedMobileNumbers = new Set(JSON.parse(localStorage.getItem('usedMobileNumbers') || '[]'));

function App() {
  // Form state
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  // Wheel state
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !mobile) {
      toast.error('Please fill in all fields');
      return;
    }

    if (usedMobileNumbers.has(mobile)) {
      toast.error('This mobile number has already been used');
      return;
    }

    // Store mobile number in localStorage
    usedMobileNumbers.add(mobile);
    localStorage.setItem('usedMobileNumbers', JSON.stringify([...usedMobileNumbers]));
    
    setShowForm(false);
    toast.success('Welcome to Techno Be With You!');
  };

  // Wheel spin handler - You can modify probability weights here
  const handleSpinClick = () => {
    if (!hasSpun) {
      // Probability weights for each option (must match wheelData length)
      const weights = [0.3, 0.3, 0.2, 0.2]; // 30% for A & B, 20% for C & D
      
      // Generate random number based on weights
      const random = Math.random();
      let sum = 0;
      let selectedIndex = 0;
      
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random <= sum) {
          selectedIndex = i;
          break;
        }
      }

      setPrizeNumber(selectedIndex);
      setMustSpin(true);
      setHasSpun(true);
    } else {
      toast.error('You have already used your spin!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />
      
      {/* Navigation Bar */}
      <nav className="bg-black p-4 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Triangle className="h-8 w-8" />
            <span className="text-xl font-bold">Welcome to Techno Be With You</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Registration Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-black p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Welcome to Techno Be With You</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Enter
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Spin Wheel Section */}
        <div className="flex flex-col items-center justify-center space-y-8 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Spin & Win</h1>
          <div className="relative max-w-md w-full">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={wheelData}
              onStopSpinning={() => {
                setMustSpin(false);
                toast.success(`Congratulations! You got option ${wheelData[prizeNumber].option}!`);
              }}
              outerBorderColor="#ffffff"
              radiusLineColor="#ffffff"
              radiusLineWidth={1}
              fontSize={24}
              spinDuration={0.8}
            />
            <button
              onClick={handleSpinClick}
              disabled={hasSpun}
              className={`mt-8 px-12 py-4 rounded-full text-lg font-semibold w-full max-w-xs mx-auto block ${
                hasSpun
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-200 transform hover:scale-105'
              } transition duration-300 ease-in-out`}
            >
              {hasSpun ? 'Already Spun' : 'SPIN'}
            </button>
          </div>
        </div>

        {/* Project Catalogue Section - Uncomment to use */}
        {/*
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 rounded-lg p-6 transform hover:scale-105 transition duration-300">
            <h3 className="text-xl font-bold mb-4">Project 1</h3>
            <p className="text-gray-300">Description of your amazing project goes here.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-6 transform hover:scale-105 transition duration-300">
            <h3 className="text-xl font-bold mb-4">Project 2</h3>
            <p className="text-gray-300">Description of your amazing project goes here.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-6 transform hover:scale-105 transition duration-300">
            <h3 className="text-xl font-bold mb-4">Project 3</h3>
            <p className="text-gray-300">Description of your amazing project goes here.</p>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}

export default App;