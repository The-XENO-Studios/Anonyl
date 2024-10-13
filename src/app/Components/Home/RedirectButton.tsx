"use client";

import { auth } from "@/app/Config/firebase";
import { signInAnonymously } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const RedirectButton = () => {
  const [user, loading, error] = useAuthState(auth);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();

  return (
    <div>
      {mounted && (
        <div className="flex sm:flex-row flex-col gap-5 w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (user && !loading) {
                router.push("/chats");
              } else if (!user && !loading) {
                signInAnonymously(auth).then(() => {
                  router.push("/chats");
                });
              } else {
              }
            }}
            className="flex text-white justify-center items-center w-max min-w-max sm:w-max px-6 h-12 rounded-full outline-none relative overflow-hidden border duration-300 ease-linear
                                after:absolute after:inset-x-0 after:aspect-square after:scale-0 after:opacity-70 after:origin-center after:duration-300 after:ease-linear after:rounded-full after:top-0 after:left-0 after:bg-[#172554] hover:after:opacity-100 hover:after:scale-[2.5] bg-blue-600 border-transparent hover:border-[#172554]"
          >
            <span className="sm:flex relative z-[5]">
              {user ? "Go to Chatboard" : "Start Anonymously"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RedirectButton;
