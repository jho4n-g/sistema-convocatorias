import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UserIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const convocatoria = {
  id: 14,
  codigo: 'CONV-2026-014',
  estado: 'ABIERTO',
  cargo: 'Analista de Sistemas',
  area: 'Unidad de Sistemas',
  plazas: 2,
  modalidad: 'Tiempo completo',
  objetivo:
    'Analizar, desarrollar y mantener soluciones informáticas institucionales, garantizando calidad, seguridad y trazabilidad.',
  requisitos: [
    'Título profesional en Ingeniería de Sistemas o afines.',
    'Experiencia general mínima de 2 años.',
    'Conocimientos en desarrollo web, bases de datos y control de versiones.',
  ],
  documentos: [
    'Hoja de vida actualizada.',
    'Documento de identidad.',
    'Título profesional.',
    'Certificados de experiencia laboral.',
  ],
  publicacion: '20/07/2026',
  cierre: '31/07/2026 23:59',
  experiencia: '2 años',
  ubicacion: 'Cochabamba',
};

export default function ConvocatoriaDetallePage() {
  const handlePostular = () => {
    console.log('Postular a convocatoria:', convocatoria.id);

    // Con React Router:
    // navigate(`/convocatorias/${convocatoria.id}/postular`);
  };

  const handleVolver = () => {
    window.history.back();

    // Con React Router:
    // navigate('/convocatorias');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Encabezado */}
      <header className="bg-emerald-900 text-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <a
            href="/"
            className="text-2xl font-bold tracking-wide transition hover:text-emerald-100 sm:text-3xl"
          >
            CONVOCA
          </a>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <button
          type="button"
          onClick={handleVolver}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 transition hover:text-emerald-700 sm:text-base"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Volver a convocatorias
        </button>

        <div className="mt-7 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-14">
          {/* Información principal */}
          <section>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
                {convocatoria.codigo}
              </span>

              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">
                {convocatoria.estado}
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">
              {convocatoria.cargo}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-slate-600">
              <div className="flex items-center gap-2">
                <BuildingOffice2Icon className="h-6 w-6 text-slate-600" />
                <span>{convocatoria.area}</span>
              </div>

              <span className="hidden h-1.5 w-1.5 rounded-full bg-slate-500 sm:block" />

              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-6 w-6 text-slate-600" />
                <span>
                  {convocatoria.plazas}{' '}
                  {convocatoria.plazas === 1 ? 'plaza' : 'plazas'}
                </span>
              </div>

              <span className="hidden h-1.5 w-1.5 rounded-full bg-slate-500 sm:block" />

              <div className="flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-slate-600" />
                <span>{convocatoria.modalidad}</span>
              </div>
            </div>

            {/* Objetivo */}
            <section className="mt-14">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-8 w-8 text-emerald-800" />

                <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                  Objetivo del cargo
                </h2>
              </div>

              <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
                {convocatoria.objetivo}
              </p>
            </section>

            {/* Requisitos */}
            <section className="mt-14">
              <div className="flex items-center gap-3">
                <UserIcon className="h-8 w-8 text-emerald-800" />

                <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                  Requisitos mínimos
                </h2>
              </div>

              <ul className="mt-5 space-y-3 pl-5 text-base leading-7 text-slate-600 sm:text-lg">
                {convocatoria.requisitos.map((requisito) => (
                  <li key={requisito} className="list-disc">
                    {requisito}
                  </li>
                ))}
              </ul>
            </section>

            {/* Documentos */}
            <section className="mt-14">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-8 w-8 text-emerald-800" />

                <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                  Documentos requeridos
                </h2>
              </div>

              <ul className="mt-5 space-y-3 pl-5 text-base leading-7 text-slate-600 sm:text-lg">
                {convocatoria.documentos.map((documento) => (
                  <li key={documento} className="list-disc">
                    {documento}
                  </li>
                ))}
              </ul>
            </section>
          </section>

          {/* Resumen lateral */}
          <aside className="self-start lg:sticky lg:top-8">
            <div className="rounded-3xl border border-slate-300 bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-3xl font-bold text-emerald-950">Resumen</h2>

              <dl className="mt-8 space-y-7">
                <div className="grid grid-cols-[1fr_auto] gap-6">
                  <dt className="text-slate-500">Publicación</dt>
                  <dd className="font-medium text-slate-900">
                    {convocatoria.publicacion}
                  </dd>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-6">
                  <dt className="text-slate-500">Cierre</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {convocatoria.cierre}
                  </dd>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-6">
                  <dt className="text-slate-500">Experiencia</dt>
                  <dd className="font-medium text-slate-900">
                    {convocatoria.experiencia}
                  </dd>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-6">
                  <dt className="text-slate-500">Ubicación</dt>
                  <dd className="font-medium text-slate-900">
                    {convocatoria.ubicacion}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handlePostular}
                className="mt-9 w-full rounded-xl bg-emerald-800 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 active:scale-[0.99]"
              >
                Postular ahora
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
