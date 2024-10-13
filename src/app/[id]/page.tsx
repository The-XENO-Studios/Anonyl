"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import MessageBox from "../Components/Chats/MessageBox";
import SentHistory from "../Components/Chats/SentHistory";
import SentMessages from "../Components/Chats/SentMessages";
import { db, auth } from "../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdHistory } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SendMessage = ({ params }: { params: { id: string } }) => {
  const [user, loading, error] = useAuthState(auth);
  const [message, setMessage] = useState("");

  const [chatID, setID] = useState(params.id);

  const ref = collection(
    db,
    "chatrooms",
    `${chatID}`,
    "rooms",
    `${auth.currentUser?.uid}`,
    "messages"
  );

  const unknowRef = collection(
    db,
    "chatrooms",
    `${chatID}`,
    "rooms",
    "unknown",
    "messages"
  );

  const [history, setHistory] = useState<any>([]);

  const [lastDoc, setLastDoc] = useState<any>(null);

  const setHistoryFunc = (doc: any[]) => {
    setHistory((oldDocs: any) => [...doc]);
  };

  const q = query(
    collection(db, "users", `${auth.currentUser?.uid}`, "history"),
    orderBy("time", "desc"),
    limit(5)
  );

  const [docExists, setDocExists] = useState(false);

  const router = useRouter();

  const checkRoom = () => {
    getDoc(doc(db, "chatrooms", `${chatID}`)).then((docSnap) => {
      console.log(chatID);
      if (!docSnap.exists) {
        console.log("YO");
        setDocExists(false);
        toast.error("Room ID is Invalid");
        router.push("/");
      } else {
        setDocExists(true);
      }
    });
  };

  useEffect(() => {
    checkRoom();
  }, [chatID]);

  const sendFunction = async () => {
    if (docExists) {
      if (message.trim() != "") {
        if (user != null) {
          setDoc(
            doc(
              db,
              "chatrooms",
              `${chatID}`,
              "rooms",
              `${auth.currentUser?.uid}`
            ),
            { time: serverTimestamp() }
          ).then(() => {
            addDoc(ref, { message: message, time: serverTimestamp() }).then(
              () => {
                setDoc(
                  doc(
                    db,
                    "users",
                    `${auth.currentUser?.uid}`,
                    "history",
                    `${chatID}`
                  ),
                  { time: serverTimestamp() }
                )
                  .then(async () => {
                    if (history.length == 0 || history[0] != chatID) {
                      setHistory([]);

                      const documentSnapshots = await getDocs(q);

                      const arr: any[] = [];

                      documentSnapshots.forEach((doc) => {
                        arr.push(doc.id);
                      });

                      setHistoryFunc(arr);

                      setLastDoc(
                        documentSnapshots.docs[
                          documentSnapshots.docs.length - 1
                        ]
                      );
                    }
                  })
                  .then(async () => {
                    const que = query(
                      collection(
                        db,
                        "chatrooms",
                        `${chatID}`,
                        "rooms",
                        `${auth.currentUser?.uid}`,
                        "messages"
                      ),
                      orderBy("time"),
                      limitToLast(1)
                    );

                    getDocs(que).then((snapshot) => {
                      snapshot.docs.forEach((doc) => {
                        setMessages((oldDocs: any) => {
                          return [...oldDocs, doc.data().message];
                        });
                      });
                    });
                  });
              }
            );
          });
        } else {
          setDoc(doc(db, "chatrooms", `${chatID}`, "rooms", "unknown"), {
            time: serverTimestamp(),
          }).then(() => {
            addDoc(unknowRef, { message: message, time: serverTimestamp() });
          });
        }

        setMessage("");
      } else {
        alert("Enter a message");
      }
    } else {
      alert("No such link");
    }
  };

  const [messages, setMessages] = useState<any>([]);

  const [historyHidden, setHistoryHidden] = useState(false);

  return (
    <main className="md:px-10 h-screen overflow-x-hidden">
      <div className="flex relative h-full md:h-[90%] rounded-lg">
        {!user && !loading && (
          <div
            className="fixed top-20 left-0 md:left-[36vw] flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 mr-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Info alert!</span> You need to Sign
              In to access your history.
            </div>
          </div>
        )}
        {user && !loading && (
          <>
            <SentHistory
              history={history}
              setHistory={setHistoryFunc}
              lastDoc={lastDoc}
              setLastDoc={setLastDoc}
              setID={setID}
              setMessages={setMessages}
              hidden={historyHidden}
              chatID={chatID}
              setChatID={setID}
            />
            <button
              className="transition w-7 text-blue-500 h-7 hover:scale-105 absolute z-50 left-3 top-20"
              onClick={() => {
                setHistoryHidden(!historyHidden);
              }}
            >
              <MdHistory className="w-full h-full" />
            </button>
          </>
        )}
        <div className="h-full md:px-3 relative w-full md:flex-[3] flex-col rounded-lg">
          <SentMessages messages={messages} />
          <MessageBox
            messageValue={message}
            setMessageValue={setMessage}
            sendFunction={sendFunction}
          />
        </div>
      </div>
    </main>
  );
};

export default SendMessage;
