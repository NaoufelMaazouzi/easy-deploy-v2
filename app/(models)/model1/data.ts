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
  city,
  corporateName,
}: {
  model: SiteDataModel;
  phoneNumberParsed: string | undefined;
  city: string;
  corporateName: string;
}): ServiceData => {
  const dataModels: Record<SiteDataModel, ServiceData> = {
    vtc: {
      bannerH1: `Réservez votre VTC à ${city} !`,
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
        un service de transport de qualité supérieure à ${city} et dans
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
        destination, quel que soit le trajet à ${city} et ses environs.`,
      secondServicesImgSrc: "/images/Banner/vtc-img.jpg",
      ctaBannerH3: corporateName,
      ctaBannerH4: `Choisissez l'excellence avec ${corporateName}`,
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
              ${city} et ses environs, y compris :
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
      bannerH1: `Plombier à ${city}, service express !`,
      bannerImgSrc: "/images/Banner/Plombier.png",
      featuresTitle: "Dépannage en toute sérénité",
      featuresData: [
        {
          imgSrc: "/images/Features/clock.svg",
          heading: "Installation en 24/48 H",
          subheading:
            "Toujours à l'heure, jamais en retard, dépannage sans stress",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/security.svg",
          heading: "Visite technique le jour même",
          subheading: "Nous intervenons le jour même pour tout dépannage",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/euro.svg",
          heading: "Tarifs compétitifs et abordables",
          subheading: "Prix transparents et abordables, sans frais cachés.",
          link: "Je réserve",
        },
        {
          imgSrc: "/images/Features/star.svg",
          heading: "Dépannage et entretien",
          subheading: "Nous intervenons en cas de problème de plomberie",
          link: "Je réserve",
        },
      ],
      firstServicesH2: "Une intervention sur mesure",
      firstServicesH3: "Confiance et sérénité",
      firstServicesText: `Nous sommes convaincus que chaque intervention de plomberie doit
          être rapide, efficace et sans soucis. Que ce soit pour une urgence ou une maintenance
          régulière, nous veillons à ce que tout se passe dans les meilleures conditions possibles
          afin de vous offrir une tranquillité d'esprit totale. Notre engagement est d'offrir un
          service de plomberie exceptionnel à ${city} et dans ses environs, alliant professionnalisme
          et qualité.`,
      firstServicesImgSrc: "/images/Banner/plombier1.jpg",
      secondServicesH2: "Votre Expert Local",
      secondServicesH3: "Disponibilité et sécurité",
      secondServicesText: `Nos plombiers expérimentés à ${city} sont disponibles pour répondre à vos
      urgences 24 heures sur 24, 7 jours sur 7. Nous comprenons l'importance d'une intervention rapide
      lorsque survient un problème de plomberie, et nous nous engageons à vous offrir un service réactif
      et professionnel à chaque visite.
      En tant que membres de la communauté de ${city}, nous sommes fiers de fournir des services personnalisés
      qui répondent aux besoins spécifiques de nos clients locaux. Que vous soyez un particulier, un
      gestionnaire immobilier ou un commerçant, nous adaptons nos services pour vous assurer une
      satisfaction maximale.`,
      secondServicesImgSrc: "/images/Banner/plombier2.jpg",
      ctaBannerH3: corporateName,
      ctaBannerH4: `Choisissez l'excellence avec ${corporateName}`,
      faq: {
        h2: "Questions fréquemment posées",
        description: `Trouvez des réponses aux questions fréquemment posées sur nos services de plomberie à ${city}. Si vous avez d'autres questions, n'hésitez pas à nous contacter.`,
        questions: [
          {
            question: `Quels sont les services que vous proposez à ${city} et ses environs ?`,
            answer: `Nous offrons une gamme complète de services de plomberie à ${city}, adaptés à vos besoins : <ul> <li>Réparation de fuites et dépannage d'urgence.</li> <li>Installation et rénovation de systèmes de plomberie.</li> <li>Entretien préventif et diagnostic de vos installations.</li> <li>Installation et réparation de chauffe-eaux et sanitaires.</li> </ul>`,
          },
          {
            question:
              "Comment puis-je demander une intervention de plomberie ?",
            answer: `Pour planifier une intervention de plomberie à ${city}, contactez-nous au <strong><a href="tel:${phoneNumberParsed}">${phoneNumberParsed}</a></strong> ou remplissez notre formulaire de contact en ligne.`,
          },
          {
            question: `Quelles sont vos disponibilités pour les urgences de plomberie à ${city} ?`,
            answer: `Nous sommes disponibles 24 heures sur 24 et 7 jours sur 7 pour les urgences de plomberie à ${city}. Contactez-nous immédiatement pour une intervention rapide.`,
          },
          {
            question: `Proposez-vous des devis gratuits pour les travaux de plomberie à ${city} ?`,
            answer: `Oui, nous offrons des devis gratuits pour tous les travaux de plomberie à ${city}. Contactez-nous pour obtenir une estimation précise adaptée à vos besoins.`,
          },
          {
            question:
              "Quels modes de paiement acceptez-vous pour vos services de plomberie ?",
            answer: `Nous acceptons les paiements par carte bancaire ainsi que les paiements en espèces pour nos services de plomberie à ${city}.`,
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
