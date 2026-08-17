import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { LoginServices as Servs } from './login.services';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  {
    id: 1,
    label: 'Convocatorias públicas',
    icon: MagnifyingGlassIcon,
  },
  {
    id: 2,
    label: 'Postulación digital',
    icon: DocumentTextIcon,
  },
  {
    id: 3,
    label: 'Evaluación objetiva',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    id: 4,
    label: 'Auditoría completa',
    icon: ShieldCheckIcon,
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const credentials = {
      correo: formData.get('usuario'),
      contrasenia: formData.get('password'),
    };

    try {
      const response = await Servs.iniciarSesion(credentials);

      if (!response.ok) {
        throw new Error(response.message || 'Credenciales incorrectas');
      }
      localStorage.setItem('token', response.token);
      login(response.data);
      navigate('/panel');
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Algo salió mal, inténtelo más tarde',
      );
    } finally {
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 lg:flex">
      {/* Panel izquierdo */}
      <section className="relative hidden min-h-screen w-[58%] overflow-hidden bg-emerald-900 lg:flex">
        {/* Figuras decorativas */}
        <div className="pointer-events-none absolute -right-28 -top-40 h-135 w-135 rounded-full bg-emerald-700/45" />

        <div className="pointer-events-none absolute -bottom-44 -left-40 h-130 w-130 rounded-full bg-emerald-300/35" />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-950/30 via-transparent to-emerald-950/20" />

        <div className="relative z-10 flex w-full flex-col justify-center px-14 py-16 xl:px-20 2xl:px-28">
          <div className="max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                <BriefcaseIcon className="h-7 w-7 text-white" />
              </div>

              <p className="text-2xl font-bold tracking-[0.18em] text-white">
                CAJA NACIONAL DE SALUD
              </p>
            </div>

            <h1 className="max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
              SISTEMA DE GESTION DE CONVOCATORIAS
            </h1>

            {/* <p className="mt-7 text-xl font-light leading-relaxed text-emerald-100/80">
              Transparencia · Trazabilidad · Igualdad de oportunidades
            </p>

            <div className="mt-12 space-y-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.id}
                    className="flex items-center gap-5 text-white"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100/25 ring-1 ring-white/15 backdrop-blur">
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <span className="text-xl font-light">{feature.label}</span>
                  </div>
                );
              })}
            </div> */}
          </div>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="relative flex min-h-screen flex-1 items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-50/80 via-white to-white" />

        <div className="relative z-10 w-full max-w-xl">
          {/* Logo móvil */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>

            <p className="text-xl font-bold tracking-[0.14em] text-emerald-900">
              CONVOCA
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_25px_70px_rgba(15,23,42,0.12)] sm:p-10 lg:p-12">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
                INICIAR SESION
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="usuario"
                  className="mb-2 block text-sm font-semibold text-slate-700 sm:text-base"
                >
                  CEDULA DE INDENTIDAD <span className="text-red-500">*</span>
                </label>

                <input
                  id="usuario"
                  name="usuario"
                  placeholder="12345678"
                  required
                  className="h-13 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700 sm:text-base"
                >
                  CONTRASEÑA <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    required
                    className="h-13 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-800"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-800 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20 active:scale-[0.99]"
              >
                Ingresar
              </button>

              <div className="flex items-center gap-4 py-1">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-sm text-slate-400">o</span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* <p className="text-sm text-slate-600 sm:text-base">
                  ¿Eres postulante?
                </p> */}

                <button
                  type="button"
                  onClick={() => {
                    navigate('/');
                  }}
                  className="rounded-xl border-2 border-emerald-800 px-7 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-700/10 sm:text-base"
                >
                  Volver a pagina de inicio
                </button>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Sistema de Gestión de Convocatorias · Pantalla de acceso
          </p>
        </div>
      </section>
    </main>
  );
}
