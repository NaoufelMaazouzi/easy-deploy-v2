import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export default function Faq({
  phoneNumberParsed,
}: {
  phoneNumberParsed: string | undefined;
}) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="faq">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="text-lightgrey text-3xl font-bold tracking-tighter sm:text-5xl">
            Questions fréquemment posées
          </h2>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Obtenez des réponses aux questions les plus courantes sur nos
            services. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas
            à nous contacter.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 pt-12">
          <Collapsible className="rounded-md border bg-background shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
              <h3 className="text-lightgrey text-lg font-medium">
                Quels sont les types de services que vous proposez ?
              </h3>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-6 py-4 text-muted-foreground">
              <p>
                Nous offrons une gamme complète de services de transport VTC à
                Dreux et ses environs, y compris :
                <ul>
                  <li>
                    Transferts vers et depuis les aéroports, gares et hôtels.
                  </li>
                  <li>
                    Déplacements professionnels pour les réunions, conférences
                    et événements d'entreprise.
                  </li>
                  <li>
                    Chauffeur privé pour mariages, soirées spéciales, visites
                    touristiques, etc.
                  </li>
                </ul>
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="rounded-md border bg-background shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
              <h3 className="text-lightgrey text-lg font-medium">
                Comment puis-je réserver un trajet ?
              </h3>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-6 py-4 text-muted-foreground">
              <p>
                Pour réserver votre trajet vus pouvez nous appeler ou nous
                envoyer un message au{" "}
                <a href={`tel:${phoneNumberParsed}`}>{phoneNumberParsed}</a>
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="rounded-md border bg-background shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
              <h3 className="text-lightgrey text-lg font-medium">
                Puis-je annuler ma réservation ?
              </h3>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-6 py-4 text-muted-foreground">
              <p>
                Oui, vous pouvez annuler votre réservation. Nous comprenons que
                les plans peuvent changer. Veuillez nous contacter dès que
                possible pour annuler ou modifier votre réservation sans frais
                supplémentaires.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="rounded-md border bg-background shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
              <h3 className="text-lightgrey text-lg font-medium">
                Quels sont vos tarifs ?
              </h3>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-6 py-4 text-muted-foreground">
              <p>
                Nos tarifs sont compétitifs et basés sur la distance. Obtenez
                une estimation précise lors de votre réservation ou en nous
                contactant directement.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="rounded-md border bg-background shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
              <h3 className="text-lightgrey text-lg font-medium">
                Acceptez-vous les paiements en espèces ?
              </h3>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-6 py-4 text-muted-foreground">
              <p>Oui, nous acceptons les paiements en espèces</p>
            </CollapsibleContent>
          </Collapsible>
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
