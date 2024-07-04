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
