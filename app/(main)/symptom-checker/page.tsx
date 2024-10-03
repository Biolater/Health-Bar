import SymptomCheckerInner from "./SymptomCheckerInner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthbar | Symptom Checker",
};
const SymptomChecker = () => {
  return (  
    <main
      id="symptom-checker"
      className="w-full h-[calc(100svh-56px)] overflow-hidden justify-between flex flex-col mx-auto"
    >
      <SymptomCheckerInner />
    </main>
  );
};

export default SymptomChecker;
