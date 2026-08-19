import { useEffect, useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import { ConvocatoriaServices as Servs } from '../PaginaInicio.services';

const meses = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

function convertirFechaEspañol(fechaStr) {
  const partes = fechaStr.split(' de ');
  const dia = parseInt(partes[0]); // 23
  const mes = meses[partes[1].toLowerCase()]; // agosto -> 7
  const año = parseInt(partes[2]); // 2026

  return new Date(año, mes, dia);
}

export default function ConvocatoriaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [convocatoria, setConvocatoria] = useState(null);

  const hoy = new Date();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const response = await Servs.getId(id);

        if (!response?.ok) {
          throw new Error(
            response?.message || 'No se pudo cargar la convocatoria',
          );
        }
        console.log('***************************');
        console.log(response.data.fecha_cierre);
        console.log(
          convertirFechaEspañol(response.data.fecha_cierre).setHours(
            0,
            0,
            0,
            0,
          ),
        );
        console.log(hoy.setHours(0, 0, 0, 0));

        console.log(
          convertirFechaEspañol(response.data.fecha_cierre).setHours(
            0,
            0,
            0,
            0,
          ) <= hoy.setHours(0, 0, 0, 0),
        );
        console.log('***************************');

        setConvocatoria(response.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Algo salió mal, inténtelo más tarde',
        );

        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handlePostular = () => {
    navigate(`/registro-postulante/${id}`);
  };

  const handleVolver = () => {
    navigate('/');
  };

  if (loading) {
    return <DetalleSkeleton />;
  }

  if (!convocatoria) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-emerald-800 bg-emerald-900 text-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-2xl font-black tracking-wide transition hover:text-emerald-100 sm:text-3xl"
          >
            CAJA NACIONAL DE SALUD - REGIONAL COCHABAMBA
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
          >
            Ingresar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* VOLVER */}
        <button
          type="button"
          onClick={handleVolver}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Volver a convocatorias
        </button>

        {/* CABECERA DE LA CONVOCATORIA */}
        <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />

                {convocatoria.estado}
              </span>

              {/* <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
                <BriefcaseIcon className="h-4 w-4" />
                Convocatoria laboral
              </span> */}
            </div>

            <h1 className="mt-5 max-w-5xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {convocatoria.titulo_cargo}
            </h1>

            <p className="mt-3 text-xl font-semibold text-emerald-800 sm:text-2xl">
              {convocatoria.nombre_cargo}
            </p>

            {convocatoria.descripcion && (
              <p className="mt-6 max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
                {convocatoria.descripcion}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CalendarDaysIcon className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  PUBLICACION
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {convocatoria.fecha_publicacion}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                <CalendarDaysIcon className="h-6 w-6 text-amber-700" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Fecha límite
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {convocatoria.fecha_cierre}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* COLUMNA PRINCIPAL */}
          <div className="space-y-7">
            {/* OBJETIVO */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionTitle icon={CheckCircleIcon} title="OBJETIVO DEL CARGO" />

              <div className="mt-5">
                {convocatoria.objetivo_cargo ? (
                  <p className="text-base leading-8 text-slate-600">
                    {convocatoria.objetivo_cargo}
                  </p>
                ) : (
                  <EmptyText texto="No se especificó un objetivo para el cargo." />
                )}
              </div>
            </section>

            {/* EXPERIENCIA */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionTitle icon={UserIcon} title="EXPERIENCIA REQUERIDA" />

              <div className="mt-6 space-y-6">
                {/* GENERAL */}
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Experiencia general
                  </p>

                  <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <p className="font-semibold text-emerald-900">
                      {convocatoria.experiencia_general ||
                        'No se especificó experiencia general.'}
                    </p>
                  </div>
                </div>

                {/* ESPECÍFICA */}
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Experiencia específica
                  </p>

                  {convocatoria.experienciasEspecificas?.length > 0 ? (
                    <ul className="mt-3 space-y-3">
                      {convocatoria.experienciasEspecificas.map(
                        (experiencia, index) => (
                          <li
                            key={`${experiencia.nombre_experiencia}-${index}`}
                            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                          >
                            <CheckBadgeIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                            <span className="text-sm leading-6 text-slate-700 sm:text-base">
                              {experiencia.nombre_experiencia}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <div className="mt-3">
                      <EmptyText texto="No se especificó experiencia específica." />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* DOCUMENTOS REQUERIDOS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionTitle
                icon={DocumentTextIcon}
                title="DOCUMENTOS REQUERIDOS"
              />

              <p className="mt-3 text-sm leading-6 text-slate-500">
                LOS SIGUIENTES DOCUMENTOS DEBERAN SER PRESENTADOS DURANTE TU
                POSTULACION.
              </p>

              {convocatoria.formacionesAcademicasC?.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {convocatoria.formacionesAcademicasC.map(
                    (documento, index) => (
                      <div
                        key={documento.id}
                        className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800">
                            {documento.nombre_formacion}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Documento requerido
                          </p>
                        </div>

                        <ClipboardDocumentCheckIcon className="h-6 w-6 shrink-0 text-emerald-600" />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyText texto="No se especificaron documentos adicionales." />
                </div>
              )}
            </section>
          </div>

          {/* ASIDE */}
          <aside className="self-start lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-t border-slate-100 bg-slate-50 p-6">
                {hoy.setHours(0, 0, 0, 0) <=
                convertirFechaEspañol(convocatoria.fecha_cierre).setHours(
                  0,
                  0,
                  0,
                  0,
                ) ? (
                  <button
                    type="button"
                    onClick={handlePostular}
                    className="w-full rounded-xl bg-emerald-700 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 active:scale-[0.99]"
                  >
                    Postular ahora
                  </button>
                ) : (
                  <></>
                )}

                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                  Verifica que cuentas con todos los documentos solicitados
                  antes de continuar.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
        <Icon className="h-6 w-6 text-emerald-700" />
      </div>

      <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

function ResumenItem({ titulo, valor }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {titulo}
      </dt>

      <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-800">
        {valor || 'No especificado'}
      </dd>
    </div>
  );
}

function EmptyText({ texto }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
      <p className="text-sm text-slate-500">{texto}</p>
    </div>
  );
}

function DetalleSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-20 bg-emerald-900" />

      <main className="mx-auto max-w-7xl animate-pulse px-5 py-10 sm:px-8 lg:px-10">
        <div className="h-5 w-40 rounded bg-slate-200" />

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <div className="h-6 w-28 rounded-full bg-slate-200" />
          <div className="mt-5 h-10 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-7 w-1/2 rounded bg-slate-100" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="h-96 rounded-2xl border border-slate-200 bg-white" />
        </div>
      </main>
    </div>
  );
}
