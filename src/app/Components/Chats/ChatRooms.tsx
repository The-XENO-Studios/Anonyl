import { db, auth } from "@/app/Config/firebase";
import { Time } from "@/app/Utils/Time";
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";

import { useEffect, useRef, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { CiCirclePlus } from "react-icons/ci";
import { IoMdCopy } from "react-icons/io";
import { MdMeetingRoom } from "react-icons/md";

interface Props {
  setRoomsData: (data: any) => void;
  setRoomID: (data: any) => void;
  setScrollToLeft: (go: boolean) => void;
  goLeft: boolean;
  setShow: (val: boolean) => void;
}

const ChatRooms = ({
  setRoomsData,
  setRoomID,
  setScrollToLeft,
  goLeft,
  setShow,
}: Props) => {
  const [chatRooms, setChatRooms] = useState<any>([]);

  const [lastDoc, setLastDoc] = useState<any>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setChatRooms([]);

    getChatRooms(firstQuery);

    return () => {
      setChatRooms([]);
    }; // Cleanup the listener when the component unmounts
  }, []);

  const firstQuery = query(
    collection(db, "chatrooms"),
    where("creator", "==", auth.currentUser?.uid),
    orderBy("time", "desc"),
    limit(5)
  );

  const q = query(
    collection(db, "chatrooms"),
    where("creator", "==", auth.currentUser?.uid),
    orderBy("time", "desc"),
    limit(5),
    startAfter(lastDoc)
  );

  const getChatRooms = async (query: Query) => {
    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((doc: any) => {
      setChatRooms((oldData: any) => {
        return [...oldData, doc];
      });
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    });
  };

  const [newCreatedRoom, setNewCreatedRoom] = useState("");

  const createNewChatRoom = () => {
    addDoc(collection(db, "chatrooms"), {
      creator: auth.currentUser?.uid,
      time: serverTimestamp(),
      oneway: true,
    }).then((addedDoc) => {
      setDoc(doc(db, "chatrooms", addedDoc.id, "rooms", "HI"), {
        time: serverTimestamp(),
      }).then(() => {
        setChatRooms([]);
        getChatRooms(firstQuery);
      });
      setNewCreatedRoom(addedDoc.id);
      onOpen();
    });
  };

  return (
    <div
      className={`transition-all duration-75 ${
        goLeft ? "translate-x-[-100%]" : "translate-x-0"
      } w-screen md:w-fit md:flex-[3] h-screen md:p-10`}
    >
      <div className="flex flex-col md:h-[90%] items-center overflow-y-scroll h-full scrollbar-hide p-5 md:rounded-lg md:shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
        <Button
          onPress={createNewChatRoom}
          color="primary"
          variant="ghost"
          className="w-full p-6 mb-2 font-medium"
        >
          Create New Room
          <CiCirclePlus className="w-7 h-7" />
        </Button>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Chat Link
                </ModalHeader>
                <ModalBody>
                  <p>Your Anonymous Chat Inbox Link: </p>
                  <p>{`anonyl.vercel.app/${newCreatedRoom}`}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      navigator.clipboard.writeText(
                        `anonyl.vercel.app/${newCreatedRoom}`
                      );
                      toast.success("Link Copied");
                    }}
                  >
                    Copy Link
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {chatRooms.map((e: any) => {
          return (
            <ChatRoom
              id={e.id}
              data={e.data()}
              setRoomsData={setRoomsData}
              setRoomID={setRoomID}
              setScrollToLeft={setScrollToLeft}
              setShow={setShow}
            />
          );
        })}
        {chatRooms.length >= 5 && (
          <Button
            onPress={() => {
              getChatRooms(q);
            }}
            color="primary"
            variant="faded"
            className="w-full p-6 mb-2 font-medium"
          >
            Load More Rooms
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatRooms;

interface RoomProps {
  id: string;
  data: any;
  setRoomsData: (data: any) => void;
  setRoomID: (data: any) => void;
  setScrollToLeft: (go: boolean) => void;
  setShow: (val: boolean) => void;
}

const ChatRoom = ({
  id,
  data,
  setRoomsData,
  setRoomID,
  setScrollToLeft,
  setShow,
}: RoomProps) => {
  const { hour, minute, date, month, year } = Time(data.time);
  return (
    <div
      key={id}
      onClick={async () => {
        setShow(false);
        let roomDataTemp: QueryDocumentSnapshot<DocumentData, DocumentData>[] =
          [];
        setRoomID(id);
        const roomsDocs = await getDocs(
          query(
            collection(db, "chatrooms", id, "rooms"),
            limit(10),
            orderBy("time", "desc")
          )
        );
        roomsDocs.forEach((e) => roomDataTemp.push(e));
        setRoomsData(roomDataTemp);
        if (window.innerWidth < 768) {
          setScrollToLeft(true);
        }
      }}
      className="w-full cursor-pointer flex-1 relative px-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    >
      <div className="flex items-center mt-2 gap-1">
        <MdMeetingRoom className="w-7 h-7 text-blue-500" />
        <p className=" font-bold">{id}</p>
      </div>
      <div className="py-4">
        <div
          className="absolute right-1 top-1 z-50"
          onClick={() => {
            navigator.clipboard
              .writeText(`anonyl.vercel.app/${id}`)
              .then(() => {
                toast.success("Room ID Copied");
              });
          }}
        >
          <IoMdCopy className="w-7 h-7 text-blue-500" />
        </div>
        <div className="absolute text-sm right-1 bottom-1">
          {`${hour}:${minute}`}
        </div>
        <div className="absolute text-xs left-1 bottom-1">
          {`${month}/${date}/${year}`}
        </div>
      </div>
    </div>
  );
};
