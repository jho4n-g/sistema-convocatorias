import { BriefcaseIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function InicioPage() {
  return (
    <div className="min-h-full">
      {/* Bienvenida */}
      <div className="relative overflow-hidden rounded-2xl bg-emerald-900 shadow-lg">
        {/* Decoración */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-700/40" />
        <div className="pointer-events-none absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-emerald-500/20" />

        <div className="relative z-10 px-8 py-12 sm:px-10 lg:px-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Texto */}
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-emerald-50 ring-1 ring-white/15">
                <BriefcaseIcon className="h-5 w-5" />
                Sistema de Convocatorias
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¡Bienvenido!
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-100 sm:text-lg">
                Bienvenido al Sistema de Gestión de Convocatorias y Selección de
                Personal.
              </p>

              <p className="mt-2 text-sm text-emerald-200">
                Utilice el menú lateral para acceder a las opciones disponibles.
              </p>
            </div>

            {/* Icono */}
            <div className="hidden shrink-0 md:block">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur">
                <UserCircleIcon className="h-20 w-20 text-white/90" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mensaje inferior
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Panel principal
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Desde aquí podrá gestionar y consultar la información disponible de
          acuerdo con su rol y permisos asignados.
        </p>
      </div> */}
    </div>
  );
}
