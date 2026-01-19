import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { OrderStatusControls } from "./OrderStatusControls";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "in_production"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

type PaymentStatus = "pending" | "approved" | "rejected" | "refunded" | null;

interface OrderDetail {
  id: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  delivery_zone: string | null;
  delivery_fee: number;
  product_name: string;
  product_flavor: string;
  size_key: string;
  base_price: number;
  message_on_cake: string | null;
  is_gift: boolean;
  gift_from: string | null;
  gift_message: string | null;
  notes: string | null;
  subtotal: number;
  total: number;
  payment_provider: string | null;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  // por ahora no usamos relaciones, las dejamos opcionales
  order_items?: any[];
  order_status_history?: any[];
}

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatDateOnly(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-CL");
}

function formatMoney(value: number) {
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "awaiting_payment":
      return "Esperando pago";
    case "paid":
      return "Pagado";
    case "in_production":
      return "En producción";
    case "ready":
      return "Lista";
    case "out_for_delivery":
      return "En reparto";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

function getStatusBadgeClass(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "awaiting_payment":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-emerald-100 text-emerald-800";
    case "in_production":
      return "bg-blue-100 text-blue-800";
    case "ready":
      return "bg-indigo-100 text-indigo-800";
    case "out_for_delivery":
      return "bg-sky-100 text-sky-800";
    case "completed":
      return "bg-emerald-200 text-emerald-900";
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-800";
  }
}

