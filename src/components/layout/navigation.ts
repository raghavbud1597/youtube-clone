import {
  MdHomeFilled,
  MdOutlineSlowMotionVideo,
  MdSubscriptions,
  MdOutlineVideoLibrary,
  MdHistory,
  MdOutlineSmartDisplay,
  MdOutlineWatchLater,
  MdThumbUpOffAlt,
  MdSettings,
  MdOutlinedFlag,
  MdOutlineHelpOutline,
  MdOutlineFeedback,
  MdOutlineSportsVolleyball,
} from "react-icons/md";
import { TbMusic, TbDeviceGamepad2 } from "react-icons/tb";
import { FaRegCompass } from "react-icons/fa";
import { GiFilmStrip } from "react-icons/gi";
import { paths } from "../../routes/paths";

export const navigationGroups = [
  [
    { icon: MdHomeFilled, label: "Home", href: paths.home },
    { icon: FaRegCompass, label: "Explore", href: paths.search("trending") },
    {
      icon: MdOutlineSlowMotionVideo,
      label: "Shorts",
      href: "https://www.youtube.com/shorts",
    },
    {
      icon: MdSubscriptions,
      label: "Subscriptions",
      href: paths.library("subscriptions"),
    },
  ],
  [
    { icon: MdOutlineVideoLibrary, label: "Library", href: paths.library() },
    { icon: MdHistory, label: "History", href: paths.library("history") },
    {
      icon: MdOutlineSmartDisplay,
      label: "Your Videos",
      href: "https://studio.youtube.com",
    },
    {
      icon: MdOutlineWatchLater,
      label: "Watch Later",
      href: paths.library("saved"),
    },
    {
      icon: MdThumbUpOffAlt,
      label: "Liked Videos",
      href: paths.library("liked"),
    },
  ],
  [
    { icon: TbMusic, label: "Music", href: paths.search("music") },
    {
      icon: MdOutlineSportsVolleyball,
      label: "Sport",
      href: paths.search("sports"),
    },
    { icon: TbDeviceGamepad2, label: "Gaming", href: paths.search("gaming") },
    { icon: GiFilmStrip, label: "Films", href: paths.search("films") },
  ],
  [
    {
      icon: MdSettings,
      label: "Settings",
      href: "https://www.youtube.com/account",
    },
    {
      icon: MdOutlinedFlag,
      label: "Report history",
      href: "https://www.youtube.com/reporthistory",
    },
    {
      icon: MdOutlineHelpOutline,
      label: "Help",
      href: "https://support.google.com/youtube",
    },
    {
      icon: MdOutlineFeedback,
      label: "Send feedback",
      href: "https://support.google.com/youtube/answer/4347644",
    },
  ],
];

export const footerLinks = [
  { label: "About", href: "https://www.youtube.com/about/" },
  { label: "Press", href: "https://www.youtube.com/about/press/" },
  {
    label: "Copyright",
    href: "https://www.youtube.com/howyoutubeworks/policies/copyright/",
  },
  { label: "Contact us", href: "https://www.youtube.com/t/contact_us" },
  { label: "Creators", href: "https://www.youtube.com/creators/" },
  { label: "Advertise", href: "https://www.youtube.com/ads/" },
  { label: "Developers", href: "https://developers.google.com/youtube" },
  { label: "Terms", href: "https://www.youtube.com/t/terms" },
  { label: "Privacy", href: "https://policies.google.com/privacy" },
  {
    label: "Policy & Safety",
    href: "https://www.youtube.com/howyoutubeworks/policies/",
  },
  {
    label: "How YouTube works",
    href: "https://www.youtube.com/howyoutubeworks/",
  },
  { label: "Test new features", href: "https://www.youtube.com/new" },
];
