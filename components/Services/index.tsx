"use client";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";

const Services = () => {
  return (
    <section className="relative" id="services">
      <div className="mx-auto max-w-7xl lg:pt-16 sm:pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 my-8 gap-10">
          <div className="col-span-6 flex justify-start">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <Image
                src="/images/Banner/VTC.png"
                alt="car image"
                title="car image"
                width={636}
                height={808}
              />
            </Fade>
          </div>

          <div className="col-span-6 flex flex-col justify-center">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h2 className="text-pink text-lg font-normal mb-3 ls-51 uppercase text-start">
                Un service personnalisé
              </h2>
            </Fade>
            <Fade
              direction={"up"}
              delay={400}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h3 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black text-start">
                Tranquillité totale
              </h3>
            </Fade>
            <Fade
              direction={"up"}
              delay={500}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <p className="text-grey md:text-lg font-normal mb-6 text-start mt-2">
                Nous croyons fermement que chaque trajet doit être une
                expérience agréable, confortable et sans souci. Nous comprenons
                que vos déplacements, qu'ils soient personnels ou
                professionnels, doivent se dérouler dans les meilleures
                conditions possibles pour vous offrir une tranquillité d'esprit
                totale. C'est pourquoi nous mettons un point d'honneur à offrir
                un service de transport de qualité supérieure à Dreux et dans
                ses environs.
              </p>
            </Fade>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl lg:pt-16 sm:pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 my-8 gap-4">
          <div className="col-span-6 flex flex-col justify-center">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h2 className="text-lightgrey text-pink text-lg font-normal mb-3 ls-51 uppercase text-start">
                Un service haut de gamme
              </h2>
            </Fade>
            <Fade
              direction={"up"}
              delay={400}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <h3 className="text-lightgrey text-3xl lg:text-5xl font-semibold text-black text-start">
                Confort et sécurité
              </h3>
            </Fade>
            <Fade
              direction={"up"}
              delay={500}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <p className="text-grey md:text-lg font-normal mb-6 text-start mt-2">
                Nous mettons un point d'honneur à assurer votre confort et votre
                sécurité à chaque trajet. Nos véhicules haut de gamme sont
                soigneusement entretenus pour vous offrir une expérience de
                voyage agréable et sans souci. Avec des sièges spacieux, une
                climatisation ajustable et une propreté impeccable, chaque
                kilomètre parcouru avec nous est synonyme de détente et de
                tranquillité d'esprit. Faites confiance à nos chauffeurs
                professionnels pour vous conduire en toute sécurité vers votre
                destination, quel que soit le trajet à Dreux et ses environs.
              </p>
            </Fade>
          </div>

          <div className="col-span-6 flex justify-start">
            <Fade
              direction={"up"}
              delay={200}
              cascade
              damping={1e-1}
              triggerOnce={true}
            >
              <Image
                src="/images/Banner/vtc-img.jpg"
                alt="car image"
                title="car image"
                width={636}
                height={808}
              />
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
