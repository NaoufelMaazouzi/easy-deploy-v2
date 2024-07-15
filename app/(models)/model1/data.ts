export interface Feature {
  imgSrc: string;
  heading: string;
  subheading: string;
  link: string;
}

export interface Question {
  question: string;
  answer: string;
}

export interface Faq {
  h2: string;
  description: string;
  questions: Question[];
}

export interface ServiceData {
  bannerH1: string;
  bannerImgSrc: string;
  featuresTitle: string;
  featuresData: Feature[];
  firstServicesH2: string;
  firstServicesH3: string;
  firstServicesText: string;
  firstServicesImgSrc: string;
  secondServicesH2: string;
  secondServicesH3: string;
  secondServicesText: string;
  secondServicesImgSrc: string;
  ctaBannerH3: string;
  ctaBannerH4: string;
  faq: Faq;
}

export interface Data {
  vtc: ServiceData;
  plombier: ServiceData;
}

export type SiteDataModel = "vtc" | "plombier";

export const data = ({
  model,
  phoneNumberParsed,
}: {
  model: SiteDataModel;
  phoneNumberParsed: string | undefined;
}): ServiceData => {
  const dataModels: Record<SiteDataModel, ServiceData> = {
    vtc: {
      bannerH1: "Réservez votre VTC à Dreux !",
      bannerImgSrc: "/images/Banner/VTC4.png",
      featuresTitle: "Voyagez en toute sérénité",
      featuresData: [
        {
          imgSrc: "/images/Features/clock.svg",
          heading: "Ponctualité",
          subheading:
            "Toujours à l'heure, jamais en retard, déplacements sans stress",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/star.svg",
          heading: "Confort",
          subheading: "Voyagez confortablement dans nos véhicules modernes",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/euro.svg",
          heading: "Tarifs compétitifs",
          subheading: "Prix transparents et abordables, sans frais cachés.",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/security.svg",
          heading: "Sécurité",
          subheading: "Véhicules entretenus, conduite prudente et respectueuse",
          link: "Je réserve",
        },
      ],
      firstServicesH2: "Un service personnalisé",
      firstServicesH3: "Tranquillité totale",
      firstServicesText: `Nous croyons fermement que chaque trajet doit être une
        expérience agréable, confortable et sans souci. Nous comprenons
        que vos déplacements, qu'ils soient personnels ou
        professionnels, doivent se dérouler dans les meilleures
        conditions possibles pour vous offrir une tranquillité d'esprit
        totale. C'est pourquoi nous mettons un point d'honneur à offrir
        un service de transport de qualité supérieure à Dreux et dans
        ses environs.`,
      firstServicesImgSrc: "/images/Banner/VTC.png",
      secondServicesH2: "Un service haut de gamme",
      secondServicesH3: "Confort et sécurité",
      secondServicesText: `Nous mettons un point d'honneur à assurer votre confort et votre
        sécurité à chaque trajet. Nos véhicules haut de gamme sont
        soigneusement entretenus pour vous offrir une expérience de
        voyage agréable et sans souci. Avec des sièges spacieux, une
        climatisation ajustable et une propreté impeccable, chaque
        kilomètre parcouru avec nous est synonyme de détente et de
        tranquillité d'esprit. Faites confiance à nos chauffeurs
        professionnels pour vous conduire en toute sécurité vers votre
        destination, quel que soit le trajet à Dreux et ses environs.`,
      secondServicesImgSrc: "/images/Banner/vtc-img.jpg",
      ctaBannerH3: "VTC Dreux",
      ctaBannerH4: "Choisissez l'excellence avec VTC-Dreux",
      faq: {
        h2: "Questions fréquemment posées",
        description: `Obtenez des réponses aux questions les plus courantes sur nos
          services. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas
          à nous contacter.`,
        questions: [
          {
            question: "Quels sont les types de services que vous proposez ?",
            answer: `
              Nous offrons une gamme complète de services de transport VTC à
              Dreux et ses environs, y compris :
              <ul>
                <li>Transferts vers et depuis les aéroports, gares et hôtels.</li>
                <li>Déplacements professionnels pour les réunions, conférences
                et événements d'entreprise.</li>
                <li>Chauffeur privé pour mariages, soirées spéciales, visites
                touristiques, etc.</li>
              </ul>
            `,
          },
          {
            question: "Comment puis-je réserver un trajet ?",
            answer: `Pour réserver votre trajet, vous pouvez nous appeler ou nous
            envoyer un message au <strong><a href="tel:${phoneNumberParsed}">${phoneNumberParsed}</a></strong>`,
          },
          {
            question: "Puis-je annuler ma réservation ?",
            answer: `Oui, vous pouvez annuler votre réservation. Nous comprenons que
            les plans peuvent changer. Veuillez nous contacter dès que
            possible pour annuler ou modifier votre réservation sans frais
            supplémentaires.`,
          },
          {
            question: "Quels sont vos tarifs ?",
            answer: `Nos tarifs sont compétitifs et basés sur la distance. Obtenez
            une estimation précise lors de votre réservation ou en nous
            contactant directement.`,
          },
          {
            question: "Acceptez-vous les paiements en espèces ?",
            answer: "Oui, nous acceptons les paiements en espèces.",
          },
        ],
      },
    },
    plombier: {
      bannerH1: "Réservez votre VTC à Dreux !",
      bannerImgSrc: "/images/Banner/Plombier.png",
      featuresTitle: "Voyagez en toute sérénité",
      featuresData: [
        {
          imgSrc: "/images/Features/clock.svg",
          heading: "Ponctualité",
          subheading:
            "Toujours à l'heure, jamais en retard, déplacements sans stress",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/star.svg",
          heading: "Confort",
          subheading: "Voyagez confortablement dans nos véhicules modernes",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/euro.svg",
          heading: "Tarifs compétitifs",
          subheading: "Prix transparents et abordables, sans frais cachés.",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/security.svg",
          heading: "Sécurité",
          subheading: "Véhicules entretenus, conduite prudente et respectueuse",
          link: "Je réserve",
        },
      ],
      firstServicesH2: "Un service personnalisé",
      firstServicesH3: "Tranquillité totale",
      firstServicesText: `Nous croyons fermement que chaque trajet doit être une
          expérience agréable, confortable et sans souci. Nous comprenons
          que vos déplacements, qu'ils soient personnels ou
          professionnels, doivent se dérouler dans les meilleures
          conditions possibles pour vous offrir une tranquillité d'esprit
          totale. C'est pourquoi nous mettons un point d'honneur à offrir
          un service de transport de qualité supérieure à Dreux et dans
          ses environs.`,
      firstServicesImgSrc: "/images/Banner/VTC.png",
      secondServicesH2: "Un service haut de gamme",
      secondServicesH3: "Confort et sécurité",
      secondServicesText: `Nous mettons un point d'honneur à assurer votre confort et votre
          sécurité à chaque trajet. Nos véhicules haut de gamme sont
          soigneusement entretenus pour vous offrir une expérience de
          voyage agréable et sans souci. Avec des sièges spacieux, une
          climatisation ajustable et une propreté impeccable, chaque
          kilomètre parcouru avec nous est synonyme de détente et de
          tranquillité d'esprit. Faites confiance à nos chauffeurs
          professionnels pour vous conduire en toute sécurité vers votre
          destination, quel que soit le trajet à Dreux et ses environs.`,
      secondServicesImgSrc: "/images/Banner/vtc-img.jpg",
      ctaBannerH3: "VTC Dreux",
      ctaBannerH4: "Choisissez l'excellence avec VTC-Dreux",
      faq: {
        h2: "Questions fréquemment posées",
        description: `Obtenez des réponses aux questions les plus courantes sur nos
            services. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas
            à nous contacter.`,
        questions: [
          {
            question: "Quels sont les types de services que vous proposez ?",
            answer: `
                Nous offrons une gamme complète de services de transport VTC à
                Dreux et ses environs, y compris :
                <ul>
                  <li>Transferts vers et depuis les aéroports, gares et hôtels.</li>
                  <li>Déplacements professionnels pour les réunions, conférences
                  et événements d'entreprise.</li>
                  <li>Chauffeur privé pour mariages, soirées spéciales, visites
                  touristiques, etc.</li>
                </ul>
              `,
          },
          {
            question: "Comment puis-je réserver un trajet ?",
            answer: `Pour réserver votre trajet, vous pouvez nous appeler ou nous
              envoyer un message au <strong><a href="tel:${phoneNumberParsed}">${phoneNumberParsed}</a></strong>`,
          },
          {
            question: "Puis-je annuler ma réservation ?",
            answer: `Oui, vous pouvez annuler votre réservation. Nous comprenons que
              les plans peuvent changer. Veuillez nous contacter dès que
              possible pour annuler ou modifier votre réservation sans frais
              supplémentaires.`,
          },
          {
            question: "Quels sont vos tarifs ?",
            answer: `Nos tarifs sont compétitifs et basés sur la distance. Obtenez
              une estimation précise lors de votre réservation ou en nous
              contactant directement.`,
          },
          {
            question: "Acceptez-vous les paiements en espèces ?",
            answer: "Oui, nous acceptons les paiements en espèces.",
          },
        ],
      },
    },
  };
  if (model in dataModels) {
    return dataModels[model];
  } else {
    throw new Error(`Model ${model} not found`);
  }
};
