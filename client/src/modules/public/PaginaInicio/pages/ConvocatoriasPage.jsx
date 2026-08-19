import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import { ConvocatoriaServices as Servs } from '../PaginaInicio.services';

const getEstadoStyles = (estado) => {
  switch (estado) {
    case 'PUBLICADO':
    case 'ABIERTO':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';

    case 'PRÓXIMO CIERRE':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20';

    case 'CERRADO':
      return 'bg-red-50 text-red-700 ring-red-600/20';

    default:
      return 'bg-slate-100 text-slate-600 ring-slate-500/20';
  }
};

const formatFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';

  const [year, month, day] = fecha.slice(0, 10).split('-');

  return `${day}/${month}/${year}`;
};

export default function ConvocatoriasPage() {
  const navigate = useNavigate();

  const [dataConvocatorias, setDataConvocatorias] = useState([]);
  const [loading, setLoading] = useState(false);

  // Búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [search, setSearch] = useState('');

  // Paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const response = await Servs.getAll(page, limit, search);

        if (!response?.ok) {
          throw new Error(
            response?.message || 'No se pudo cargar las convocatorias',
          );
        }

        const convocatorias = Array.isArray(response.data) ? response.data : [];

        setDataConvocatorias(convocatorias);

        setTotal(Number(response.total ?? 0));

        setTotalPages(
          Number(
            response.totalPages ??
              Math.max(1, Math.ceil(Number(response.total ?? 0) / limit)),
          ),
        );
      } catch (error) {
        setDataConvocatorias([]);

        toast.error(
          error instanceof Error
            ? error.message
            : 'Algo salió mal, inténtelo más tarde',
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, limit, search]);

  const handleBuscar = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(busqueda.trim());
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setSearch('');
    setPage(1);
  };

  const handleLimit = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  const handleVerDetalle = (convocatoriaId) => {
    navigate(`/convocatoria-detalle/${convocatoriaId}`);
  };

  const paginaAnterior = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const paginaSiguiente = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const inicio = total === 0 ? 0 : (page - 1) * limit + 1;

  const fin = Math.min(page * limit, total);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-emerald-800 bg-emerald-900 text-white shadow-sm">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <h1 className="text-2xl font-black tracking-wide transition hover:text-emerald-100 sm:text-3xl">
            CAJA NACIONAL DE SALUD - REGIONAL COCHABAMBA
          </h1>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
          >
            Ingresar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* TÍTULO */}
        <section>
          <div className="max-w-3xl">
            {/* <span className="text-sm font-bold uppercase tracking-wider text-emerald-700">
              Oportunidades laborales
            </span> */}

            {/* <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Convocatorias abiertas
            </h1> */}

            {/* <p className="mt-3 text-base leading-7 text-slate-500 sm:text-lg">
              Encuentra oportunidades disponibles, revisa los requisitos y
              realiza tu postulación en línea.
            </p> */}
          </div>
        </section>

        {/* BUSCADOR */}
        <section className="mt-9 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <form
            onSubmit={handleBuscar}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por cargo, área o palabra clave..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-emerald-700 px-7 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Buscar
            </button>

            {search && (
              <button
                type="button"
                onClick={handleLimpiarBusqueda}
                className="h-12 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Limpiar
              </button>
            )}
          </form>
        </section>

        {/* INFORMACIÓN */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              CONVOCATORIAS - COCHABAMBA
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-slate-500">
                {total === 0
                  ? 'No se encontraron convocatorias'
                  : `${total} ${
                      total === 1
                        ? 'convocatoria encontrada'
                        : 'convocatorias encontradas'
                    }`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="limit"
              className="text-sm font-medium text-slate-500"
            >
              Mostrar:
            </label>

            <select
              id="limit"
              value={limit}
              onChange={handleLimit}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <section className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-5 w-28 rounded bg-slate-200" />

                <div className="mt-4 h-7 w-2/3 rounded bg-slate-200" />

                <div className="mt-4 h-4 w-full rounded bg-slate-100" />

                <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
              </div>
            ))}
          </section>
        )}

        {/* LISTADO */}
        {!loading && (
          <section className="mt-6 space-y-4">
            {dataConvocatorias.length > 0 ? (
              dataConvocatorias.map((convocatoria) => (
                <article
                  key={convocatoria.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      {/* ESTADO */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${getEstadoStyles(
                            convocatoria.estado,
                          )}`}
                        >
                          {convocatoria.estado ?? 'PUBLICADO'}
                        </span>

                        {convocatoria.area && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {convocatoria.area}
                          </span>
                        )}
                      </div>
                      {/* CARGO */}
                      <h2 className="mt-4 text-xl font-black leading-snug text-slate-900 transition group-hover:text-emerald-800 sm:text-2xl">
                        {convocatoria.titulo_cargo}

                        {convocatoria.nombre_cargo && (
                          <span className="font-semibold text-slate-600">
                            {' '}
                            - {convocatoria.nombre_cargo}
                          </span>
                        )}
                      </h2>
                      {/* DESCRIPCIÓN */}
                      <p
                        className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base"
                        title={convocatoria.descripcion ?? ''}
                      >
                        {convocatoria.descripcion?.trim() ||
                          'No se registró una descripción para esta convocatoria.'}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="h-5 w-5 text-emerald-700" />

                          <span>
                            Cierre:{'  '}
                            <strong className="font-semibold text-slate-700">
                              {convocatoria.fecha_cierre}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTÓN */}
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => handleVerDetalle(convocatoria.id)}
                        className="w-full rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/10 lg:w-auto"
                      >
                        Ver convocatoria
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <MagnifyingGlassIcon className="h-7 w-7 text-slate-400" />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-800">
                  No encontramos convocatorias
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  No existen resultados que coincidan con tu búsqueda. Intenta
                  utilizar otras palabras.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={handleLimpiarBusqueda}
                    className="mt-5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Ver todas las convocatorias
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* PAGINACIÓN */}
        {!loading && total > 0 && (
          <section className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">{inicio}</span> a{' '}
              <span className="font-semibold text-slate-700">{fin}</span> de{' '}
              <span className="font-semibold text-slate-700">{total}</span>{' '}
              resultados
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={paginaAnterior}
                disabled={page === 1}
                className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex h-10 min-w-24 items-center justify-center rounded-lg bg-emerald-50 px-4 text-sm font-bold text-emerald-800">
                {page} / {totalPages}
              </div>

              <button
                type="button"
                onClick={paginaSiguiente}
                disabled={page >= totalPages}
                className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
