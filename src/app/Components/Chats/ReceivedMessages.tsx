import { useEffect, useRef } from "react";
import ReceivedMessage from "./ReceivedMessage";

interface Props {
  messageData: any;
  goLeft: boolean;
  show: boolean;
}

const ReceivedMessages = ({ messageData, goLeft, show }: Props) => {
  const finalMessage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageData != null) {
      //finalMessage.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  return (
    <div
      className={`mt-4 transition-all duration-75 ${
        goLeft ? "translate-x-[-100vw]" : "translate-x-0"
      } absolute top-0 left-[120vw] w-[80%] md:static flex-1 md:flex-[5] h-screen md:h-[90%] py-10 pr-10 shadow-inner overflow-y-scroll overflow-x-hidden`}
    >
      <div className="w-full h-full flex flex-col gap-1 rounded-lg md:shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
        {show &&
          messageData?.map((e: any) => {
            return <ReceivedMessage message={e} />;
          })}
        <div ref={finalMessage}></div>
      </div>
    </div>
  );
};

export default ReceivedMessages;
