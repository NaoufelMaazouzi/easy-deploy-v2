import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ServiceData } from "../../data";

export default function Faq({ siteContent }: { siteContent: ServiceData }) {
  const {
    faq: { h2, description, questions },
  } = siteContent;
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="faq">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="text-lightgrey text-3xl font-bold tracking-tighter sm:text-5xl">
            {h2}
          </h2>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {description}
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 pt-12">
          {questions.map((item, idx) => (
            <Collapsible
              className="rounded-md border bg-background shadow-sm"
              key={idx}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
                <h3 className="text-lightgrey text-lg font-medium">
                  {item.question}
                </h3>
                <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t px-6 py-4 text-muted-foreground">
                <p dangerouslySetInnerHTML={{ __html: item.answer }} />
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
