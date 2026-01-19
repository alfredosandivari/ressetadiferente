import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Igual que en la API de estados: helper sin throw
function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      "Supabase env missing. NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas."
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

type SizeOption = "10" | "20" | "30";

type OrderPayload = {
  cakeId: string;
  cakeName: string;
  cakeFlavor?: string | null;
  size: SizeOption;
  price: number;
  name: string;
  email: string;
  phone: string;
  pickupLocation: string; // 'centro' | 'bonilla' | 'sur' | 'delivery'
  pickupDate: string; // yyyy-mm-dd
  pickupTime: string; // hh:mm
  deliveryZone?: string | null;
  deliveryFee?: number;
  messageOnCake?: string | null;
  notes?: string | null;
  isGift?: boolean;
  giftFrom?: string | null;
  giftMessage?: string | null;
};

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Configuración de Supabase incompleta. Revisa variables de entorno en el servidor.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as OrderPayload;

    // Validaciones básicas
    if (
      !body.cakeId ||
      !body.cakeName ||
      !body.size ||
      !body.price ||
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.pickupLocation ||
      !body.pickupDate ||
      !body.pickupTime
    ) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos obligatorios en el pedido." },
        { status: 400 }
      );
    }

    const basePrice = body.price;
    const deliveryFee = body.deliveryFee ?? 0;
    const subtotal = basePrice;
    const total = basePrice + deliveryFee;
    const productFlavor = body.cakeFlavor ?? "";

    // 1) Insert en orders
    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: body.name,
        customer_email: body.email,
        customer_phone: body.phone,

        pickup_location: body.pickupLocation,
        pickup_date: body.pickupDate,
        pickup_time: body.pickupTime,
        delivery_zone: body.deliveryZone || null,
        delivery_fee: deliveryFee,

        product_name: body.cakeName,
        product_flavor: productFlavor,
        size_key: body.size,
        base_price: basePrice,

        message_on_cake: body.messageOnCake || null,
        is_gift: body.isGift ?? false,
        gift_from: body.giftFrom || null,
        gift_message: body.giftMessage || null,
        notes: body.notes || null,

        subtotal,
        total,

        status: "pending",
        payment_provider: "MERCADOPAGO",
        payment_status: "pending",
        payment_reference: null,
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error("Error al crear order:", orderError);
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo crear el pedido en la base de datos.",
          details: orderError?.message ?? orderError,
        },
        { status: 500 }
      );
    }

    // 2) Insert en order_items (por ahora 1 torta)
    const { error: itemError } = await supabaseAdmin
      .from("order_items")
      .insert({
        order_id: newOrder.id,
        product_name: body.cakeName,
        size_key: body.size,
        unit_price: basePrice,
        quantity: 1,
        line_total: basePrice,
      });

    if (itemError) {
      console.error("Error al crear order_item:", itemError);
    }

    // 3) Historial inicial
    const { error: historyError } = await supabaseAdmin
      .from("order_status_history")
      .insert({
        order_id: newOrder.id,
        from_status: null,
        to_status: "pending",
        note: "Pedido creado desde landing de tortas",
      });

    if (historyError) {
      console.error("Error al crear order_status_history:", historyError);
    }

    return NextResponse.json({
      ok: true,
      orderId: newOrder.id,
    });
  } catch (error: any) {
    console.error("Error inesperado en /api/orders:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error inesperado al procesar el pedido.",
        details: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
