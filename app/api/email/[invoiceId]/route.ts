import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Paul Obidinma",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "oziomaobidinma3@gmail.com" }],
      template_uuid: "c6e28a86-6cb9-4945-b85e-291e9550b87a",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "InvoiceMarshal",
        company_info_address: "Chad street 124",
        company_info_city: "Abuja",
        company_info_zip_code: "345345",
        company_info_country: "Nigeria",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}
