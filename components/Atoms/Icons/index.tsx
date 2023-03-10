import { createIcon, Icon, IconProps } from "@chakra-ui/react";

export declare type ZLIconType = (props: IconProps) => JSX.Element;

export const HomeIcon = createIcon({
  displayName: "HomeIcon",
  path: (
    <path d="M9.999 19.328v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87l-8.36-7.53c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87h1.7v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
  ),
});

export const AboutIcon = createIcon({
  displayName: "AboutIcon",
  path: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
  ),
});

export const AnalyticsIcon = createIcon({
  displayName: "AnalyticsIcon",
  path: (
    <path d="M8 17c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm2 2H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm1-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
  ),
});

export const AttendeesIcon = createIcon({
  displayName: "AttendeesIcon",
  path: (
    <path d="M15.636 11.143c1.51 0 2.719-1.149 2.719-2.572C18.355 7.15 17.145 6 15.636 6S12.91 7.149 12.91 8.571c0 1.423 1.218 2.572 2.727 2.572zm-7.272 0c1.509 0 2.718-1.149 2.718-2.572C11.082 7.15 9.872 6 8.364 6c-1.51 0-2.728 1.149-2.728 2.571 0 1.423 1.219 2.572 2.728 2.572zm0 1.714c-2.119 0-6.364 1.003-6.364 3v1.286c0 .471.41.857.91.857h10.908c.5 0 .91-.386.91-.857v-1.286c0-1.997-4.246-3-6.364-3zm7.272 0c-.263 0-.563.017-.881.043.018.009.027.026.036.034 1.036.712 1.755 1.663 1.755 2.923v1.286c0 .3-.064.591-.164.857h4.709c.5 0 .909-.386.909-.857v-1.286c0-1.997-4.245-3-6.364-3z" />
  ),
});

export const AuditoriumIcon = (props: IconProps) => (
  <Icon {...props} fill={props.fill ? props.fill : "currentcolor"}>
    <path d="M12 21c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9zm0-16.286A7.29 7.29 0 004.714 12 7.29 7.29 0 0012 19.286 7.29 7.29 0 0019.286 12 7.29 7.29 0 0012 4.714z" />
    <path d="M12 10.08a1.714 1.714 0 100-3.429 1.714 1.714 0 000 3.429zM15.634 13.714a1.714 1.714 0 100-3.428 1.714 1.714 0 000 3.428zM8.366 13.714a1.714 1.714 0 100-3.428 1.714 1.714 0 000 3.428zM12 17.349a1.714 1.714 0 100-3.429 1.714 1.714 0 000 3.429z" />
  </Icon>
);

export const BreakoutRoomsIcon = createIcon({
  displayName: "BreakoutRoomsIcon",
  path: (
    <path d="M19.111 18.222h-.889V5.778c0-.49-.4-.89-.889-.89h-3.555c0-.488-.4-.888-.89-.888H6.668c-.49 0-.89.4-.89.889v13.333H4.89c-.489 0-.889.4-.889.89 0 .488.4.888.889.888h8c.489 0 .889-.4.889-.889V6.667h2.666V19.11c0 .489.4.889.89.889h1.777c.489 0 .889-.4.889-.889s-.4-.889-.889-.889zm-8-5.333a.892.892 0 01-.889-.889c0-.489.4-.889.89-.889.488 0 .888.4.888.889s-.4.889-.889.889z" />
  ),
});

export const CalendarIcon = createIcon({
  displayName: "CalendarIcon",
  path: (
    <path d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V9h14v10c0 .55-.45 1-1 1zM8 11h3c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1z" />
  ),
});

export const ExhibitionIcon = createIcon({
  displayName: "ExhibitionIcon",
  path: (
    <path d="M9 10H5c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1zM19 20h-6c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1zM19 13h-6c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1zM9 20H5c-.55 0-1-.45-1-1v-6c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1" />
  ),
});

export const FeedIcon = (props: IconProps) => (
  <Icon {...props} fill="none">
    <g fill={props.fill ? (props.fill as string) : "currentColor"}>
      <mask id="a">
        <rect x="6" y="6" width="3" height="3" rx=".5" />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 6.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z"
      />
      <rect x="6" y="10" width="12" height="8" rx=".5" />
      <rect
        x="6"
        y="6"
        width="3"
        height="3"
        rx=".5"
        stroke={props.fill ? (props.fill as string) : "currentColor"}
        strokeWidth="2"
        mask="url(#a)"
      />
    </g>
    <rect
      x="4.5"
      y="4.5"
      width="15"
      height="15"
      rx="1.5"
      stroke={props.fill ? (props.fill as string) : "currentColor"}
    />
  </Icon>
);

