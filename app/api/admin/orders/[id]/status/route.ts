import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

type OrderStatus =
  | "pending"
  | "in_production"
  | "ready"
  | "completed"
  | "cancelled";

const ALLOWED_STATUSES: OrderStatus[] = [
  "pending",
  "in_production",
  "ready",
  "completed",
  "cancelled",
];

export async function POST(
  req: Request,
  // 👇 en tu Next, params viene como Promise, así que lo tipamos así
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Configuración de Supabase incompleta en el servidor. Revisa variables de entorno.",
        },
        { status: 500 }
      );
    }

    // 👇 aquí esperamos los params
    const { id } = await context.params;

    console.log("API status, id recibido:", id);

    const body = await req.json();
    const newStatus = body?.newStatus as OrderStatus | undefined;
    const note = (body?.note as string | undefined) || null;
    const changedBy =
      (body?.changedBy as string | undefined) || "Panel admin Resseta";

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Falta el ID del pedido en la ruta." },
        { status: 400 }
      );
    }

    if (!newStatus || !ALLOWED_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { ok: false, error: "Estado de pedido no válido." },
        { status: 400 }
      );
    }

    // 1) Obtener pedido actual
    const { data: currentOrder, error: getError } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (getError || !currentOrder) {
      console.error("No se encontró pedido para actualizar estado:", getError);
      return NextResponse.json(
        {
          ok: false,
          error: "No se encontró el pedido para actualizar el estado.",
        },
        { status: 404 }
      );
    }

    const fromStatus = currentOrder.status as OrderStatus;

    if (fromStatus === newStatus) {
      return NextResponse.json({
        ok: true,
        message: "El pedido ya está en este estado.",
      });
    }

    // 2) Actualizar estado
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateError) {
      console.error("Error actualizando estado de pedido:", updateError);
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo actualizar el estado del pedido.",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    // 3) Historial
    const { error: historyError } = await supabaseAdmin
      .from("order_status_history")
      .insert({
        order_id: id,
        from_status: fromStatus,
        to_status: newStatus,
        note,
        changed_by: changedBy,
      });

    if (historyError) {
      console.error(
        "Error insertando en order_status_history:",
        historyError
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error en /api/admin/orders/[id]/status:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Error inesperado al actualizar el estado del pedido.",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
