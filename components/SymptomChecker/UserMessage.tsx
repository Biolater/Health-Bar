const UserMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="ms-auto text-primary-foreground break-words text-sm px-3 py-2 rounded-lg max-w-[75%] bg-primary">
      <div>{message}</div>
    </div>
  );
};

export default UserMessage;
