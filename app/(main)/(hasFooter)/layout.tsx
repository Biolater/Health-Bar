import { Footer } from "@/components/index";

const HasFooterLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default HasFooterLayout;
