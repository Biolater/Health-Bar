import { forwardRef } from "react";

const AiMessage = forwardRef<HTMLDivElement, { message: string }>(
  ({ message }, ref) => {
    return (
      <div
        ref={ref}
        className="me-auto text-sm px-3 py-2 rounded-lg break-words whitespace-pre-line max-w-[75%] bg-secondary"
      >
        <div>{message}</div>
      </div>
    );
  }
);

AiMessage.displayName = 'AiMessage'; 

export default AiMessage;
