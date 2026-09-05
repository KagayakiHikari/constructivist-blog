import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getSiteSetting } from "@/lib/site";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const setting = await getSiteSetting();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader siteTitle={setting?.siteTitle ?? "CONSTRUCTIVIST BLOG"} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        siteTitle={setting?.siteTitle ?? "CONSTRUCTIVIST BLOG"}
        ownerName={setting?.ownerName ?? "Anonymous Author"}
      />
    </div>
  );
}
