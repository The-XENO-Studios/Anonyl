import { useEffect, useState } from "react";

import {
  DocumentData,
  Query,
  collection,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db, auth } from "@/app/Config/firebase";
import { Input } from "@nextui-org/react";
import { FaCaretRight } from "react-icons/fa";

interface Props {
  history: any;
  setHistory: (data: any) => void;
  lastDoc: any;
  setLastDoc: (data: any) => void;
  setID: (data: any) => void;
  setMessages: (data: any) => void;
  hidden: boolean;
  chatID: any;
  setChatID: (data: any) => void;
}

const SentHistory = ({
  history,
  setHistory,
  lastDoc,
  setLastDoc,
  setID,
  setMessages,
  hidden,
  chatID,
  setChatID,
}: Props) => {
  const [sentMessage, setSentMessage] = useState<any>([]);

  const setSentMessagesFunc = (doc: any) => {
    setSentMessage((oldDocs: any) => {
      return [...oldDocs, doc.data().message];
    });
  };

  const clearSentMessages = () => {
    setSentMessage([]);
  };

  const q = query(
    collection(db, "users", `${auth.currentUser?.uid}`, "history"),
    orderBy("time", "desc"),
    limit(5)
  );

  let nextQ: Query<DocumentData, DocumentData>;

  if (lastDoc) {
    nextQ = query(
      collection(db, "users", `${auth.currentUser?.uid}`, "history"),
      orderBy("time", "desc"),
      startAfter(lastDoc),
      limit(5)
    );
  }

  const getHistoryDocs = async (query: Query) => {
    getDocs(query).then((snapshot) => {
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      const arr: any[] = [];

      snapshot.docs.forEach((doc) => {
        arr.push(doc.id);
      });

      setHistory(arr);
    });
  };

  useEffect(() => {
    getHistoryDocs(q);
    setChattngID(chatID);
  }, []);

  useEffect(() => {
    setMessages(sentMessage);
  }, [sentMessage]);

  const [chattingID, setChattngID] = useState("");

  return (
    <div
      className={`${
        hidden ? "hidden" : ""
      } h-full rounded-lg p-3 md:shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]`}
    >
      <div className="scrollbar-hide bg-white md:bg-inherit fixed w-full md:w-fit md:relative z-50 md:z-auto flex items-center flex-col gap-3 dark:bg-slate-700 md:flex-1 overflow-y-hidden">
        <div className="mt-28">
          <form>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Sending To:
            </label>
            <div className="relative">
              <Input
                className="bg-white"
                color="primary"
                value={chattingID}
                id="chat"
                onChange={(e) => setChattngID(e.target.value)}
                fullWidth
                label="Chat ID"
                variant="bordered"
                placeholder="Enter Chat ID"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      if (chattingID.trim() == "") {
                        alert("ID can't be empty");
                      } else {
                        setChatID(chattingID);
                      }
                    }}
                    aria-label="Send"
                  >
                    <FaCaretRight className="w-7 h-7 text-blue-500" />
                  </button>
                }
                type="text"
              />
            </div>
          </form>
        </div>
        {history.map((e: any) => {
          return (
            <SingleHistory
              id={e}
              setSentMessage={setSentMessagesFunc}
              setID={setID}
              clearMessages={clearSentMessages}
            />
          );
        })}
        {/*history.length >= 5 && (
          <button onClick={() => getHistoryDocs(nextQ)}>Load More</button>
        )*/}
      </div>
    </div>
  );
};

export default SentHistory;

interface SingleProps {
  id: string;
  setSentMessage: (data: any) => void;
  setID: (data: any) => void;
  clearMessages: () => void;
}

const SingleHistory = ({
  id,
  setSentMessage,
  setID,
  clearMessages,
}: SingleProps) => {
  const q = query(
    collection(
      db,
      "chatrooms",
      id,
      "rooms",
      `${auth.currentUser?.uid}`,
      "messages"
    ),
    orderBy("time"),
    limitToLast(10)
  );
  const getMessages = () => {
    clearMessages();
    getDocs(q).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        setSentMessage(doc);
      });
    });
  };
  return (
    <div
      onClick={() => {
        getMessages();
        setID(id);
      }}
      className="flex cursor-pointer shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg w-[90%] justify-center items-center"
    >
      <div className="p-5 font-medium">{id}</div>
    </div>
  );
};
