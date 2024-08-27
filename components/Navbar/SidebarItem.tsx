import { FC } from "react";
import Link from "next/link";
const SidebarItem: FC<{
  icon: JSX.Element;
  label: string;
  href?: string;
  isActive?: boolean;
  onSelect: () => void;
  onAction?: () => void;
  hasAction?: boolean;
}> = ({ icon, label, href, isActive, onSelect, hasAction, onAction }) => {
  return hasAction ? (
    <button
      onClick={onAction}
      className="flex
      } font-medium text-foreground transition-all duration-300 p-2 hover:bg-accent hover:text-accent-foreground rounded-lg gap-1"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  ) : (
    <Link
      onClick={onSelect}
      className={`flex ${
        isActive ? "bg-accent text-accent-foreground" : ""
      } font-medium text-foreground transition-all duration-300 p-2 hover:bg-accent hover:text-accent-foreground rounded-lg gap-1`}
      href={href || "#"}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
