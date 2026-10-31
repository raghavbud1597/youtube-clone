import { MdOutlineVideoLibrary, MdOutlineErrorOutline } from "react-icons/md";

interface Props {
  title: string;
  message?: string;
  onRetry?: () => void;
  error?: boolean;
}

export default function FeedbackState({
  title,
  message,
  onRetry,
  error = false,
}: Props) {
  const Icon = error ? MdOutlineErrorOutline : MdOutlineVideoLibrary;
  return (
    <div
      className={`feedback-state ${error ? "error-state" : ""}`}
      role={error ? "alert" : "status"}
    >
      <Icon aria-hidden="true" />
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && (
        <button type="button" className="secondary-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
