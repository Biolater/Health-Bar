import Link from "next/link";

const MetaDataItem: React.FC<{
  title: string;
  value: string;
  icon: React.JSX.Element;
  isLink?: boolean;
  link?: string;
}> = ({ title, value, icon, isLink, link }) => {
  return isLink ? (
    <Link
      href={link || "#"}
      target="_blank"
      className="flex hover:text-white items-center font-medium text-sm text-white/80 p-2 gap-2"
    >
      <span>{icon}</span>
      <span>{value}</span>
    </Link>
  ) : (
    <span className="flex font-medium text-white/80 text-sm items-center p-2 gap-2">
      <span>{icon}</span>
      <span>{value}</span>
    </span>
  );
};

export default MetaDataItem;
