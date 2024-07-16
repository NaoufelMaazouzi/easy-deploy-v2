// "use client";
// import { getSiteById } from "@/lib/serverActions/sitesActions";
// import { useEffect, useState } from "react";

// const SiteSettingsAppearance = async ({
//   params,
// }: {
//   params: { id: string };
// }) => {
//   const [siteData, setSiteData] = useState<any>(null);
//   //   const iframeRef = useRef<HTMLIFrameElement>(null);

//   useEffect(() => {
//     const fetchSiteData = async () => {
//       const data = await getSiteById(params.id);
//       setSiteData(data);
//     };

//     fetchSiteData();
//   }, [params.id]);
//   useEffect(() => {
//     function handleMessage(event: any) {
//       console.log("gGGGGGGG");
//       if (event.data.type === "imageClick") {
//         alert(`Image clicked: ${event.data.src}`);
//         // Here you can implement your popup logic instead of alert
//       }
//     }

//     window.addEventListener("message", handleMessage);

//     return () => {
//       window.removeEventListener("message", handleMessage);
//     };
//   }, []);

//   if (!siteData) {
//     return <div>Loading...</div>;
//   }

//   const src = `https://${siteData.subdomain ? `${siteData.subdomain}.` : ""}${siteData.customDomain ? `${siteData.customDomain}` : `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;
//   return (
//     <div
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: "4px",
//         overflow: "hidden",
//       }}
//     >
//       <iframe src={src} style={{ width: "100%", height: "700px" }} />
//     </div>
//   );
// };

// export default SiteSettingsAppearance;

// import React, { useState, useRef, useEffect } from "react";
// import { getSiteById } from "@/lib/serverActions/sitesActions";

// const SiteSettingsAppearance = ({ params }: { params: { id: string } }) => {
//   const [siteData, setSiteData] = useState<any>(null);
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   useEffect(() => {
//     const fetchSiteData = async () => {
//       const data = await getSiteById(params.id);
//       setSiteData(data);
//     };

//     fetchSiteData();
//   }, [params.id]);

//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       console.log("MESSAGEEEEE");
//       if (event.origin !== window.location.origin) return;

//       const { type, id, src, content } = event.data;
//       if (type === "image") {
//         console.log("Image URL updated:", id, src);
//         // Save to server
//       } else if (type === "text") {
//         console.log("Text content updated:", id, content);
//         // Save to server
//       }
//     };

//     window.addEventListener("message", handleMessage);

//     return () => {
//       window.removeEventListener("message", handleMessage);
//     };
//   }, []);

//   const sendMessageToIframe = (message: any) => {
//     console.log("OOOOO", iframeRef.current?.contentWindow);
//     iframeRef.current?.contentWindow?.postMessage(
//       message,
//       window.location.origin
//     );
//   };

//   useEffect(() => {
//     if (siteData) {
//       sendMessageToIframe({ type: "INIT" });
//     }
//   }, [siteData]);

//   if (!siteData) {
//     return <div>Loading...</div>;
//   }

//   const src = `https://${siteData.subdomain ? `${siteData.subdomain}.` : ""}${siteData.customDomain ? `${siteData.customDomain}` : `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}/peinture-dreux`;

//   return (
//     <div
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: "4px",
//         overflow: "hidden",
//       }}
//     >
//       <iframe
//         ref={iframeRef}
//         src={src}
//         style={{ width: "100%", height: "700px" }}
//       />
//     </div>
//   );
// };

// export default SiteSettingsAppearance;

import { getSiteById } from "@/lib/serverActions/sitesActions";

export default async function SiteSettingsAppearance({
  params,
}: {
  params: { id: string };
}) {
  const siteData = await getSiteById(params.id);
  const src = `https://${siteData.subdomain ? `${siteData.subdomain}.` : ""}${siteData.customDomain ? `${siteData.customDomain}` : `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <iframe src={src} style={{ width: "100%", height: "700px" }} />
    </div>
  );
}
