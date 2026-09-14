import type { ComponentType } from "react";
export type RuneIcon = ComponentType<{ className?: string }>;
function Glyph({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-4 shrink-0 ${className}`}
      style={{
        background: "currentColor",
        mask: `url(/icons/${name}.svg) center / contain no-repeat`,
        WebkitMask: `url(/icons/${name}.svg) center / contain no-repeat`,
      }}
    />
  );
}
export const Check: RuneIcon = (props) => <Glyph name="check" {...props} />;
export const ChevronDown: RuneIcon = (props) => (
  <Glyph name="chevron-down" {...props} />
);
export const Search: RuneIcon = (props) => <Glyph name="search" {...props} />;
export const Sun: RuneIcon = (props) => <Glyph name="sun" {...props} />;
export const Moon: RuneIcon = (props) => <Glyph name="moon" {...props} />;
export const X: RuneIcon = (props) => <Glyph name="x" {...props} />;
export const Info: RuneIcon = (props) => <Glyph name="info" {...props} />;
export const AlertCircle: RuneIcon = (props) => (
  <Glyph name="circle-alert" {...props} />
);
export const Bell = Info;
export const LoaderCircle = Info;
export const Home: RuneIcon = (props) => <Glyph name="house" {...props} />;
export const Calendar: RuneIcon = (props) => (
  <Glyph name="calendar" {...props} />
);
export const Aircraft: RuneIcon = (props) => <Glyph name="grid" {...props} />;
