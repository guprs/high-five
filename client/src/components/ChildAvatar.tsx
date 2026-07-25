import type { Child } from "../types/dashboard";

interface Props {
  child: Child;
  size?: "sm" | "md" | "lg" | "xl";
}

export function ChildAvatar({
  child,
  size = "md",
}: Props) {
  const sizes = {
    sm: "w-7 h-7 text-sm",
    md: "w-10 h-10 text-xl",
    lg: "w-14 h-14 text-2xl",
    xl: "w-20 h-20 text-4xl",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        flex
        items-center
        justify-center
        shrink-0
        ring-2
        ring-white
        shadow-sm
      `}
      style={{
        backgroundColor: `${child.color}22`,
        border: `2px solid ${child.color}55`,
      }}
    >
      {child.avatar}
    </div>
  );
}