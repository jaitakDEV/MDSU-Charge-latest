// import QRCode from "qrcode";

// export async function generateQRCodeBase64(
//   ticketCode: string,
// ): Promise<string> {
//   const url = `${process.env.NEXT_PUBLIC_APP_URL}/events/verify/${ticketCode}`;

//   const dataUrl = await QRCode.toDataURL(url, {
//     width: 280,
//     margin: 2,
//     color: {
//       dark: "#0f172a",
//       light: "#ffffff",
//     },
//   });

//   return dataUrl;
// }

// export async function generateQRCodeSVG(ticketCode: string): Promise<string> {
//   const url = `${process.env.NEXT_PUBLIC_APP_URL}/events/verify/${ticketCode}`;
//   return QRCode.toString(url, { type: "svg", width: 200, margin: 2 });
// }

// src/lib/qr-utils.ts
import QRCode from "qrcode";

/**
 * ticketCode se QR PNG base64 generate karo
 * Email mein embed karne ke liye use hoga (fallback, ab primarily uploadQRCode use hoga)
 */
export async function generateQRCodeBase64(
  ticketCode: string,
): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/events/verify/${ticketCode}`;

  const dataUrl = await QRCode.toDataURL(url, {
    width: 280,
    margin: 2,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });

  return dataUrl;
}

/**
 * Admin check-in page pe QR display ke liye SVG string
 */
export async function generateQRCodeSVG(ticketCode: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/events/verify/${ticketCode}`;
  return QRCode.toString(url, { type: "svg", width: 200, margin: 2 });
}

/**
 * QR code ko PNG Buffer mein generate karo — UploadThing upload ke liye
 */
export async function generateQRCodeBuffer(
  ticketCode: string,
): Promise<Buffer> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/events/verify/${ticketCode}`;

  return QRCode.toBuffer(url, {
    width: 280,
    margin: 2,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
}
