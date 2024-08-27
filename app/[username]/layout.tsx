import { Navbar } from "@/components/index";
const UserProfileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default UserProfileLayout;
