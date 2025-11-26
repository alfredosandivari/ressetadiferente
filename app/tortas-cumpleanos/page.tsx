"use client";

import { useState } from "react";
import Image from "next/image";

type SizeOption = "10" | "20" | "30";

interface BirthdayCake {
  id: string;
  name: string;
  flavor: string;
  description: string;
  image: string;
  prices: Record<SizeOption, number>;
}

const birthdayCakes: BirthdayCake[] = [
  {
    id: "matilda",
    name: "Torta Matilda",
    flavor: "Chocolate intenso",
    description:
      "Bizcocho húmedo de chocolate, relleno con ganache cremosa y cobertura de cacao.",
    image: "/images/torta-matilda.png",
    prices: {
      "10": 24990,
      "20": 34990,
      "30": 44990,
    },
  },
  {
    id: "tres-leches",
    name: "Torta Tres Leches",
    flavor: "Vainilla clásica",
    description:
      "Bizcocho esponjoso bañado en mezcla de tres leches, cubierto con crema suave.",
    image: "/images/tres-leches.png",
    prices: {
      "10": 23990,
      "20": 33990,
      "30": 43990,
    },
  },
  {
    id: "frutos-rojos",
    name: "Torta Zanahoria",
    flavor: "Nueces y manjar",
    description:
      "Bizcocho de zanahoria y nueces, relleno de manjar cubierto por abundante frosting.",
    image: "/images/zanahoria.png",
    prices: {
      "10": 25990,
      "20": 36990,
      "30": 47990,
    },
  },
];

const locations = [
  { id: "centro", label: "Resseta Centro" },
  { id: "bonilla", label: "Resseta Bonilla" },
  { id: "sur", label: "Resseta Sur" },
];

