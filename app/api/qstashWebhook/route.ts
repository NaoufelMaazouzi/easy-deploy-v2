import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const decodeBase64 = (base64: string) => {
  const buffer = Buffer.from(base64, "base64");
  return buffer.toString("utf-8");
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const decodedBody = JSON.parse(decodeBase64(body.body));
    const content = decodedBody.choices[0].message.content;
    console.log("CONTENNNNT", content, typeof content);
    if (content) {
      const parsedObj = JSON.parse(content);
      console.log("parsedObjjjjjjj", parsedObj);
      const { service, content: generatedContent } = parsedObj;
      const supabase = createClient();
      console.log("UUUUUUUUUUUUUUU", service, generatedContent);
      const { data, error } = await supabase
        .from("pages")
        .update({ content: generatedContent, contentGenerated: true })
        .eq("service", service)
        .eq("contentGenerated", false)
        .select();
      console.log("OKKKKKKKKKK", data, error);
      if (error) {
        return NextResponse.json(
          { message: "Error updating pages Qstash webhook", error },
          { status: 500 }
        );
      }
      return NextResponse.json({
        message: "Data processed successfully",
        content,
      });
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
