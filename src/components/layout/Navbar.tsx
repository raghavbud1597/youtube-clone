import { Link } from "react-router";
import { AiOutlineMenu } from "react-icons/ai";
import { BsYoutube, BsCameraVideo, BsBell } from "react-icons/bs";
import { IoAppsSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { paths } from "../../routes/paths";
import IconButton from "../common/IconButton";
import SearchBar from "./SearchBar";

export default function Navbar({
  onToggleSidebar,
  sidebarExpanded,
}: {
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
}) {
  return (
    <header className="navbar">
      <div className="brand-group">
        <IconButton
          label="Toggle navigation"
          aria-controls="sidebar"
          aria-expanded={sidebarExpanded}
          onClick={onToggleSidebar}
        >
          <AiOutlineMenu />
        </IconButton>
        <Link className="brand" to={paths.home} aria-label="YouTube home">
          <BsYoutube aria-hidden="true" />
          <span>YouTube</span>
        </Link>
      </div>
      <SearchBar />
      <div className="navbar-actions">
        <a
          className="icon-button desktop-action"
          href="https://www.youtube.com/upload"
          target="_blank"
          rel="noreferrer"
          aria-label="Create a video"
          title="Create a video"
        >
          <BsCameraVideo />
        </a>
        <details className="header-menu desktop-action">
          <summary aria-label="YouTube apps" title="YouTube apps">
            <IoAppsSharp />
          </summary>
          <div className="menu-panel">
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              YouTube Music
            </a>
          </div>
        </details>
        <details className="header-menu desktop-action">
          <summary aria-label="Notifications" title="Notifications">
            <BsBell />
          </summary>
          <div className="menu-panel">
            <strong>Notifications</strong>
            <p>You're all caught up.</p>
          </div>
        </details>
        <details className="header-menu">
          <summary aria-label="Your library" title="Your library">
            <MdAccountCircle className="profile-icon" />
          </summary>
          <div className="menu-panel">
            <Link to={paths.library()}>Your library</Link>
            <Link to={paths.library("history")}>Watch history</Link>
            <Link to={paths.library("subscriptions")}>Subscriptions</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