export default function BirthdayCakesPage() {
  const [selectedCake, setSelectedCake] = useState<BirthdayCake | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState<string>("");
  const [selectedDeliveryZone, setSelectedDeliveryZone] =
    useState<string>("");
  const [isGift, setIsGift] = useState<"yes" | "no">("no");
  const [showForm, setShowForm] = useState(false);

  const handleSelectCake = (cake: BirthdayCake) => {
    setSelectedCake(cake);
    setSelectedSize("20"); // tamaño por defecto
    setSubmitMessage(null);
    setShowForm(false); // si cambia de torta, volvemos al paso 2
  };

  const handleSubmit = async (formData: FormData) => {
    const pickupLocation = formData.get("pickupLocation") as string | null;
    const deliveryZone = formData.get("deliveryZone") as string | null;
    const isGiftValue = formData.get("isGift") as string | null;

    if (!selectedCake || !selectedSize) {
      setSubmitMessage("Por favor selecciona una torta y tamaño.");
      return;
    }

    let deliveryFee = 0;

    if (pickupLocation === "delivery" && deliveryZone) {
      switch (deliveryZone) {
        case "sur-allende":
          deliveryFee = 3000;
          break;
        case "allende-nicolas":
          deliveryFee = 5000;
          break;
        case "nicolas-costa":
          deliveryFee = 8000;
          break;
      }
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const payload = {
      cakeId: selectedCake.id,
      cakeName: selectedCake.name,
      size: selectedSize,
      price: selectedCake.prices[selectedSize],
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      pickupLocation,
      pickupDate: formData.get("pickupDate"),
      pickupTime: formData.get("pickupTime"),
      deliveryZone,
      deliveryFee,
      messageOnCake: formData.get("messageOnCake"),
      notes: formData.get("notes"),
      isGift: isGiftValue === "yes",
      giftFrom: formData.get("giftFrom"),
      giftMessage: formData.get("giftMessage"),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error al enviar el pedido");
      }

      setSubmitMessage(
        "Tu solicitud fue enviada. Te contactaremos para confirmar el pago y los detalles. ❤️"
      );
    } catch (err) {
      console.error(err);
      setSubmitMessage(
        "Ocurrió un problema al enviar tu solicitud. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-stone-50">
        <div className="absolute inset-0 opacity-20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-3">
            Encarga tu torta
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
            Tortas de cumpleaños a tu medida
          </h1>
          <p className="text-sm sm:text-base text-stone-200 max-w-2xl">
            Elige el sabor, tamaño y el mensaje que quieres que escribamos en tu
            torta. Luego, completa tus datos y nos encargamos del resto.
          </p>
        </div>
      </section>

      {/* Selección de tortas */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          {/* Listado de tortas */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 mb-4">
              1. Elige tu torta
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              Selecciona el sabor y luego el tamaño que necesitas. Más adelante
              podremos agregar otras ocasiones como bautizos, baby showers y más.
            </p>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {birthdayCakes.map((cake) => {
                const isActive = selectedCake?.id === cake.id;

                return (
                  <button
                    key={cake.id}
                    type="button"
                    onClick={() => handleSelectCake(cake)}
                    className={`group text-left bg-white rounded-2xl shadow-sm border transition overflow-hidden flex flex-col ${
                      isActive
                        ? "border-amber-400 shadow-md"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {/* Foto cuadrada */}
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={cake.image}
                        alt={cake.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info abajo */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-stone-900 mb-1">
                        {cake.name}
                      </h3>
                      <p className="text-xs text-stone-500 mb-1">{cake.flavor}</p>
                      <p className="text-xs text-stone-600 mb-3 line-clamp-3">
                        {cake.description}
                      </p>

                      {/* Tamaños */}
                      <div className="space-y-1 text-[11px] mt-auto">
                        {(["10", "20", "30"] as SizeOption[]).map((size) => (
                          <label
                            key={size}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`size-${cake.id}`}
                                value={size}
                                checked={isActive && selectedSize === size}
                                onChange={() => {
                                  setSelectedCake(cake);
                                  setSelectedSize(size);
                                  setShowForm(false);
                                }}
                                className="h-3 w-3 text-amber-500 border-stone-300"
                              />
                              <span className="text-stone-700">{size} porciones</span>
                            </div>
                            <span className="font-semibold text-stone-900">
                              ${cake.prices[size].toLocaleString("es-CL")}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paso 2 / Formulario de datos */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
            {!showForm ? (
              // Paso 2: intro + botón continuar
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-stone-900 mb-2">
                  2. Tus datos
                </h2>
                {!selectedCake || !selectedSize ? (
                  <p className="text-xs text-amber-700 mb-4">
                    Antes de continuar, selecciona tu torta y tamaño en el paso 1.
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-stone-600 mb-4">
                      Revisa tu selección y luego continúa para completar tus
                      datos y coordinar el pedido.
                    </p>
                    <div className="mb-4 rounded-lg bg-stone-50 border border-stone-200 p-3 text-xs text-stone-700">
                      <p className="font-semibold text-stone-900 mb-1">
                        Resumen de tu torta:
                      </p>
                      <p>
                        <span className="font-medium">Torta:</span>{" "}
                        {selectedCake.name} ({selectedCake.flavor})
                      </p>
                      <p>
                        <span className="font-medium">Tamaño:</span>{" "}
                        {selectedSize} porciones
                      </p>
                      <p>
                        <span className="font-medium">Precio:</span>{" "}
                        $
                        {selectedCake.prices[
                          selectedSize
                        ].toLocaleString("es-CL")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="w-full inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-amber-400 text-stone-900 hover:bg-amber-300 transition"
                    >
                      Continuar con el pedido
                    </button>
                  </>
                )}
              </div>
            ) : (
              // Formulario completo
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-stone-900 mb-2">
                  2. Completa tus datos
                </h2>
                <p className="text-xs text-stone-600 mb-4">
                  Usaremos esta información para coordinar el pedido, el pago y el
                  retiro o delivery de tu torta.
                </p>

                {selectedCake && selectedSize && (
                  <div className="mb-4 rounded-lg bg-stone-50 border border-stone-200 p-3 text-xs text-stone-700">
                    <p className="font-semibold text-stone-900 mb-1">
                      Resumen de tu torta:
                    </p>
                    <p>
                      <span className="font-medium">Torta:</span>{" "}
                      {selectedCake.name} ({selectedCake.flavor})
                    </p>
                    <p>
                      <span className="font-medium">Tamaño:</span>{" "}
                      {selectedSize} porciones
                    </p>
                    <p>
                      <span className="font-medium">Precio:</span>{" "}
                      $
                      {selectedCake.prices[
                        selectedSize
                      ].toLocaleString("es-CL")}
                    </p>
                  </div>
                )}

                <form
                  className="space-y-3 text-xs"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    await handleSubmit(formData);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Nombre y apellido
                      </label>
                      <input
                        name="name"
                        required
                        className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        name="phone"
                        required
                        className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="+56 9..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Fecha de retiro
                      </label>
                      <input
                        type="date"
                        name="pickupDate"
                        required
                        className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Hora aproximada
                      </label>
                      <input
                        type="time"
                        name="pickupTime"
                        required
                        className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Retiro o delivery
                    </label>
                    <select
                      name="pickupLocation"
                      required
                      value={selectedPickupLocation}
                      onChange={(e) => {
                        setSelectedPickupLocation(e.target.value);
                        if (e.target.value !== "delivery") {
                          setSelectedDeliveryZone("");
                        }
                      }}
                      className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">Selecciona una opción</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.label}
                        </option>
                      ))}
                      <option value="delivery">
                        Delivery (con costo adicional)
                      </option>
                    </select>

                    {selectedPickupLocation === "delivery" && (
                      <div className="mt-3 space-y-2 text-[11px] text-stone-700">
                        <label className="block font-medium text-stone-700 mb-1 text-xs">
                          Sector de entrega
                        </label>
                        <select
                          name="deliveryZone"
                          required
                          value={selectedDeliveryZone}
                          onChange={(e) =>
                            setSelectedDeliveryZone(e.target.value)
                          }
                          className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="">Selecciona tu sector</option>
                          <option value="sur-allende">
                            Sector sur hasta Salvador Allende (+ $3.000)
                          </option>
                          <option value="allende-nicolas">
                            Salvador Allende hasta Nicolás Tirado (+ $5.000)
                          </option>
                          <option value="nicolas-costa">
                            Nicolás Tirado hasta Costa Laguna (+ $8.000)
                          </option>
                        </select>
                        <p>
                          El valor del delivery se suma al total de tu pedido y
                          se coordina según horario disponible.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Dedicatoria para escribir en la torta
                    </label>
                    <input
                      name="messageOnCake"
                      maxLength={30}
                      className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Ej: Feliz cumpleaños Fiorella"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Máx. 30 caracteres.
                    </p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <span className="block font-medium text-stone-700 mb-1">
                      ¿Es un regalo?
                    </span>
                    <div className="flex items-center gap-4 text-xs">
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name="isGift"
                          value="no"
                          checked={isGift === "no"}
                          onChange={() => setIsGift("no")}
                          className="h-3 w-3 text-amber-500 border-stone-300"
                        />
                        No
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name="isGift"
                          value="yes"
                          checked={isGift === "yes"}
                          onChange={() => setIsGift("yes")}
                          className="h-3 w-3 text-amber-500 border-stone-300"
                        />
                        Sí, es un regalo
                      </label>
                    </div>
                  </div>

                  {isGift === "yes" && (
                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          De parte de
                        </label>
                        <input
                          name="giftFrom"
                          className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          placeholder="Ej: Familia Sandivari"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          Mensaje para la tarjeta
                        </label>
                        <textarea
                          name="giftMessage"
                          rows={3}
                          className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          placeholder="Ej: Que sea un año lleno de dulzura y momentos felices."
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Comentarios adicionales
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="w-full rounded-md border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Detalles especiales, colores, alergias, etc."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedCake || !selectedSize}
                    className="w-full inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-amber-400 text-stone-900 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isSubmitting
                      ? "Enviando tu solicitud..."
                      : "Enviar pedido"}
                  </button>

                  {submitMessage && (
                    <p className="text-[11px] text-stone-700 mt-2">
                      {submitMessage}
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
