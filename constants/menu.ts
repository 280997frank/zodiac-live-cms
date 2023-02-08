import { NavItemProps } from "components/Atoms/NavItem";
import {
  AboutIcon,
  AnalyticsIcon,
  AttendeesIcon,
  AuditoriumIcon,
  BreakoutRoomsIcon,
  CalendarIcon,
  ExhibitionIcon,
  FeedbackIcon,
  FeedIcon,
  HomeIcon,
  LobbyIcon,
  NotificationIcon,
  ResourceCenterIcon,
  RoundtableIcon,
  SettingsIcon,
  SocialWallIcon,
  SpeakersIcon,
  SponsorIcon,
  VODIcon,
} from "@/components/Atoms/Icons";

const menu: NavItemProps[] = [
  {
    label: "Landing Page",
    url: "/landing-page",
    icon: HomeIcon,
    divider: true,
  },
  {
    label: "Main",
    url: "",
    submenu: [
      {
        label: "Lobby",
        url: "/lobby",
        icon: LobbyIcon,
      },
      {
        label: "About Event",
        url: "/about-event",
        icon: AboutIcon,
      },
      {
        label: "Feed",
        url: "/feed",
        icon: FeedIcon,
      },
    ],
  },
  {
    label: "Rooms",
    url: "",
    submenu: [
      {
        label: "Auditorium",
        url: "/auditorium",
        icon: AuditoriumIcon,
      },
      {
        label: "Exhibition Hall",
        url: "/exhibition-hall",
        icon: ExhibitionIcon,
      },
      {
        label: "Breakout Rooms",
        url: "/breakout-rooms",
        icon: BreakoutRoomsIcon,
      },
      {
        label: "Roundtable",
        url: "/roundtable",
        icon: RoundtableIcon,
      },
    ],
  },
  {
    label: "Event & Session",
    url: "",
    submenu: [
      {
        label: "Event Agenda",
        url: "/event-agenda",
        icon: CalendarIcon,
      },
      {
        label: "Speakers",
        url: "/speakers",
        icon: SpeakersIcon,
      },
      {
        label: "Users",
        url: "/users",
        icon: AttendeesIcon,
      },
      {
        label: "Resource Center",
        url: "/resource-center",
        icon: ResourceCenterIcon,
      },
      {
        label: "Video on Demand",
        url: "/vod",
        icon: VODIcon,
      },
    ],
  },
  {
    label: "Miscellaneous",
    url: "",
    divider: true,
    submenu: [
      {
        label: "Sponsors",
        url: "/sponsors",
        icon: SponsorIcon,
      },
      {
        label: "Feedback",
        url: "/feedback",
        icon: FeedbackIcon,
      },
      {
        label: "Social Wall",
        url: "/social-wall",
        icon: SocialWallIcon,
      },
    ],
  },
  {
    label: "Notification",
    url: "/notification",
    icon: NotificationIcon,
  },
  {
    label: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
  {
    label: "Analytics",
    url: "/analytics",
    icon: AnalyticsIcon,
  },
];

export default menu;
