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
import { db, auth } from "@/app/Config/firebase";
import { user, Navbar } from "@nextui-org/react";
import MessageBox from "../Chats/MessageBox";
import SentHistory from "../Chats/SentHistory";
import SentMessages from "../Chats/SentMessages";

const SendMessage = ({ id }: { id: string }) => {
  const [message, setMessage] = useState("");

  const [chatID, setID] = useState(id);

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

  const setHistoryFunc = (doc: any) => {
    setHistory((oldDocs: any) => {
      return [...oldDocs, doc.id];
    });
  };

  const q = query(
    collection(db, "users", `${auth.currentUser?.uid}`, "history"),
    orderBy("time", "desc"),
    limit(5)
  );

  const [docExists, setDocExists] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "chatrooms", `${chatID}`)).then((docSnap) => {
      if (!docSnap.exists) {
        setDocExists(false);
        console.log(false);
      } else {
        setDocExists(true);
        console.log(true);
      }
    });
  }, []);

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

                      documentSnapshots.forEach((doc) => {
                        setHistoryFunc(doc);
                      });

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
    <div className="w-screen h-screen dark:bg-slate-800">
      <Navbar />
      <div className="flex relative">
        {user == null && (
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
        {user != null && (
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
              className="scale-125 hover:scale-150 absolute z-50 left-3 top-20"
              onClick={() => {
                setHistoryHidden(!historyHidden);
              }}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
            </button>
          </>
        )}
        <div className="relative flex-[3] flex-col h-screen ">
          <SentMessages messages={messages} />
          <MessageBox
            messageValue={message}
            setMessageValue={setMessage}
            sendFunction={sendFunction}
          />
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
