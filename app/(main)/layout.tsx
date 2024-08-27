import { Navbar, Footer } from "@/components/index";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default MainLayout;
