import { UTApi } from "uploadthing/server";
import { generateQRCodeBuffer } from "@/lib/qr-utils";

const utapi = new UTApi();

export async function uploadQRCode(ticketCode: string): Promise<string | null> {
  try {
    const buffer = await generateQRCodeBuffer(ticketCode);
    const uint8Array = new Uint8Array(buffer);
    const file = new File([uint8Array], `qr-${ticketCode}.png`, {
      type: "image/png",
    });

    const uploaded = await utapi.uploadFiles(file);

    if (!uploaded.data?.url) {
      console.error("[QR_UPLOAD] No URL in response", uploaded);
      return null;
    }

    return uploaded.data.url;
  } catch (error) {
    console.error("[QR_UPLOAD_FAILED]", error);
    return null; // never throw — caller handles gracefully
  }
}
