import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

function Icon({
  children,
  viewBox = "0 0 24 24",
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconAdjustmentsHorizontal(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h4" />
      <path d="M14 7h6" />
      <path d="M10 5v4" />
      <path d="M4 17h10" />
      <path d="M18 17h2" />
      <path d="M16 15v4" />
    </Icon>
  );
}

export function IconArchive(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M5 7l1 13h12l1-13" />
      <path d="M8 7V4h8v3" />
      <path d="M10 12h4" />
    </Icon>
  );
}

export function IconBell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
      <path d="M10 21h4" />
    </Icon>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      <path d="M4 7h16v12H4z" />
      <path d="M4 12h16" />
      <path d="M10 12v2h4v-2" />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12l4 4L19 6" />
    </Icon>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Icon>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function IconChevronUp(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 15l6-6 6 6" />
    </Icon>
  );
}

export function IconChevronsLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11 6l-6 6 6 6" />
      <path d="M19 6l-6 6 6 6" />
    </Icon>
  );
}

export function IconChevronsRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 6l6 6-6 6" />
      <path d="M13 6l6 6-6 6" />
    </Icon>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

export function IconDatabase(props: IconProps) {
  return (
    <Icon {...props}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </Icon>
  );
}

export function IconDots(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h.01" />
      <path d="M12 12h.01" />
      <path d="M19 12h.01" />
    </Icon>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </Icon>
  );
}

export function IconEdit(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20h4l11-11-4-4L4 16v4z" />
      <path d="M13 7l4 4" />
    </Icon>
  );
}

export function IconEye(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.3A10.5 10.5 0 0 1 12 5c6 0 10 7 10 7a18 18 0 0 1-3.2 4" />
      <path d="M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a10.6 10.6 0 0 0 4.1-.8" />
    </Icon>
  );
}

export function IconFileUpload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3v5h5" />
      <path d="M5 21V3h9l5 5v13H5z" />
      <path d="M12 17v-6" />
      <path d="M9 14l3-3 3 3" />
    </Icon>
  );
}

export function IconInbox(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 13l2-8h12l2 8" />
      <path d="M4 13h5l2 3h2l2-3h5v6H4z" />
    </Icon>
  );
}

export function IconLayoutGrid(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </Icon>
  );
}

export function IconList(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </Icon>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 11a8 8 0 0 0-14.5-4L4 9" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.5 4L20 15" />
      <path d="M15 15h5v5" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5" />
    </Icon>
  );
}

export function IconSelector(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 9l4-4 4 4" />
      <path d="M16 15l-4 4-4-4" />
    </Icon>
  );
}

export function IconSparkles(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
      <path d="M5 15l.7 1.6L7 17.3l-1.3.7L5 20l-.7-2L3 17.3l1.3-.7L5 15z" />
    </Icon>
  );
}

export function IconStar(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3z" />
    </Icon>
  );
}

export function IconUserCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21a6 6 0 0 1 12 0" />
      <path d="M16 11l2 2 4-4" />
    </Icon>
  );
}

export function IconX(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  );
}
