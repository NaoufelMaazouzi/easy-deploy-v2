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
    if (content) {
      const parsedObj = JSON.parse(content);
      const { service, content: generatedContent } = parsedObj;
      const supabase = createClient();
      const { error } = await supabase
        .from("pages")
        .update({ content: generatedContent })
        .eq("service", service.toLowerCase())
        .eq("contentGenerated", false);
      const { data, error: errorRpc } = await supabase.rpc(
        "update_pages_content_with_city"
      );
      console.log("update_pages_content_with_city", data, errorRpc);
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
