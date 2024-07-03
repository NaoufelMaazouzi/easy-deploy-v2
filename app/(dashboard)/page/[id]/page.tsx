import Editor from "@/components/editor";
import { getPageById } from "@/lib/serverActions/pageActions";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getPageById(params.id);
  return <Editor pageData={data} />;
}
