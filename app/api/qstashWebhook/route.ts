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

    console.log("Content:", content);

    return NextResponse.json({
      message: "Data processed successfully",
      content,
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
