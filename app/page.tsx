/* app/page.tsx */
import Link from "next/link";
import Image from "next/image";

const featuredProducts = [
  {
    name: "Torta Matilda",
    description: "Capas intensas de chocolate con ganache cremosa.",
    image: "/images/torta-matilda.png", // luego reemplazamos con fotos reales
  },
  {
    name: "Zanahoria",
    description: "Bizcocho húmedo, bañado en mezcla de tres leches.",
    image: "/images/zanahoria.png",
  },
  {
    name: "Pie de Limón",
    description: "Base crocante, relleno cremoso y merengue flameado.",
    image: "/images/pie-limon.png",
  },
  {
    name: "Cannolis Sicilianos",
    description: "Crujientes, rellenos de crema suave y toppings variados.",
    image: "/images/cannolis.jpg",
  },
];

const locations = [
  {
    name: "Resseta Centro - Al paso",
    address: "Copiapo #988, Antofagasta",
    schedule: "Lunes a Sábado · 08:00 a 21:00",
    mapUrl: "#",
    image: "/images/local-centro.jpg",
  },
  {
    name: "Resseta Cafetería",
    address: "Dirección local Bonilla, Antofagasta",
    schedule: "Lunes a Domingo · 10:00 a 21:00",
    mapUrl: "#",
    image: "/images/local-MR.jpg",
  },
  {
    name: "Resseta Sur - Casa Matriz Al Paso",
    address: "Dirección local Sur, Antofagasta",
    schedule: "Lunes a Domingo · 10:00 a 21:00",
    mapUrl: "#",
    image: "/images/local-sur.jpg",
  },
];


