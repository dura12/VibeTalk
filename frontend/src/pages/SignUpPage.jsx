import { useState, useEffect } from "react";
import { ShipWheelIcon, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router"; // Corrected import
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // For entry animation

  const { isPending, error, signupMutation } = useSignUp();

  useEffect(() => {
    // Trigger entry animation
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900 to-purple-900">
      <div
        className={`
          flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-slate-800 
          rounded-xl shadow-2xl overflow-hidden
          transition-all duration-700 ease-out
          ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
        `}
      >
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col text-slate-100">
          {/* LOGO */}
          <div className="mb-6 flex items-center justify-start gap-3">
            <ShipWheelIcon className="size-10 text-sky-400" />
            <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 tracking-wider">
              VibeTalk
            </span>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-md relative mb-6" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error.response?.data?.message || "An unknown error occurred."}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-50">Create Your Account</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Join VibeTalk and embark on a new language adventure!
                </p>
              </div>

              <div className="space-y-4">
                {/* FULLNAME */}
                <div>
                  <label className="label block text-sm font-medium text-slate-300 mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="input w-full bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
                {/* EMAIL */}
                <div>
                  <label className="label block text-sm font-medium text-slate-300 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="input w-full bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                {/* PASSWORD */}
                <div>
                  <label className="label block text-sm font-medium text-slate-300 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="input w-full bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm pr-10"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-sky-400 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Must be at least 6 characters long.
                  </p>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2 items-center">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary bg-slate-700 border-slate-600 checked:bg-sky-500 checked:border-sky-500" required />
                    <span className="text-xs text-slate-300 leading-tight">
                      I agree to the{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline">
                        terms of service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline">
                        privacy policy
                      </a>
                    </span>
                  </label>
                </div>
              </div>

              <button
                className="btn w-full bg-sky-500 hover:bg-sky-600 border-none text-white font-semibold py-3 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300 hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE & INFO - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-purple-800 to-sky-700 items-center justify-center p-8 relative">
          {/* Overlay for subtle texture/effect (optional) */}
          {/* <div className="absolute inset-0 bg-black/10"></div> */}
          <div className="text-center text-slate-100 z-10 max-w-md">
            <div className="relative aspect-square max-w-sm mx-auto mb-8 transform transition-all duration-500 ease-out hover:scale-105">
              <img 
                src="/i.png" // Replace with a more fitting, higher-quality image
                alt="Language connection illustration" 
                className="w-full h-full object-contain rounded-lg shadow-xl" 
              />
            </div>
            <h2 className="text-3xl font-bold mb-3">Connect & Converse</h2>
            <p className="text-lg text-slate-300 opacity-90">
              Unlock a world of languages. Practice, learn, and make friends across the globe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;