export const FeedbackIcon = createIcon({
  displayName: "FeedbackIcon",
  path: (
    <path d="M19.2 4H4.8C3.81 4 3 4.774 3 5.721v13.415c0 .766.972 1.153 1.539.611l2.061-1.98h12.6c.99 0 1.8-.774 1.8-1.72V5.72C21 4.774 20.19 4 19.2 4zm-5.787 8.235l-1.008 2.1a.459.459 0 01-.819 0l-1.008-2.1-2.196-.964a.423.423 0 010-.783l2.196-.964 1.008-2.1a.459.459 0 01.819 0l1.008 2.1 2.196.964a.423.423 0 010 .783l-2.196.964z" />
  ),
});

export const LobbyIcon = createIcon({
  displayName: "LobbyIcon",
  path: (
    <path d="M4.487 15.81h15.026c.568 0 1.013-.475.947-1.004-.502-3.837-3.856-6.832-7.996-7.038V6.397h1.43c.266 0 .474-.198.474-.449 0-.25-.208-.448-.473-.448h-3.79c-.265 0-.473.197-.473.448s.208.449.473.449h1.421v1.362c-4.13.215-7.484 3.201-7.995 7.038-.057.538.388 1.013.956 1.013zM20.053 16.707H3.947c-.52 0-.947.403-.947.896 0 .494.426.897.947.897h16.106c.52 0 .947-.403.947-.897 0-.493-.426-.896-.947-.896z" />
  ),
});

export const ResourceCenterIcon = createIcon({
  displayName: "ResourceCenterIcon",
  path: (
    <path d="M3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm17-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9h-8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1zm-4 4h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1zm4-8h-8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z" />
  ),
});

export const RoomIcon = createIcon({
  displayName: "RoomIcon",
  path: (
    <path d="M19.111 18.222h-.889V5.778c0-.49-.4-.89-.889-.89h-3.555c0-.488-.4-.888-.89-.888H6.668c-.49 0-.89.4-.89.889v13.333H4.89c-.489 0-.889.4-.889.89 0 .488.4.888.889.888h8c.489 0 .889-.4.889-.889V6.667h2.666V19.11c0 .489.4.889.89.889h1.777c.489 0 .889-.4.889-.889s-.4-.889-.889-.889zm-8-5.333a.892.892 0 01-.889-.889c0-.489.4-.889.89-.889.488 0 .888.4.888.889s-.4.889-.889.889z" />
  ),
});

export const RoundtableIcon = (props: IconProps) => (
  <Icon {...props} fill={props.fill ? props.fill : "currentColor"}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 17a5 5 0 100-10 5 5 0 000 10zm0 2a7 7 0 100-14 7 7 0 000 14z"
    />
    <path d="M19.07 7.757a2 2 0 11-2.828-2.829 2 2 0 012.829 2.829zM7.757 19.07a2 2 0 11-2.828-2.827 2 2 0 012.828 2.828zM16.242 19.07a2 2 0 112.828-2.828 2 2 0 01-2.828 2.829zM4.929 7.757a2 2 0 112.828-2.828 2 2 0 01-2.828 2.828z" />
  </Icon>
);

export const SettingsIcon = createIcon({
  displayName: "SettingsIcon",
  path: (
    <path d="M18.17 12c0-.184-.008-.36-.024-.544l1.53-1.128a.79.79 0 00.214-1.04l-1.538-2.584a.824.824 0 00-1.029-.336l-1.769.728a6.287 6.287 0 00-.962-.544l-.239-1.848A.817.817 0 0013.54 4h-3.07a.82.82 0 00-.822.704l-.239 1.848a6.287 6.287 0 00-.962.544l-1.77-.728a.823.823 0 00-1.028.336L4.11 9.296a.792.792 0 00.214 1.04l1.53 1.128a5.711 5.711 0 000 1.08l-1.53 1.128a.79.79 0 00-.214 1.04l1.538 2.584a.823.823 0 001.029.336l1.769-.728c.304.208.625.392.962.544l.239 1.848c.05.4.403.704.814.704h3.07a.818.818 0 00.814-.704l.239-1.848c.337-.152.658-.336.962-.544l1.77.728a.823.823 0 001.027-.336l1.54-2.584a.792.792 0 00-.215-1.04l-1.53-1.128A4.02 4.02 0 0018.17 12zm-6.137 2.8c-1.588 0-2.88-1.256-2.88-2.8 0-1.544 1.292-2.8 2.88-2.8 1.588 0 2.88 1.256 2.88 2.8 0 1.544-1.292 2.8-2.88 2.8z" />
  ),
});

