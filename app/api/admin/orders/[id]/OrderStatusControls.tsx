"use client";

import { useState } from "react";

type OrderStatus =
  | "pending"
  | "in_production"
  | "ready"
  | "completed"
  | "cancelled";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "in_production":
      return "En producción";
    case "ready":
      return "Lista";
    case "completed":
      return "Entregado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

export function OrderStatusControls({ orderId, currentStatus }: Props) {
  const [loadingStatus, setLoadingStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGoToInProduction = currentStatus === "pending";
  const canGoToReady = currentStatus === "in_production";
  const canGoToCompleted = currentStatus === "ready";
  const canCancel =
    currentStatus !== "completed" && currentStatus !== "cancelled";

    async function updateStatus(newStatus: OrderStatus, note?: string) {
      setError(null);
      setLoadingStatus(newStatus);
      try {
        const res = await fetch(`/api/admin/orders/${orderId}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newStatus, note }),
        });
    
        let data: any = {};
        try {
          data = await res.json();
        } catch (e) {
          console.error("No se pudo parsear JSON de la respuesta:", e);
        }
    
        if (!res.ok || !data.ok) {
          setError(
            data.error ||
              "No se pudo actualizar el estado. Revisa la consola o inténtalo nuevamente."
          );
          console.error("Error al actualizar estado:", data);
          return;
        }
    
        window.location.reload();
      } catch (err) {
        console.error(err);
        setError("Error de red al intentar actualizar el estado.");
      } finally {
        setLoadingStatus(null);
      }
    }
    

  const handleCancel = async () => {
    if (!canCancel) return;
    const confirmed = window.confirm(
      "¿Seguro que quieres cancelar este pedido?\n\nEsta acción marcará el pedido como 'Cancelado', pero mantendrá el registro para historial."
    );
    if (!confirmed) return;

    await updateStatus(
      "cancelled",
      "Pedido cancelado desde panel admin."
    );
  };

  return (
    <div className="flex flex-col items-end gap-2 text-xs">
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          disabled={!canGoToInProduction || !!loadingStatus}
          onClick={() =>
            updateStatus(
              "in_production",
              "El pedido pasó a producción."
            )
          }
          className={`rounded-full px-3 py-1 border text-xs transition ${
            canGoToInProduction
              ? "border-blue-300 text-blue-700 hover:bg-blue-50"
              : "border-stone-200 text-stone-300 cursor-not-allowed"
          }`}
        >
          {loadingStatus === "in_production"
            ? "Moviendo..."
            : "Mover a producción"}
        </button>

        <button
          type="button"
          disabled={!canGoToReady || !!loadingStatus}
          onClick={() =>
            updateStatus(
              "ready",
              "El pedido fue marcado como listo para entregar/retirar."
            )
          }
          className={`rounded-full px-3 py-1 border text-xs transition ${
            canGoToReady
              ? "border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              : "border-stone-200 text-stone-300 cursor-not-allowed"
          }`}
        >
          {loadingStatus === "ready" ? "Actualizando..." : "Marcar como lista"}
        </button>

        <button
          type="button"
          disabled={!canGoToCompleted || !!loadingStatus}
          onClick={() =>
            updateStatus(
              "completed",
              "El pedido fue entregado al cliente."
            )
          }
          className={`rounded-full px-3 py-1 border text-xs transition ${
            canGoToCompleted
              ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              : "border-stone-200 text-stone-300 cursor-not-allowed"
          }`}
        >
          {loadingStatus === "completed"
            ? "Cerrando..."
            : "Marcar como entregado"}
        </button>

        <button
          type="button"
          disabled={!canCancel || !!loadingStatus}
          onClick={handleCancel}
          className={`rounded-full px-3 py-1 border text-xs transition ${
            canCancel
              ? "border-rose-300 text-rose-700 hover:bg-rose-50"
              : "border-stone-200 text-stone-300 cursor-not-allowed"
          }`}
        >
          {loadingStatus === "cancelled"
            ? "Cancelando..."
            : "Cancelar pedido"}
        </button>
      </div>

      {error && (
        <p className="text-[11px] text-rose-600 max-w-xs text-right">
          {error}
        </p>
      )}

      <p className="text-[10px] text-stone-400">
        Flujo sugerido: Pendiente → En producción → Lista → Entregado.
      </p>
    </div>
  );
}
