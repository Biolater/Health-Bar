import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const ACCORDION_ITEMS = [
  {
    accordionValue: "item-1",
    accordionTitle: "Symptom Checker",
    accordionContent:
      "Quickly assess your health concerns with our advanced symptom checker. Get potential diagnoses and recommended next steps.",
  },
  {
    accordionValue: "item-2",
    accordionTitle: "Community",
    accordionContent:
      "Connect with others facing similar health challenges. Share experiences, support, and information. Find encouragement and motivation in our supportive community.",
  },
  {
    accordionValue: "item-3",
    accordionTitle: "Health Resources",
    accordionContent:
      "Access a wealth of health information, tools, and resources. Stay informed and empowered with our comprehensive library.",
  },
];

const Features = () => {
  return (
    <section id="features" className="px-4 py-8 sm:px-16 md:px-32">
      <div className="mx-auto flex flex-col items-center justify-center max-w-7xl">
        <h1 className="text-3xl md:text-5xl mb-8 md:mb-12 text-primary font-bold text-center">
          Features
        </h1>
        <Accordion className="w-full" type="single" collapsible>
          {ACCORDION_ITEMS.map((item) => (
            <AccordionItem
              key={item.accordionValue}
              value={item.accordionValue}
              className="w-full"
            >
              <AccordionTrigger className="w-full">
                {item.accordionTitle}
              </AccordionTrigger>
              <AccordionContent className="w-full">
                {item.accordionContent}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Features;
