import { isObjectWithProperty } from "@/lib/utils";

export default function MentionsLegales({
  domain,
  siteData,
}: {
  domain: string;
  siteData: SitesWithoutUsers | null;
}) {
  if (siteData) {
    const {
      contactMail,
      contactPhone,
      corporateName,
      mainActivityCity,
      corporateStatus,
    } = siteData;
    let adress;
    if (isObjectWithProperty(mainActivityCity, "name")) {
      adress = mainActivityCity.name;
    }
    return (
      <div className="p-6 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Nos mentions Légales</h1>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            1. Informations légales
          </h2>
          <p>
            Statut du propriétaire : {corporateStatus} <br />
            Propriétaire : {corporateName} <br />
            Adresse : {adress}
            <br />
            Tél : {contactPhone} <br />
            Adresse électronique : {contactMail}
          </p>
          <p>
            Le Créateur du site est : Easy-deploy <br />
            Le Responsable de la publication est : Easy-deploy <br />
            Contactez le responsable de la publication : {contactMail} <br />
            Le responsable de la publication est une personne physique.
          </p>
          <p>
            L’hébergeur du site est : GoDaddy <br />
            Adresse de l’hébergeur : 2155 E. GoDaddy Way Tempe, AZ 85284 USA{" "}
            <br />
            Tél : 09 75 18 70 39
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            2. Description des services fournis
          </h2>
          <p>
            Le présent site a pour objet de fournir une information concernant
            l’ensemble des activités de la société. Le propriétaire du site
            s’efforce de fournir sur le présent site des informations aussi
            précises que possible. Toutefois, il ne pourra être tenu responsable
            des oublis, des inexactitudes et des carences dans la mise à jour,
            qu’elles soient de son fait ou du fait des tiers partenaires qui lui
            fournissent ces informations.
          </p>
          <p>
            Toutes les informations proposées sur le présent site sont données à
            titre indicatif, sont non exhaustives, et sont susceptibles
            d’évoluer. Elles sont données sous réserve de modifications ayant
            été apportées depuis leur mise en ligne.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            3. Propriété intellectuelle et contrefaçons
          </h2>
          <p>
            Le propriétaire du site est propriétaire des droits de propriété
            intellectuelle ou détient les droits d’usage sur tous les éléments
            accessibles sur le site, notamment les textes, images, graphismes,
            logo, icônes, sons, logiciels…
          </p>
          <p>
            Toute reproduction, représentation, modification, publication,
            adaptation de tout ou partie des éléments du site, quel que soit le
            moyen ou le procédé utilisé, est interdite, sauf autorisation écrite
            préalable à l'adresse e-mail : {contactMail}.
          </p>
          <p>
            Toute exploitation non autorisée du site ou de l’un quelconque des
            éléments qu’il contient sera considérée comme constitutive d’une
            contrefaçon et poursuivie conformément aux dispositions des articles
            L.335-2 et suivants du Code de Propriété Intellectuelle.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            4. Liens hypertextes et cookies
          </h2>
          <p>
            Le présent site contient un certain nombre de liens hypertextes vers
            d’autres sites (partenaires, informations …) mis en place avec
            l’autorisation du propriétaire du site. Cependant, le propriétaire
            du site n’a pas la possibilité de vérifier le contenu des sites
            ainsi visités et décline donc toute responsabilité de ce fait quant
            aux risques éventuels de contenus illicites.
          </p>
          <p>
            L’utilisateur est informé que lors de ses visites sur le site{" "}
            {domain}, un ou des cookies sont susceptibles de s’installer
            automatiquement sur son ordinateur. Un cookie est un fichier de
            petite taille, qui ne permet pas l’identification de l’utilisateur,
            mais qui enregistre des informations relatives à la navigation d’un
            ordinateur sur un site. Les données ainsi obtenues visent à
            faciliter la navigation ultérieure sur le site, et ont également
            vocation à permettre diverses mesures de fréquentation.
          </p>
          <p>
            Le paramétrage du logiciel de navigation permet d’informer de la
            présence de cookie et éventuellement, de les refuser de la manière
            décrite à l’adresse suivante : www.cnil.fr
          </p>
          <p>
            Le refus d’installation d’un cookie peut entraîner l’impossibilité
            d’accéder à certains services. L’utilisateur peut toutefois
            configurer son ordinateur de la manière suivante, pour refuser
            l’installation des cookies :
          </p>
          <ul className="list-disc ml-6">
            <li>
              Sous Internet Explorer : onglet outil / options internet. Cliquez
              sur Confidentialité et choisissez Bloquer tous les cookies.
              Validez sur Ok.
            </li>
            <li>
              Sous Netscape : onglet édition / préférences. Cliquez sur Avancées
              et choisissez Désactiver les cookies. Validez sur Ok.
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            5. Protection des biens et des personnes - gestion des données
            personnelles
          </h2>
          <p>
            Utilisateur : Internaute se connectant, utilisant le site susnommé :
            {domain} En France, les données personnelles sont notamment
            protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801
            du 6 août 2004, l'article L. 226-13 du Code pénal et la Directive
            Européenne du 24 octobre 1995.
          </p>
          <p>
            Sur le présent site, le propriétaire du site ne collecte des
            informations personnelles relatives à l'utilisateur que pour le
            besoin de certains services proposés par le présent site.
            L'utilisateur fournit ces informations en toute connaissance de
            cause, notamment lorsqu'il procède par lui-même à leur saisie. Il
            est alors précisé à l'utilisateur du présent site l’obligation ou
            non de fournir ces informations.
          </p>
          <p>
            Conformément aux dispositions des articles 38 et suivants de la loi
            78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et
            aux libertés, tout utilisateur dispose d’un droit d’accès, de
            rectification, de suppression et d’opposition aux données
            personnelles le concernant. Pour l’exercer, adressez votre demande à{" "}
            {domain}
            par email : {contactMail} ou en effectuant sa demande écrite et
            signée, accompagnée d’une copie du titre d’identité avec signature
            du titulaire de la pièce, en précisant l’adresse à laquelle la
            réponse doit être envoyée.
          </p>
          <p>
            Aucune information personnelle de l'utilisateur du présent site
            n'est publiée à l'insu de l'utilisateur, échangée, transférée, cédée
            ou vendue sur un support quelconque à des tiers. Seule l'hypothèse
            du rachat du présent site au propriétaire du site et de ses droits
            permettrait la transmission des dites informations à l'éventuel
            acquéreur qui serait à son tour tenu de la même obligation de
            conservation et de modification des données vis-à-vis de
            l'utilisateur du présent site.
          </p>
          <p>
            Le site n'est pas déclaré à la CNIL car il ne recueille pas
            d'informations personnelles.
          </p>
          <p>
            Les bases de données sont protégées par les dispositions de la loi
            du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996
            relative à la protection juridique des bases de données.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Crédits</h2>
          <p>{domain}</p>
        </section>
      </div>
    );
  }
}
