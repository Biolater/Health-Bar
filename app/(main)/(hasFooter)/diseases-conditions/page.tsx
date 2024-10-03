import DiseasesConditionsInner from "./DiseasesConditionsInner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthbar | Diseases & Conditions",
};

const DiseasesConditions = () => {
  return <DiseasesConditionsInner />;
};

export default DiseasesConditions;
