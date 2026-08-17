import { useState } from 'react';

import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  IdentificationIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const beneficios = [
  'Postula a convocatorias disponibles',
  'Gestiona tus documentos digitales',
  'Realiza seguimiento de tus postulaciones',
  'Recibe notificaciones del proceso',
];

export default function RegistroPostulantePage() {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 lg:flex">
      {/* Panel izquierdo */}
      <section
        className="
          relative hidden
          w-[45%]
          overflow-hidden
          bg-emerald-900
          lg:flex
        "
      >
        {/* Decoraciones */}
        <div
          className="
            absolute -right-40 -top-40
            h-125 w-125
            rounded-full
            bg-emerald-700/40
          "
        />

        <div
          className="
            absolute -bottom-40 -left-40
            h-112.5 w-112.5 
            rounded-full
            bg-emerald-400/20
          "
        />

        <div className="relative z-10 flex flex-col justify-center px-14">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-white
                p-2
                shadow-lg
              "
            >
              <img
                src="/logo_CNS.webp"
                alt="Logo institucional"
                className="
                  h-full w-full
                  object-contain
                "
              />
            </div>

            <h1
              className="
                text-3xl
                font-black
                tracking-wide
                text-white
              "
            >
              CONVOCA
            </h1>
          </div>

          <h2
            className="
              mt-12
              text-4xl
              font-bold
              leading-tight
              text-white
            "
          >
            Crea tu cuenta como postulante
          </h2>

          <p
            className="
              mt-6
              text-lg
              leading-relaxed
              text-emerald-100
            "
          >
            Participa en procesos de selección de manera transparente y segura.
          </p>

          <div className="mt-10 space-y-5">
            {beneficios.map((item) => (
              <div
                key={item}
                className="
                  flex items-center gap-4
                  text-white
                "
              >
                <CheckCircleIcon
                  className="
                    h-7 w-7
                    text-emerald-300
                  "
                />

                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section
        className="
          flex flex-1
          items-center
          justify-center
          px-5 py-10
          sm:px-10
        "
      >
        <div
          className="
            w-full
            max-w-xl
            rounded-3xl
            bg-white
            p-8
            shadow-xl
            sm:p-10
          "
        >
          <div className="mb-8">
            <h2
              className="
                text-3xl
                font-bold
                text-emerald-950
              "
            >
              Crear cuenta
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Completa tus datos para registrarte como postulante.
            </p>
          </div>

          <form className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nombres
              </label>

              <div className="relative">
                <UserIcon
                  className="
                    absolute left-4 top-1/2
                    h-5 w-5
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  placeholder="Ej. Juan Carlos"
                  className="
                    h-12 w-full
                    rounded-xl
                    border
                    border-slate-300
                    pl-12
                    outline-none
                    focus:border-emerald-700
                    focus:ring-4
                    focus:ring-emerald-700/10
                  "
                />
              </div>
            </div>

            {/* Apellidos */}
            <input
              type="text"
              placeholder="Apellidos"
              className="
                h-12 w-full
                rounded-xl
                border
                border-slate-300
                px-4
                outline-none
                focus:border-emerald-700
              "
            />

            {/* CI */}
            <div className="relative">
              <IdentificationIcon
                className="
                  absolute left-4 top-1/2
                  h-5 w-5
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                placeholder="Carnet de identidad"
                className="
                  h-12 w-full
                  rounded-xl
                  border
                  border-slate-300
                  pl-12
                  outline-none
                  focus:border-emerald-700
                "
              />
            </div>

            {/* Correo */}
            <div className="relative">
              <EnvelopeIcon
                className="
                  absolute left-4 top-1/2
                  h-5 w-5
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                placeholder="correo@email.com"
                className="
                  h-12 w-full
                  rounded-xl
                  border
                  border-slate-300
                  pl-12
                  outline-none
                  focus:border-emerald-700
                "
              />
            </div>

            {/* Password */}
            <div className="relative">
              <LockClosedIcon
                className="
                  absolute left-4 top-1/2
                  h-5 w-5
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                className="
                  h-12 w-full
                  rounded-xl
                  border
                  border-slate-300
                  pl-12
                  outline-none
                  focus:border-emerald-700
                "
              />
            </div>

            <button
              type="submit"
              className="
                mt-4
                w-full
                rounded-xl
                bg-emerald-800
                py-3.5
                font-semibold
                text-white
                transition
                hover:bg-emerald-900
              "
            >
              Crear cuenta
            </button>

            <p
              className="
                text-center
                text-sm
                text-slate-500
              "
            >
              ¿Ya tienes una cuenta?
              <a
                href="/login"
                className="
                  ml-1
                  font-semibold
                  text-emerald-800
                "
              >
                Iniciar sesión
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
