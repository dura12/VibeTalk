import { Link, useLocation } from "react-router"; // Corrected import
import useAuthUser from "../hooks/useAuthUser"; // Assuming this hook provides authUser and a logout function
import { BellIcon, HomeIcon, LogOutIcon, SettingsIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

// Dummy logout function - replace with your actual logout logic
const handleLogout = () => {
  console.log("Logout action triggered");
  // Example: auth.signOut(); navigate('/login');
};

const Sidebar = () => {
  const { authUser } = useAuthUser(); // Assuming authUser has { profilePic, fullName }
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/friends", label: "Friends", icon: UsersIcon },
    { to: "/notifications", label: "Notifications", icon: BellIcon },
    // Example: Add more items here if needed
    // { to: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <aside className="w-72 bg-slate-800 border-r border-slate-700 hidden lg:flex flex-col h-screen sticky top-0">
      {/* LOGO SECTION */}
      <div className="p-6 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-3 group">
          <ShipWheelIcon className="size-10 text-sky-400 group-hover:animate-spin-slow" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 tracking-wider">
            VibeTalk
          </span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.to || (item.to !== "/" && currentPath.startsWith(item.to));
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
                group hover:bg-slate-700/70
                ${
                  isActive
                    ? "bg-sky-500/10 text-sky-300 border-l-4 border-sky-500 pl-3 font-medium" // Adjusted pl for border
                    : "text-slate-400 hover:text-slate-100"
                }
              `}
            >
              <item.icon 
                className={`
                  size-5 flex-shrink-0 
                  ${isActive ? "text-sky-400" : "text-slate-500 group-hover:text-sky-400"}
                `} 
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE & ACTIONS SECTION */}
      <div className="mt-auto border-t border-slate-700 p-4 space-y-3">
         {/* User Info */}
        {authUser && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
             <div className="avatar relative">
              <div className="w-10 rounded-full ring-2 ring-slate-600 group-hover:ring-sky-500 transition-all">
                <img 
                    src={authUser.profilePic || `https://ui-avatars.com/api/?name=${authUser.fullName.replace(" ", "+")}&background=0D8ABC&color=fff&bold=true`} 
                    alt={authUser.fullName || "User Avatar"} 
                />
              </div>
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-slate-800" title="Online"></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm text-slate-100 truncate">{authUser.fullName || "Guest User"}</p>
              <p className="text-xs text-green-400">Online</p>
            </div>
            {/* Optionally, an icon for profile settings or dropdown */}
            {/* <SettingsIcon className="size-5 text-slate-500 hover:text-sky-400" /> */}
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout} // Replace with your actual logout function call
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors group"
        >
          <LogOutIcon className="size-5 text-slate-500 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;