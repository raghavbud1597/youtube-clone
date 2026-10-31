import { useState } from "react";

interface Props {
  src?: string;
  name: string;
  className?: string;
}

export default function Avatar({ src, name, className = "" }: Props) {
  const [failedSource, setFailedSource] = useState<string>();
  if (src && failedSource !== src) {
    return (
      <img
        className={`avatar ${className}`}
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailedSource(src)}
      />
    );
  }
  return (
    <span
      className={`avatar avatar-fallback ${className}`}
      role="img"
      aria-label={name}
    >
      {name.slice(0, 1).toUpperCase() || "Y"}
    </span>
  );
}
