"use client";

import { useEffect, useState } from "react";
import ChatRooms from "../Components/Chats/ChatRooms";
import ReceivedMessages from "../Components/Chats/ReceivedMessages";
import ReceivedRoom from "../Components/Chats/ReceivedRoom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Config/firebase";
import { div } from "framer-motion/client";
import { useRouter } from "next/navigation";

const ChatBoard = () => {
  const [user, loading, error] = useAuthState(auth);

  const [sendingOrReceiving, setSendingOrReceiving] = useState(true);

  const [roomsData, setRoomsData] = useState();

  const [messageData, setMessageData] = useState();

  const [currentRoomID, setCurrentRoomID] = useState("");

  const [scrollToLeft, setScrollToLeft] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading]);

  if (loading) {
    return <div />;
  }

  return (
    <main className="min-h-screen">
      {user != null && (
        <div className="dark:bg-slate-800 md:flex h-screen overflow-y-hidden overflow-x-hidden relative md:px-10">
          <ChatRooms
            setRoomsData={setRoomsData}
            setRoomID={setCurrentRoomID}
            setScrollToLeft={setScrollToLeft}
            goLeft={scrollToLeft}
            setShow={setShowMessage}
          />

          <ReceivedRoom
            currentRoomID={currentRoomID}
            roomsData={roomsData}
            setMessageData={setMessageData}
            setScrollToLeft={setScrollToLeft}
            goLeft={scrollToLeft}
            setShow={setShowMessage}
          />

          <ReceivedMessages
            messageData={messageData}
            goLeft={scrollToLeft}
            show={showMessage}
          />
        </div>
      )}
    </main>
  );
};

export default ChatBoard;