export const SocialWallIcon = createIcon({
  displayName: "SocialWallIcon",
  path: (
    <path d="M21 5v14h2V5h-2zm-4 14h2V5h-2v14zM14 5H2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM8 7.75c1.24 0 2.25 1.01 2.25 2.25S9.24 12.25 8 12.25 5.75 11.24 5.75 10 6.76 7.75 8 7.75zM12.5 17h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V17z" />
  ),
});

export const SpeakersIcon = createIcon({
  displayName: "SpeakersIcon",
  path: (
    <path d="M12 14.105c1.438 0 2.6-1.128 2.6-2.526V6.526C14.6 5.128 13.438 4 12 4c-1.44 0-2.601 1.128-2.601 2.526v5.053c0 1.398 1.161 2.526 2.6 2.526zm5.122-2.526a.858.858 0 00-.85.716C15.917 14.274 14.14 15.79 12 15.79c-2.14 0-3.918-1.516-4.273-3.495a.857.857 0 00-.85-.716c-.529 0-.945.455-.867.96.425 2.526 2.506 4.505 5.123 4.867v1.752c0 .463.39.842.867.842a.857.857 0 00.867-.842v-1.752c2.618-.362 4.698-2.34 5.123-4.867.086-.505-.338-.96-.867-.96z" />
  ),
});

export const SponsorIcon = createIcon({
  displayName: "SponsorIcon",
  path: (
    <path d="M18 12.005c0 .55.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1zM16.59 16.825a.966.966 0 00.2 1.37c.53.39 1.09.81 1.62 1.21.44.33 1.06.24 1.38-.2 0-.01.01-.01.01-.02a.978.978 0 00-.2-1.38c-.53-.4-1.09-.82-1.61-1.21a.993.993 0 00-1.39.21c0 .01-.01.02-.01.02zM19.81 4.815c0-.01-.01-.01-.01-.02a.98.98 0 00-1.38-.2c-.53.4-1.1.82-1.62 1.22-.44.33-.52.95-.19 1.38 0 .01.01.01.01.02.33.44.94.53 1.38.2.53-.39 1.09-.82 1.62-1.22.43-.32.51-.94.19-1.38zM8 9.005H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h1l5 3v-12l-5 3zM15.5 12.005c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z" />
  ),
});

export const VODIcon = createIcon({
  displayName: "VODIcon",
  path: (
    <path d="M20.1 6H3.9c-.495 0-.9.386-.9.857v10.286c0 .471.405.857.9.857h16.2c.495 0 .9-.386.9-.857V6.857c0-.471-.405-.857-.9-.857zm-5.184 6.746l-3.699 2.031c-.603.334-1.35-.086-1.35-.746V9.97c0-.66.747-1.08 1.35-.746l3.699 2.031a.84.84 0 010 1.492z" />
  ),
});

export const NotificationIcon = createIcon({
  displayName: "NotificationIcon",
  path: (
    <path d="M12 21.75c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32v-.68c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.11 6 7.67 6 10.75v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 15.75z" />
  ),
});

export const LogoutIcon = (props: IconProps) => (
  <Icon {...props} fill={props.fill ? props.fill : "currentColor"}>
    <path d="M5.799 5.778h5.395c.495 0 .9-.4.9-.89a.897.897 0 00-.9-.888H5.8C4.809 4 4 4.8 4 5.778v12.444C4 19.2 4.81 20 5.799 20h5.395c.495 0 .9-.4.9-.889a.897.897 0 00-.9-.889H5.8V5.778z" />
    <path d="M19.873 11.689l-2.51-2.48c-.287-.285-.773-.089-.773.311v1.591h-6.295c-.494 0-.9.4-.9.889s.406.889.9.889h6.295v1.591c0 .4.486.596.765.311l2.509-2.48a.434.434 0 00.009-.622z" />
  </Icon>
);

