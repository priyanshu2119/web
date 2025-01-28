import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { toast, Toaster } from "react-hot-toast";
import { Triangle } from "lucide-react";

// Wheel configuration with prizes
const wheelData = [
  {
    option: "Free\nHoodie", probablity: 0.1,
    style: { backgroundColor: "black", textColor: "white" },
  },
  {
    option: "Free\nT-shirt", probablity: 0.1,
    style: { backgroundColor: "white", textColor: "black" },
  },
  {
    option: "20% Off\nat Stall", probablity: 0.1,
    style: { backgroundColor: "black", textColor: "white" },
  },
  {
    option: "Better\nLuck\nNext\nTime", probablity: 0.9,
    style: { backgroundColor: "white", textColor: "black" },
  },
];

// Store used mobile numbers in localStorage to prevent duplicate entries
const usedMobileNumbers = new Set(
  JSON.parse(localStorage.getItem("usedMobileNumbers") || "[]")
);

function App() {
  // Form state
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  // Wheel state
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !mobile) {
      toast.error("Please fill in all fields");
      return;
    }

    if (usedMobileNumbers.has(mobile)) {
      toast.error("This mobile number has already been used");
      return;
    }

    // Store mobile number in localStorage
    usedMobileNumbers.add(mobile);
    localStorage.setItem(
      "usedMobileNumbers",
      JSON.stringify([...usedMobileNumbers])
    );

    setShowForm(false);
    toast.success("Welcome to Techno Be With You!");
  };

  // Wheel spin handler with probability weights
  const handleSpinClick = () => {
    if (!hasSpun) {
      // Probability weights for each option (must match wheelData length)
      const weights = [0.1, 0.1, 0.1, 0.9]; // 10% for Hoodie & T-shirt, 90% for you are this close to win

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
      toast.error("You have already used your spin!");
    }
  };

  const getPrizeMessage = (index: number) => {
    const prizes = [
      "Congratulations! You won a Free Hoodie! 🎉",
      "Awesome! You won a Free T-shirt! 👕",
      "Great! You got 20% Off at our stall! 🎫",
      "You were this 🤌 close to win!",
    ];
    return prizes[index];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />

      {/* Navigation Bar */}
      <nav className="bg-black p-4 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <Triangle className="h-8 w-8" />
            <span className="text-xl font-bold">
              Welcome to Techno Be With You
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Registration Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-black p-8 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                Welcome to Techno Be With You
              </h2>
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
                  <label className="block text-sm font-medium mb-1">
                    Mobile Number
                  </label>
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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Spin & Win
          </h1>
          <div className="relative w-full max-w-[320px] md:max-w-[400px] mx-auto">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={wheelData}
              onStopSpinning={() => {
                setMustSpin(false);
                toast.success(getPrizeMessage(prizeNumber));
              }}
              outerBorderColor="#ffffff"
              radiusLineColor="#ffffff"
              radiusLineWidth={1}
              fontSize={16}
              textDistance={60}
              spinDuration={0.8}
            />
            <button
              onClick={handleSpinClick}
              disabled={hasSpun}
              className={`mt-8 px-12 py-4 rounded-full text-lg font-semibold w-full max-w-xs mx-auto block ${
                hasSpun
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200 transform hover:scale-105"
              } transition duration-300 ease-in-out`}
            >
              {hasSpun ? "Already Spun" : "SPIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
