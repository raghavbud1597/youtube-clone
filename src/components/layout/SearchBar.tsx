import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { TiMicrophone } from "react-icons/ti";
import { useSearch } from "../../hooks/useSearch";
import { useVoiceSearch } from "../../hooks/useVoiceSearch";
import IconButton from "../common/IconButton";

export default function SearchBar() {
  const search = useSearch();
  const voice = useVoiceSearch(search.setValue);
  return (
    <div className="search-group">
      <form className="search-form" role="search" onSubmit={search.submit}>
        <div className="search-input-wrap">
          <input
            ref={search.inputRef}
            type="search"
            aria-label="Search videos"
            placeholder="Search"
            value={search.value}
            onChange={(event) => search.setValue(event.target.value)}
            autoComplete="off"
          />
          {search.value && (
            <IconButton label="Clear search" onClick={search.clear}>
              <AiOutlineClose />
            </IconButton>
          )}
        </div>
        <button className="search-submit" type="submit" aria-label="Search">
          <AiOutlineSearch aria-hidden="true" />
        </button>
      </form>
      <IconButton
        className="voice-button"
        label={
          voice.supported
            ? "Search with your voice"
            : "Voice search is unavailable in this browser"
        }
        disabled={!voice.supported || voice.listening}
        aria-pressed={voice.listening}
        onClick={voice.start}
      >
        <TiMicrophone />
      </IconButton>
      {voice.error && (
        <span className="voice-status" role="status">
          {voice.error}
        </span>
      )}
    </div>
  );
}