export const ArrowUpIcon = (props: IconProps) => (
  <Icon {...props} fill={props.fill ? props.fill : "currentColor"}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.294 7.758a1 1 0 011.414 0l7.07 7.07a1 1 0 11-1.413 1.415L12 9.879l-6.364 6.364a1 1 0 01-1.414-1.414l7.07-7.071z"
      fill="currentColor"
    />
  </Icon>
);

export const ArrowDownIcon = (props: IconProps) => (
  <Icon {...props} fill={props.fill ? props.fill : "currentColor"}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.223 7.758a1 1 0 011.414 0L12 14.122l6.364-6.364a1 1 0 111.414 1.414l-7.071 7.071a1 1 0 01-1.414 0L4.223 9.172a1 1 0 010-1.414z"
      fill="currentColor"
    />
  </Icon>
);

export const SearchIcon = createIcon({
  displayName: "SearchIcon",
  path: (
    <path d="M15.977 14.471h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49l-4.24-4.26zm-6 0c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
  ),
});

export const PlusIcon = createIcon({
  displayName: "PlusIcon",
  path: (
    <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" />
  ),
});

export const FacebookIcon = createIcon({
  displayName: "FacebookIcon",
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.34 20.5v-7.74h2.682l.383-3.021h-3.064V7.85c0-.85.287-1.51 1.531-1.51H16.5V3.601c-.382 0-1.34-.094-2.393-.094a3.745 3.745 0 00-1.566.233c-.5.188-.95.48-1.324.857a3.638 3.638 0 00-.838 1.325 3.597 3.597 0 00-.198 1.55v2.266H7.5v3.02h2.681V20.5h3.16z"
    />
  ),
});

export const TwitterIcon = createIcon({
  displayName: "TwitterIcon",
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.25 18.249a8.472 8.472 0 003.361-.663 8.659 8.659 0 002.85-1.946 8.931 8.931 0 001.894-2.928A9.12 9.12 0 0018 9.26v-.428a6.883 6.883 0 001.5-1.627 6.778 6.778 0 01-1.75.514c.62-.4 1.09-1.004 1.333-1.713a7.524 7.524 0 01-1.916.77 2.982 2.982 0 00-1.017-.763 2.909 2.909 0 00-1.233-.263 3.09 3.09 0 00-2.167.942 3.26 3.26 0 00-.917 2.226c-.019.231.01.465.084.684a8.438 8.438 0 01-3.519-.966 8.67 8.67 0 01-2.815-2.373 3.344 3.344 0 00-.416 1.627c.01.518.136 1.026.367 1.486.231.46.562.86.966 1.168-.501-.01-.99-.158-1.417-.427 0 .733.25 1.443.706 2.006a3.03 3.03 0 001.794 1.075 2.503 2.503 0 01-.833.086 1.385 1.385 0 01-.583-.086 3.24 3.24 0 001.115 1.588 3.103 3.103 0 001.801.638 6.186 6.186 0 01-3.833 1.37 2.248 2.248 0 01-.75-.086 7.723 7.723 0 004.75 1.54z"
    />
  ),
});

export const LinkedinIcon = createIcon({
  displayName: "LinkedinIcon",
  path: (
    <path d="M16.667 4H7.333A3.335 3.335 0 004 7.333v9.334A3.335 3.335 0 007.333 20h9.334A3.334 3.334 0 0020 16.667V7.333A3.335 3.335 0 0016.667 4zM9.333 16.667h-2V9.333h2v7.334zm-1-8.18a1.17 1.17 0 01-1.166-1.174c0-.646.52-1.18 1.166-1.18A1.17 1.17 0 019.5 7.307c0 .646-.52 1.18-1.167 1.18zm9 8.18h-2v-3.734c0-2.246-2.666-2.073-2.666 0v3.734h-2V9.333h2v1.18c.933-1.726 4.666-1.853 4.666 1.654v4.5z" />
  ),
});

export const LinkIcon = createIcon({
  displayName: "LinkIcon",
  path: (
    <path d="M17 7h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c1.65 0 3 1.35 3 3s-1.35 3-3 3h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-9 5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1zm2 3H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h3c.55 0 1-.45 1-1s-.45-1-1-1H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h3c.55 0 1-.45 1-1s-.45-1-1-1z" />
  ),
});

export const TrashIcon = createIcon({
  displayName: "TrashIcon",
  path: (
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" />
  ),
});