const testimonials = [
  {
    name: "Camila",
    text: "La mejor pastelería de Antofagasta. La torta Matilda es un clásico obligado.",
  },
  {
    name: "Rodrigo",
    text: "Excelente café y postres. Ideal para juntarse a conversar o trabajar un rato.",
  },
  {
    name: "Paula",
    text: "Los cannolis son una locura, se nota el trabajo artesanal en cada detalle.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[url('/images/hero-resseta.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-white">
          <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-amber-200 mb-4">
            Pastelería & Cafetería Artesanal
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            Resseta Diferente
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-stone-100 mb-8">
            Tortas, postres y café preparados a mano todos los días, en nuestros
            locales pensados para disfrutar sin prisa.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#productos"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-amber-400 text-stone-900 hover:bg-amber-300 transition"
            >
              Ver productos estrella
            </Link>
            <a
              href="https://wa.me/56900000000?text=Hola%20Resseta%20Diferente%2C%20quiero%20hacer%20un%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium border border-white/60 text-white hover:bg-white/10 transition"
            >
              Haz tu pedido por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Productos Estrella */}
      <section
        id="productos"
        className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
                Los más pedidos
              </h2>
              <p className="text-stone-600 text-sm sm:text-base max-w-xl">
                Clásicos de Resseta Diferente, perfectos para celebrar, compartir
                o simplemente darse un gusto.
              </p>
            </div>
            <Link
              href="#contacto"
              className="text-sm font-medium text-amber-700 hover:text-amber-600"
            >
              Ver carta completa &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <article
                key={product.name}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-stone-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-stone-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone-600 mb-3 flex-1">
                    {product.description}
                  </p>
                  <button className="mt-auto inline-flex items-center text-xs font-medium text-amber-700 hover:text-amber-600">
                    Ver detalles &rarr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Hecho a mano con amor */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
              Filosofía
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-4">
              Hecho a mano, todos los días.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mb-4">
              En Resseta Diferente creemos en la pastelería artesanal, en las
              recetas que se perfeccionan con el tiempo y en el cuidado de cada
              detalle. Desde las bases hasta las decoraciones, todo se elabora en
              nuestra propia fábrica.
            </p>
            <p className="text-sm sm:text-base text-stone-600">
              Utilizamos ingredientes seleccionados y técnicas que combinan
              tradición y modernidad para ofrecer tortas, postres y productos
              consistentes, ricos y memorables.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden">
              <Image
                src="/images/filosofia-1.jpg"
                alt="Preparación de tortas en el obrador de Resseta Diferente"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-40 sm:h-64 rounded-2xl overflow-hidden">
              <Image
                src="/images/filosofia-2.jpg"
                alt="Decoración artesanal de tortas en Resseta Diferente"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden">
              <Image
                src="/images/filosofia-3.jpg"
                alt="Detalle de capa y relleno de torta"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden">
              <Image
                src="/images/filosofia-4.jpg"
                alt="Vitrina con tortas y postres"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Locales */}
      <section className="py-16 sm:py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
              Locales
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
              Encuentra tu Resseta
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-xl">
              Tres puntos en Antofagasta pensados para tomar un buen café,
              compartir un trozo de torta o llevar algo rico a casa.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {locations.map((loc) => (
              <article
              key={loc.name}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {/* Imagen del local con overlay y hover */}
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={loc.image}
                  alt={`Foto de ${loc.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay suave */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
            
              {/* Contenido */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-semibold text-stone-900 mb-1">
                  {loc.name}
                </h3>
                <p className="text-sm text-stone-700 mb-2">{loc.address}</p>
                <p className="text-xs text-stone-500 mb-4">{loc.schedule}</p>
            
                <a
                  href={loc.mapUrl}
                  className="mt-auto inline-flex items-center text-xs font-medium text-amber-700 hover:text-amber-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en Google Maps &rarr;
                </a>
              </div>
            </article>
                        
            ))}
          </div>
        </div>
      </section>

      {/* Novedades / Promos */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
                Novedades
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
                Temporadas, lanzamientos y clásicos que vuelven
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-xl">
                Cannolis de vuelta, campañas especiales y productos que van
                rotando según la temporada.
              </p>
            </div>
            <a
              href="https://www.instagram.com/ressetadiferente/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-amber-700 hover:text-amber-600"
            >
              Ver más en Instagram &rarr;
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Novedad 1 */}
            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden">
              <Image
                src="/images/cannolis.jpg"
                alt="Cannolis de Resseta Diferente"
                fill
                className="object-cover"
              />
            </div>

            {/* Novedad 2 */}
            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden">
              <Image
                src="/images/novedad3.jpg"
                alt="Promoción especial de temporada"
                fill
                className="object-cover"
              />
            </div>

            {/* Novedad 3 */}
            <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden">
              <Image
                src="/images/cannolis.jpg"
                alt="Packs y combos Resseta Diferente"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Cafetería */}
      <section className="py-16 sm:py-20 bg-stone-900 text-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-3">
              Cafetería
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Un café, un trozo de torta y un momento para ti.
            </h2>
            <p className="text-sm sm:text-base text-stone-200 mb-4">
              Nuestros locales están pensados para que puedas sentarte tranquilo,
              conversar, trabajar o simplemente disfrutar un momento contigo
              mismo.
            </p>
            <p className="text-sm sm:text-base text-stone-200">
              Contamos con café de calidad, pasteles individuales, tortas por
              porción y opciones para compartir en la mesa o llevar.
            </p>
          </div>
          <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden">
            <Image
              src="/images/cafeteria.jpg"
              alt="Interior de la cafetería Resseta Diferente"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 mb-3">
              Opiniones
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="bg-white rounded-2xl shadow-sm p-5 border border-stone-100"
              >
                <blockquote className="text-sm text-stone-700 mb-3">
                  “{t.text}”
                </blockquote>
                <figcaption className="text-xs font-medium text-stone-500">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto + Footer */}
      <section
        id="contacto"
        className="py-16 sm:py-20 bg-white border-t border-stone-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1.3fr,1fr]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-4">
              ¿Quieres hacer un pedido o cotizar?
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mb-6 max-w-xl">
              Escríbenos con la fecha, cantidad de personas y el tipo de
              producto que buscas, y te ayudamos a elegir la mejor opción.
            </p>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Mensaje
                </label>
                <textarea
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Cuéntanos qué necesitas…"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-amber-400 text-stone-900 hover:bg-amber-300 transition"
              >
                Enviar consulta
              </button>
            </form>
          </div>

          <div className="space-y-4 text-sm text-stone-700">
            <h3 className="text-base font-semibold text-stone-900">
              Contacto directo
            </h3>
            <p>WhatsApp: +56 9 0000 0000</p>
            <p>Instagram: @ressetadiferente</p>
            <p>Correo: contacto@ressetadiferente.cl</p>
            <p className="text-xs text-stone-500 pt-4">
              Horario general: Lunes a Domingo · 10:00 a 21:00 (puede variar por
              local).
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-300 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} Resseta Diferente. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-stone-500">
            Sitio desarrollado con cariño para los amantes de lo dulce.
          </p>
        </div>
      </footer>
    </main>
  );
}
