import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router"; // Corrected import
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, AlertTriangle } from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard"; // Assuming this will be styled similarly
import NoFriendsFound from "../components/NoFriendsFound"; // Assuming this will be styled similarly

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending: isSendingRequest } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data, variables) => {
      // Optimistically update the UI or simply refetch
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      // Optionally, add the user ID to outgoingRequestsIds immediately for faster UI update
      // setOutgoingRequestsIds(prev => new Set(prev).add(variables));
    },
    onError: (error) => {
      console.error("Failed to send friend request:", error);
      // Potentially show a toast notification for the error
    }
  });

  useEffect(() => {
    if (outgoingFriendReqs) {
      const outgoingIds = new Set(outgoingFriendReqs.map((req) => req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);


  const renderLoadingSpinner = () => (
    <div className="flex justify-center items-center py-16">
      <div className="w-12 h-12 border-4 border-sky-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
      <span className="ml-4 text-slate-300 text-lg">Loading...</span>
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-12">
        {/* YOUR FRIENDS SECTION */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">Your Friends</h2>
            <Link
              to="/notifications"
              className="inline-flex items-center justify-center px-4 py-2 border border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-slate-900 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <UsersIcon className="mr-2 size-5" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            renderLoadingSpinner()
          ) : friends.length === 0 ? (
            <NoFriendsFound /> // Ensure this component is styled for dark theme
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} /> // Ensure this component is styled for dark theme
              ))}
            </div>
          )}
        </section>

        {/* MEET NEW LEARNERS SECTION */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">Meet New Learners</h2>
            <p className="text-slate-400 mt-1">
              Discover language exchange partners tailored to you.
            </p>
          </div>

          {loadingUsers ? (
            renderLoadingSpinner()
          ) : recommendedUsers.length === 0 ? (
            <div className="bg-slate-800 p-8 rounded-lg text-center shadow-lg">
              <AlertTriangle className="size-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold text-xl text-slate-100 mb-2">No Recommendations Yet</h3>
              <p className="text-slate-400">
                We're looking for new language partners for you. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-sky-500/20 hover:scale-[1.02]"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="avatar flex-shrink-0">
                           <div className="w-16 h-16 rounded-full ring-2 ring-slate-700 hover:ring-sky-500 transition-all">
                            <img src={user.profilePic || `https://ui-avatars.com/api/?name=${user.fullName.replace(" ", "+")}&background=0D8ABC&color=fff&bold=true`} alt={user.fullName} className="rounded-full"/>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-xl text-slate-50 leading-tight">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-slate-400 mt-1">
                              <MapPinIcon className="size-3.5 mr-1.5 flex-shrink-0" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 text-xs font-medium px-3 py-1 rounded-full">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 border border-cyan-500/30 text-cyan-400 text-xs font-medium px-3 py-1 rounded-full">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{user.bio}</p>}

                      <button
                        className={`w-full mt-3 inline-flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800
                          ${
                            hasRequestBeenSent || isSendingRequest
                              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                              : "bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500"
                          } `}
                        onClick={() => !hasRequestBeenSent && !isSendingRequest && sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isSendingRequest}
                      >
                        {isSendingRequest && outgoingRequestsIds.has(user._id) === false ? ( // Show spinner only for the button being clicked
                           <>
                             <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin border-t-transparent mr-2"></div>
                             Sending...
                           </>
                        ) : hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-5 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-5 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;