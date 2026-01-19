import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente sólo en el servidor (page.tsx es Server Component)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

interface OrderRow {
  id: string;
  created_at: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  delivery_zone: string | null;
  subtotal: number;
  total: number;
  product_name: string;
  product_flavor: string;
  size_key: string;
  payment_status: PaymentStatus;
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
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

export const dynamic = "force-dynamic"; // para que no se quede cacheado

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      customer_name,
      customer_phone,
      pickup_location,
      pickup_date,
      pickup_time,
      delivery_zone,
      subtotal,
      total,
      product_name,
      product_flavor,
      size_key,
      payment_status
    `
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error cargando pedidos:", error);
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-semibold text-stone-900 mb-4">
            Panel de pedidos
          </h1>
          <p className="text-sm text-rose-700">
            Ocurrió un error al cargar los pedidos. Revisa la consola o Supabase.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">
              Pedidos de tortas
            </h1>
            <p className="text-sm text-stone-600">
              Vista interna para el equipo de Resseta Diferente.
            </p>
          </div>
          <Link
            href="/tortas-cumpleanos"
            className="text-xs rounded-full border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100"
          >
            Ver landing de tortas
          </Link>
        </header>

        {!orders || orders.length === 0 ? (
          <p className="text-sm text-stone-600">
            Aún no hay pedidos. Cuando entren desde la web, los verás aquí.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-stone-200 text-xs">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-stone-700">
                    Fecha
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-stone-700">
                    Cliente
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-stone-700">
                    Torta
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-stone-700">
                    Retiro / Delivery
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-stone-700">
                    Total
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-stone-700">
                    Estado
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-stone-700">
                    Pago
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order: OrderRow) => {
                  const pickupLabel =
                    order.pickup_location === "delivery"
                      ? "Delivery"
                      : order.pickup_location === "centro"
                      ? "Local Centro"
                      : order.pickup_location === "bonilla"
                      ? "Local Bonilla"
                      : order.pickup_location === "sur"
                      ? "Local Sur"
                      : order.pickup_location;

                  let deliveryInfo = "";
                  if (order.pickup_location === "delivery") {
                    switch (order.delivery_zone) {
                      case "sur-allende":
                        deliveryInfo =
                          "Sur → Salvador Allende (+$3.000)";
                        break;
                      case "allende-nicolas":
                        deliveryInfo =
                          "Allende → Nicolás Tirado (+$5.000)";
                        break;
                      case "nicolas-costa":
                        deliveryInfo =
                          "Nicolás Tirado → Costa Laguna (+$8.000)";
                        break;
                      default:
                        deliveryInfo = "";
                    }
                  }

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70">
                      <td className="px-3 py-2 align-top text-stone-700">
                        <div className="flex flex-col">
                          <span>{formatDateTime(order.created_at)}</span>
                          <span className="text-[11px] text-stone-500">
                            Retiro: {order.pickup_date} {order.pickup_time}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            ID: {order.id.slice(0, 8)}…
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-stone-700">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {order.customer_name}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {order.customer_phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-stone-700">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {order.product_name}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {order.product_flavor}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {order.size_key} porciones
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-stone-700">
                        <div className="flex flex-col">
                          <span>{pickupLabel}</span>
                          {deliveryInfo && (
                            <span className="text-[11px] text-stone-500">
                              {deliveryInfo}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-stone-800">
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">
                            {formatMoney(order.total)}
                          </span>
                          {order.subtotal !== order.total && (
                            <span className="text-[11px] text-stone-500">
                              Subtotal: {formatMoney(order.subtotal)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                            getStatusBadgeClass(order.status)
                          }
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                            getPaymentBadgeClass(order.payment_status)
                          }
                        >
                          {getPaymentLabel(order.payment_status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
