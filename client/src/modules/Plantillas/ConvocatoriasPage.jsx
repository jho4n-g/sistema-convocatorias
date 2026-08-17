import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const convocatoriasIniciales = [
  {
    id: 1,
    codigo: 'CONV-2026-014',
    cargo: 'Analista de Sistemas',
    area: 'Unidad de Sistemas',
    modalidad: 'Tiempo completo',
    plazas: 2,
    fechaCierre: '31/07/2026',
    estado: 'ABIERTO',
  },
  {
    id: 2,
    codigo: 'CONV-2026-013',
    cargo: 'Profesional de Recursos Humanos',
    area: 'Recursos Humanos',
    modalidad: 'Tiempo completo',
    plazas: 1,
    fechaCierre: '28/07/2026',
    estado: 'ABIERTO',
  },
  {
    id: 3,
    codigo: 'CONV-2026-012',
    cargo: 'Técnico de Soporte',
    area: 'Tecnología',
    modalidad: 'Presencial',
    plazas: 3,
    fechaCierre: '25/07/2026',
    estado: 'PRÓXIMO CIERRE',
  },
];

const areas = [
  'Todas las áreas',
  'Unidad de Sistemas',
  'Recursos Humanos',
  'Tecnología',
];

const modalidades = [
  'Todas',
  'Presencial',
  'Remoto',
  'Híbrido',
  'Tiempo completo',
];

const getEstadoStyles = (estado) => {
  if (estado === 'PRÓXIMO CIERRE') {
    return 'bg-amber-50 text-amber-700';
  }

  return 'bg-emerald-50 text-emerald-700';
};

export default function ConvocatoriasPage() {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const [areaSeleccionada, setAreaSeleccionada] = useState('Todas las áreas');
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState('Todas');
  const [filtros, setFiltros] = useState({
    busqueda: '',
    area: 'Todas las áreas',
    modalidad: 'Todas',
  });
  //

  const convocatoriasFiltradas = useMemo(() => {
    return convocatoriasIniciales.filter((convocatoria) => {
      const textoBusqueda = filtros.busqueda.trim().toLowerCase();

      const coincideBusqueda =
        textoBusqueda === '' ||
        convocatoria.cargo.toLowerCase().includes(textoBusqueda) ||
        convocatoria.codigo.toLowerCase().includes(textoBusqueda) ||
        convocatoria.area.toLowerCase().includes(textoBusqueda);

      const coincideArea =
        filtros.area === 'Todas las áreas' ||
        convocatoria.area === filtros.area;

      const coincideModalidad =
        filtros.modalidad === 'Todas' ||
        convocatoria.modalidad === filtros.modalidad;

      return coincideBusqueda && coincideArea && coincideModalidad;
    });
  }, [filtros]);

  const handleBuscar = (event) => {
    event.preventDefault();

    setFiltros({
      busqueda,
      area: areaSeleccionada,
      modalidad: modalidadSeleccionada,
    });
  };

  const handleVerDetalle = (convocatoriaId) => {
    // console.log('Ver convocatoria:', convocatoriaId);

    navigate(`/convocatoria-detalle/${14}`);

    // Ejemplo usando React Router:
    // navigate(`/convocatorias/${convocatoriaId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Encabezado */}
      <header className="bg-emerald-900 text-white shadow-sm">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a
            href="/"
            className="text-2xl font-bold tracking-wide transition hover:text-emerald-100 sm:text-3xl"
          >
            CONVOCA
          </a>

          <nav className="hidden items-center gap-4 md:flex">
            <a
              href="/"
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              Inicio
            </a>

            <span className="h-5 w-px bg-white/50" />

            <a
              href="/convocatorias"
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              Convocatorias
            </a>

            <span className="h-5 w-px bg-white/50" />

            <a
              href="/perfil"
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              Mi perfil
            </a>

            <a
              href="/login"
              className="ml-3 rounded-xl bg-white px-7 py-3 text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
            >
              Ingresar
            </a>
          </nav>

          <a
            href="/login"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 md:hidden"
          >
            Ingresar
          </a>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section>
          <h1 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            Convocatorias abiertas
          </h1>

          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            Encuentra oportunidades laborales y postula en línea.
          </p>
        </section>

        {/* Filtros */}
        <form
          onSubmit={handleBuscar}
          className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end"
        >
          <div>
            <label
              htmlFor="busqueda"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Buscar
            </label>

            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Cargo, profesión o palabra clave"
                className="h-14 w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="area"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Área
            </label>

            <div className="relative">
              <select
                id="area"
                value={areaSeleccionada}
                onChange={(event) => setAreaSeleccionada(event.target.value)}
                className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-11 text-slate-600 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-800" />
            </div>
          </div>

          <div>
            <label
              htmlFor="modalidad"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Modalidad
            </label>

            <div className="relative">
              <select
                id="modalidad"
                value={modalidadSeleccionada}
                onChange={(event) =>
                  setModalidadSeleccionada(event.target.value)
                }
                className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-11 text-slate-600 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              >
                {modalidades.map((modalidad) => (
                  <option key={modalidad} value={modalidad}>
                    {modalidad}
                  </option>
                ))}
              </select>

              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-800" />
            </div>
          </div>

          <button
            type="submit"
            className="h-14 rounded-xl bg-emerald-800 px-10 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
          >
            Buscar
          </button>
        </form>

        {/* Listado */}
        <section className="mt-10 space-y-5">
          {convocatoriasFiltradas.length > 0 ? (
            convocatoriasFiltradas.map((convocatoria) => (
              <article
                key={convocatoria.id}
                className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
                    {convocatoria.codigo}
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-emerald-900">
                    {convocatoria.cargo}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 sm:text-base">
                    <span>{convocatoria.area}</span>

                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-emerald-700"
                    />

                    <span>
                      {convocatoria.plazas}{' '}
                      {convocatoria.plazas === 1 ? 'plaza' : 'plazas'}
                    </span>

                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-emerald-700"
                    />

                    <span>Cierra {convocatoria.fechaCierre}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-5 lg:items-center">
                  <span
                    className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold ${getEstadoStyles(
                      convocatoria.estado,
                    )}`}
                  >
                    {convocatoria.estado}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVerDetalle(convocatoria.id)}
                    className="min-w-40 rounded-xl border-2 border-emerald-700 px-6 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-700/10"
                  >
                    Ver detalle
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <MagnifyingGlassIcon className="mx-auto h-10 w-10 text-slate-400" />

              <h2 className="mt-4 text-lg font-bold text-slate-700">
                No se encontraron convocatorias
              </h2>

              <p className="mt-2 text-slate-500">
                Modifica los filtros e intenta nuevamente.
              </p>
            </div>
          )}
        </section>

        <p className="mt-8 text-sm text-slate-500">
          Mostrando {convocatoriasFiltradas.length} de{' '}
          {convocatoriasIniciales.length} convocatorias
        </p>
      </main>
    </div>
  );
}
