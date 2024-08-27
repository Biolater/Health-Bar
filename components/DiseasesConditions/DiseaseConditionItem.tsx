import { FC } from "react";

type Props = {
  mainLetter: string;
  children: React.ReactNode;
};

const DiseaseConditionItem: FC<Props> = ({ mainLetter, children }) => {
  return (
    <div >
      <h2 className="text-white  bg-primary size-12 inline-flex items-center justify-center rounded-xl mb-4 text-xl font-bold">
        {mainLetter} :
      </h2>
      <ul>{children}</ul>
    </div>
  );
};

export default DiseaseConditionItem;
