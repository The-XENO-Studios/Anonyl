import { db } from "@/app/Config/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limitToLast,
  orderBy,
  query,
} from "firebase/firestore";
import { BsPatchQuestion } from "react-icons/bs";
import { IoCaretBack } from "react-icons/io5";

interface Props {
  roomsData: any;
  setMessageData: (data: any) => void;
  currentRoomID: any;
  setScrollToLeft: (go: boolean) => void;
  goLeft: boolean;
  setShow: (val: boolean) => void;
}

const ReceivedRoom = ({
  roomsData,
  setMessageData,
  currentRoomID,
  setScrollToLeft,
  goLeft,
  setShow,
}: Props) => {
  return (
    <div
      className={`transition-all duration-75 ${
        goLeft ? "translate-x-[-101vw]" : "translate-x-0"
      } absolute top-0 left-[101vw] w-[20%] md:static md:w-fit flex justify-center h-[90%] z-30 md:py-10`}
    >
      <div>
        {roomsData != null && (
          <div className="overflow-x-hidden flex flex-col items-start justify-start h-full overflow-y-scroll scrollbar-hide">
            <button
              className="md:hidden block"
              onClick={() => {
                setScrollToLeft(false);
              }}
            >
              <IoCaretBack className="w-7 h-7" />
            </button>
            {roomsData?.map((room: any, i: number) => {
              return (
                <Room
                  currentRoomID={currentRoomID}
                  room={room}
                  setMessageData={setMessageData}
                  index={roomsData.length - i - 1}
                  setShow={setShow}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedRoom;

interface ReceivedRoomProps {
  room: any;
  setMessageData: (data: any) => void;
  currentRoomID: any;
  index: number;
  setShow: (val: boolean) => void;
}

const Room = ({
  room,
  setMessageData,
  currentRoomID,
  index,
  setShow,
}: ReceivedRoomProps) => {
  return (
    <div
      key={room.id}
      onClick={async () => {
        try {
          let messagesArr: QueryDocumentSnapshot<DocumentData, DocumentData>[] =
            [];
          const snapShot = await getDocs(
            query(
              collection(
                db,
                "chatrooms",
                currentRoomID,
                "rooms",
                room.id,
                "messages"
              ),
              orderBy("time"),
              limitToLast(10)
            )
          );
          snapShot.forEach((e) => {
            messagesArr.push(e.data().message);
          });

          setMessageData(messagesArr);

          setShow(true);
        } catch (error) {
          console.error("Error:", error);
        }
      }}
      className={`relative cursor-pointer w-14 h-14 rounded-full bg-white mt-5 ${
        room.id == "HI" ? "hidden" : ""
      }`}
    >
      <BsPatchQuestion className="w-full h-full" />
      <div className="absolute bottom-[-10px] right-0 text-slate-500">
        {index}
      </div>
    </div>
  );
};
