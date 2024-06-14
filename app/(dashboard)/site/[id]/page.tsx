import CreatePostButton from "@/components/create-post-button";
import Pages from "@/components/pages";

export default async function SitePages({
  params,
}: {
  params: { id: string };
}) {
  // const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="font-cal w-60 truncate text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
            All Pages for
          </h1>
          {/* <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${data.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
          </a> */}
        </div>
        <CreatePostButton />
      </div>
      <Pages siteId={decodeURIComponent(params.id)} />
    </>
  );
}