function getPaymentBadgeClass(status: PaymentStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "rejected":
      return "bg-rose-100 text-rose-800";
    case "refunded":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function getPaymentLabel(status: PaymentStatus) {
  switch (status) {
    case "approved":
      return "Aprobado";
    case "pending":
      return "Pendiente";
    case "rejected":
      return "Rechazado";
    case "refunded":
      return "Reembolsado";
    default:
      return "Sin pago";
  }
}

function pickupLabel(location: string) {
  switch (location) {
    case "centro":
      return "Local Centro";
    case "bonilla":
      return "Local Bonilla";
    case "sur":
      return "Local Sur";
    case "delivery":
      return "Delivery";
    default:
      return location;
  }
}

function deliveryZoneLabel(zone: string | null) {
  if (!zone) return "";
  switch (zone) {
    case "sur-allende":
      return "Sector sur → Salvador Allende (+$3.000)";
    case "allende-nicolas":
      return "Salvador Allende → Nicolás Tirado (+$5.000)";
    case "nicolas-costa":
      return "Nicolás Tirado → Costa Laguna (+$8.000)";
    default:
      return zone;
  }
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 👇 aquí esperamos la Promise
  const { id } = await params;

  console.log("AdminOrderDetailPage id:", id);

  // 🛑 Si no hay id o es "undefined", no vamos a Supabase
  if (!id || id === "undefined") {
    console.error("ID de pedido inválido en la ruta:", id);
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/api/admin/orders"
            className="inline-flex items-center text-xs mb-4 text-stone-600 hover:text-stone-900"
          >
            ← Volver a pedidos
          </Link>
          <h1 className="text-2xl font-semibold text-stone-900 mb-2">
            ID de pedido inválido
          </h1>
          <p className="text-sm text-stone-600">
            La URL no contiene un ID de pedido válido. Verifica el enlace o copia
            el ID completo desde el listado de pedidos.
          </p>
        </div>
      </main>
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();


  if (error || !data) {
    console.error("Error cargando detalle de pedido:", error);
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-xs mb-4 text-stone-600 hover:text-stone-900"
          >
            ← Volver a pedidos
          </Link>
          <h1 className="text-2xl font-semibold text-stone-900 mb-2">
            Pedido no encontrado
          </h1>
          <p className="text-sm text-stone-600">
            Ocurrió un error al cargar el pedido o no existe el ID indicado.
          </p>
        </div>
      </main>
    );
  }

  const order = data as OrderDetail;
  const isDelivery = order.pickup_location === "delivery";

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-xs mb-4 text-stone-600 hover:text-stone-900"
        >
          ← Volver a pedidos
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">
              Pedido #{order.id.slice(0, 8)}…
            </h1>
            <p className="text-sm text-stone-600">
              Creado el {formatDate(order.created_at)}
            </p>
            <p className="text-[11px] text-stone-400">
              ID completo: {order.id}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium " +
                getStatusBadgeClass(order.status)
              }
            >
              Estado: {getStatusLabel(order.status)}
            </span>
            <span
              className={
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium " +
                getPaymentBadgeClass(order.payment_status)
              }
            >
              Pago: {getPaymentLabel(order.payment_status)}
            </span>

            {/* 👇 Aquí los botones de acción */}
            <OrderStatusControls
              orderId={order.id}
              currentStatus={order.status as any}
            />
          </div>
        </header>


        {/* Dos columnas: izquierda info principal, derecha retiro/pago */}
        <div className="grid gap-5 md:grid-cols-[1.1fr,0.9fr]">
          {/* Izquierda */}
          <div className="space-y-4">
            {/* Cliente */}
            <section className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-900 mb-2">
                Datos del cliente
              </h2>
              <dl className="space-y-1 text-xs text-stone-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Nombre</dt>
                  <dd className="font-medium">{order.customer_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Correo</dt>
                  <dd className="font-medium break-all">
                    {order.customer_email}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Teléfono</dt>
                  <dd className="font-medium">{order.customer_phone}</dd>
                </div>
              </dl>
            </section>

            {/* Pedido / torta */}
            <section className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-900 mb-2">
                Detalle del pedido
              </h2>

              <div className="mb-3">
                <p className="text-xs font-semibold text-stone-900">
                  {order.product_name}
                </p>
                <p className="text-[11px] text-stone-500">
                  {order.product_flavor}
                </p>
                <p className="text-[11px] text-stone-500">
                  Tamaño: {order.size_key} porciones
                </p>
              </div>

              <div className="border-t border-stone-100 pt-2 mt-2 space-y-1 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span>Subtotal torta</span>
                  <span>{formatMoney(order.subtotal)}</span>
                </div>
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{formatMoney(order.delivery_fee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-1 border-t border-dashed border-stone-200 mt-1">
                  <span>Total</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
              </div>
            </section>

            {/* Mensajes / regalo / notas */}
            <section className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-900 mb-2">
                Mensajes y notas
              </h2>

              <div className="space-y-3 text-xs text-stone-700">
                <div>
                  <p className="text-[11px] text-stone-500 mb-1">
                    Mensaje en la torta
                  </p>
                  <p className="font-medium">
                    {order.message_on_cake || (
                      <span className="text-stone-400">Sin mensaje</span>
                    )}
                  </p>
                </div>

                <div className="border-t border-stone-100 pt-2">
                  <p className="text-[11px] text-stone-500 mb-1">
                    ¿Es un regalo?
                  </p>
                  {order.is_gift ? (
                    <div className="space-y-1">
                      <p className="font-medium">Sí, es un regalo</p>
                      {order.gift_from && (
                        <p>
                          <span className="text-stone-500">De parte de: </span>
                          <span className="font-medium">
                            {order.gift_from}
                          </span>
                        </p>
                      )}
                      {order.gift_message && (
                        <p>
                          <span className="text-stone-500">Mensaje: </span>
                          <span className="font-medium">
                            {order.gift_message}
                          </span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-stone-500">No es regalo.</p>
                  )}
                </div>

                <div className="border-t border-stone-100 pt-2">
                  <p className="text-[11px] text-stone-500 mb-1">
                    Comentarios adicionales
                  </p>
                  <p className="font-medium whitespace-pre-wrap">
                    {order.notes || (
                      <span className="text-stone-400">Sin comentarios</span>
                    )}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Derecha: retiro/delivery + pago */}
          <div className="space-y-4">
            <section className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-900 mb-2">
                Retiro / entrega
              </h2>
              <dl className="space-y-1 text-xs text-stone-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Tipo</dt>
                  <dd className="font-medium">
                    {pickupLabel(order.pickup_location)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Fecha de retiro</dt>
                  <dd className="font-medium">
                    {formatDateOnly(order.pickup_date)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Hora aprox.</dt>
                  <dd className="font-medium">{order.pickup_time}</dd>
                </div>

                {isDelivery && (
                  <>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Zona</dt>
                      <dd className="font-medium">
                        {deliveryZoneLabel(order.delivery_zone)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Costo delivery</dt>
                      <dd className="font-medium">
                        {formatMoney(order.delivery_fee)}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </section>

            <section className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-900 mb-2">
                Pago
              </h2>
              <dl className="space-y-1 text-xs text-stone-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Estado de pago</dt>
                  <dd>
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                        getPaymentBadgeClass(order.payment_status)
                      }
                    >
                      {getPaymentLabel(order.payment_status)}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Proveedor</dt>
                  <dd className="font-medium">
                    {order.payment_provider || "No definido"}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-stone-500">Referencia</dt>
                  <dd className="font-medium text-[11px] break-all">
                    {order.payment_reference || (
                      <span className="text-stone-400">Sin referencia</span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
