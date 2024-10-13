import ReceivedMessage from "./ReceivedMessage";

interface Props {
  messages: any;
}

const SentMessages = ({ messages }: Props) => {
  return (
    <div className="px-3 md:px-0 flex flex-col overflow-y-scroll scrollbar-hide w-full h-full pb-16 items-end gap-1">
      <div className="mt-20" />
      {messages.map((e: any) => {
        return <ReceivedMessage message={e} sent />;
      })}
    </div>
  );
};

export default SentMessages;
