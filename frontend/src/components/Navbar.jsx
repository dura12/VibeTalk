import { Link, useLocation } from "react-router"; // Corrected import
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector"; // Assuming this is styled for dark theme
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation, isPending: isLoggingOut } = useLogout();

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full h-full">
          {/* LEFT SIDE - LOGO (ONLY ON CHAT PAGE) */}
          <div className="flex items-center">
            {isChatPage && (
              <Link to="/" className="flex items-center gap-2.5 group">
                <ShipWheelIcon className="size-8 text-sky-400 group-hover:animate-spin-slow" />
                <span className="hidden sm:block text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 tracking-wider">
                  VibeTalk
                </span>
              </Link>
            )}
          </div>

          {/* RIGHT SIDE - ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Icon */}
            <Link
              to={"/notifications"}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-sky-400 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
            </Link>

            {/* Theme Selector */}
            <ThemeSelector /> {/* Ensure this component fits the dark theme */}

            {/* Avatar */}
            {authUser && (
              <div className="avatar ml-1">
                <div className="w-9 h-9 rounded-full ring-2 ring-slate-700 hover:ring-sky-500 transition-all">
                  <img
                    src={authUser.profilePic || `https://ui-avatars.com/api/?name=${authUser.fullName ? authUser.fullName.replace(" ", "+") : 'User'}&background=0D8ABC&color=fff&bold=true`}
                    alt={authUser.fullName || "User Avatar"}
                  />
                </div>
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={() => logoutMutation()}
              disabled={isLoggingOut}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors group"
              aria-label="Logout"
            >
              {isLoggingOut ? (
                <div className="w-6 h-6 border-2 border-slate-400 border-dashed rounded-full animate-spin border-t-transparent"></div>
              ) : (
                <LogOutIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;