import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // TODO: Validaciones básicas (campos requeridos)
    // TODO: Guardar en base de datos o en Google Sheet / Notion
    // TODO: Crear preferencia de pago en MercadoPago
    // TODO: Enviar correo de confirmación (Resend, SendGrid, etc.)

    console.log("Nuevo pedido de torta:", body);

    // Aquí más adelante podrías devolver, por ejemplo, la URL de pago:
    // const mpUrl = crearPreferenciaMercadoPago(body);
    // return NextResponse.json({ ok: true, paymentUrl: mpUrl });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar el pedido" },
      { status: 500 }
    );
  }
}
