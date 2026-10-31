import { useEffect, useRef, useState } from "react";

interface Recognition {
  lang: string;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
}

type RecognitionConstructor = new () => Recognition;

export function useVoiceSearch(onResult: (value: string) => void) {
  const speechWindow = window as Window & {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  const Constructor =
    speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
  const recognition = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (recognition.current) {
        recognition.current.onresult = null;
        recognition.current.onerror = null;
        recognition.current.onend = null;
        recognition.current.abort();
      }
    },
    [],
  );

  function start() {
    if (!Constructor || listening) return;
    const instance = new Constructor();
    recognition.current = instance;
    instance.lang = navigator.language;
    instance.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    instance.onerror = () =>
      setError("Couldn't hear you. Check microphone access and try again.");
    instance.onend = () => setListening(false);
    try {
      setError("");
      instance.start();
      setListening(true);
    } catch {
      setError("Voice search is unavailable right now.");
    }
  }

  return { supported: Boolean(Constructor), listening, error, start };
}
