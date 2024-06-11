"use client";

// import { Post } from "@prisma/client";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { Tweet } from "react-tweet";
import BlurImage from "@/components/blur-image";
import styles from "./mdx.module.css";

// export default function MDX({ source }: { source: MDXRemoteProps }) {
//   const components = {
//     a: replaceLinks,
//     BlurImage,
//     Examples,
//     Tweet,
//   };

//   return (
//     <article
//       className={`prose-md prose prose-stone m-auto w-11/12 dark:prose-invert sm:prose-lg sm:w-3/4 ${styles.root}`}
//       suppressHydrationWarning={true}
//     >
//       {/* @ts-ignore */}
//       <MDXRemote {...source} components={components} />
//     </article>
//   );
// }

// interface ExampleCardProps
//   extends Pick<Post, "description" | "image" | "imageBlurhash"> {
//   name: string | null;
//   url: string | null;
// }

// function Examples({ data }: { data: string }) {
//   if (!data) return null;
//   const parsedData = JSON.parse(data) as Array<ExampleCardProps>;
//   return (
//     <div className="not-prose my-10 grid grid-cols-1 gap-x-4 gap-y-4 lg:-mx-36 lg:mb-20 lg:grid-cols-3 lg:gap-y-8">
//       {parsedData.map((d) => (
//         <ExamplesCard data={d} key={d.name} />
//       ))}
//     </div>
//   );
// }

function ExamplesCard({ data }: any) {
  return "ok";
}
