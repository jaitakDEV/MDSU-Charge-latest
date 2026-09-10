import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyPaymentSignature } from "@/lib/razorpay-utils";
import { apiError, apiSuccess } from "@/lib/utils";
import { generateQRCodeBase64 } from "@/lib/qr-utils";
import { sendPaidEventTicketEmail } from "@/server/email";
import { uploadQRCode } from "@/lib/qr-upload";
import { z } from "zod";

const schema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      parsed.data;

    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json(apiError("Invalid payment signature."), {
        status: 400,
      });
    }

    // ── Fetch registration ─────────────────────────────────────
    const registration = await db.eventRegistration.findUnique({
      where: { razorpayOrderId },
      select: {
        id: true,
        status: true,
        eventId: true,
        amountPaid: true,
        userId: true,
        guestName: true,
        guestEmail: true,
        guestPhone: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!registration) {
      return NextResponse.json(apiError("Registration not found."), {
        status: 404,
      });
    }

    // ── Idempotency check ──────────────────────────────────────
    if (registration.status === "CONFIRMED") {
      return NextResponse.json(
        apiSuccess({ alreadyConfirmed: true, registrationId: registration.id }),
      );
    }

    if (registration.status !== "PENDING") {
      return NextResponse.json(
        apiError("This registration cannot be confirmed."),
        { status: 400 },
      );
    }

    // ── Fetch event details for email ─────────────────────────
    const event = await db.event.findUnique({
      where: { id: registration.eventId },
      select: {
        title: true,
        slug: true,
        startDate: true,
        endDate: true,
        mode: true,
        venue: true,
        joinLink: true,
        refundPolicy: true,
        cancellationDeadline: true,
      },
    });

    if (!event) {
      return NextResponse.json(apiError("Event not found."), { status: 404 });
    }

    // ── Confirm registration + increment count (transaction) ──
    await db.$transaction(async (tx) => {
      await tx.eventRegistration.update({
        where: { id: registration.id },
        data: {
          status: "CONFIRMED",
          razorpayPaymentId,
          razorpaySignature,
        },
      });

      await tx.event.update({
        where: { id: registration.eventId },
        data: { registeredCount: { increment: 1 } },
      });
    });

    // ── QR code + ticket email ────────────────────────────────
    const registrantName =
      registration.user?.name ?? registration.guestName ?? "Attendee";
    const registrantEmail = registration.user?.email ?? registration.guestEmail;

    // if (registrantEmail) {
    //   try {
    //     const qrCodeBase64 = await generateQRCodeBase64(
    //       // re-fetch ticketCode since it's auto-generated
    //       (await db.eventRegistration.findUnique({
    //         where: { id: registration.id },
    //         select: { ticketCode: true },
    //       }))!.ticketCode,
    //     );

    //     const ticketCode = (await db.eventRegistration.findUnique({
    //       where: { id: registration.id },
    //       select: { ticketCode: true },
    //     }))!.ticketCode;

    //     await sendPaidEventTicketEmail({
    //       email: registrantEmail,
    //       name: registrantName,
    //       eventTitle: event.title,
    //       eventSlug: event.slug,
    //       startDate: event.startDate,
    //       endDate: event.endDate,
    //       mode: event.mode,
    //       venue: event.venue,
    //       ticketCode,
    //       qrCodeBase64,
    //       amountPaid: registration.amountPaid ?? 0,
    //       razorpayPaymentId,
    //       refundPolicy: event.refundPolicy,
    //       cancellationDeadline: event.cancellationDeadline,
    //     });
    //   } catch (emailError) {
    //     console.error("[TICKET_EMAIL_FAILED]", emailError);
    //   }
    // }

    // if (registrantEmail) {
    //   try {
    //     const freshReg = await db.eventRegistration.findUnique({
    //       where: { id: registration.id },
    //       select: { ticketCode: true },
    //     });
    //     const ticketCode = freshReg!.ticketCode;

    //     const qrCodeBase64 = await generateQRCodeBase64(ticketCode);

    //     await sendPaidEventTicketEmail({
    //       email: registrantEmail,
    //       name: registrantName,
    //       eventTitle: event.title,
    //       eventSlug: event.slug,
    //       startDate: event.startDate,
    //       endDate: event.endDate,
    //       mode: event.mode,
    //       venue: event.venue,
    //       ticketCode,
    //       qrCodeBase64,
    //       amountPaid: registration.amountPaid ?? 0,
    //       razorpayPaymentId,
    //       refundPolicy: event.refundPolicy,
    //       cancellationDeadline: event.cancellationDeadline,
    //     });
    //   } catch (emailError) {
    //     console.error("[TICKET_EMAIL_FAILED]", emailError);
    //   }
    // }
    if (registrantEmail) {
      try {
        const freshReg = await db.eventRegistration.findUnique({
          where: { id: registration.id },
          select: { ticketCode: true },
        });
        const ticketCode = freshReg!.ticketCode;
        const qrCodeUrl = await uploadQRCode(ticketCode); // null ho sakta hai — crash nahi karega

        await sendPaidEventTicketEmail({
          email: registrantEmail,
          name: registrantName,
          eventTitle: event.title,
          eventSlug: event.slug,
          startDate: event.startDate,
          endDate: event.endDate,
          mode: event.mode,
          venue: event.venue,
          joinLink: event.joinLink,
          ticketCode,
          qrCodeUrl,
          amountPaid: registration.amountPaid ?? 0,
          razorpayPaymentId,
          refundPolicy: event.refundPolicy,
          cancellationDeadline: event.cancellationDeadline,
        });
      } catch (emailError) {
        console.error("[TICKET_EMAIL_FAILED]", emailError);
        // Payment aur registration already confirm ho chuki hai — email fail hone se koi loss nahi
      }
    }

    return NextResponse.json(
      apiSuccess({
        alreadyConfirmed: false,
        registrationId: registration.id,
        eventSlug: event.slug,
      }),
    );
  } catch (error) {
    console.error("[EVENT_PAYMENT_VERIFY]", error);
    return NextResponse.json(
      apiError("Payment verification failed. Contact support."),
      { status: 500 },
    );
  }
}
