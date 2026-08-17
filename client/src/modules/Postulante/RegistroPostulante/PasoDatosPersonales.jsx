import { InformationCircleIcon } from '@heroicons/react/24/solid';
import InputField from '../../../components/InputField';
import { useState } from 'react';
import { datosPersonalesSchema } from '../schemas/pasoDatosPersonales.schema';
import { toast } from 'react-toastify';

const camposMayuscula = ['nombres', 'apellido_paterno', 'apellido_materno'];

export default function PasoDatosPersonales({ data, setData, siguiente }) {
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: camposMayuscula.includes(name)
        ? String(value).toUpperCase()
        : value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = datosPersonalesSchema.safeParse(data);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    siguiente();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* DATOS PERSONALES */}
      <section>
        <h2 className="text-xl font-bold text-slate-800">Datos personales</h2>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <InformationCircleIcon className="h-5 w-5 shrink-0 text-emerald-800" />

          <p>
            Todos los campos marcados con <span className="font-bold">*</span>{' '}
            son obligatorios para continuar con la postulación.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-12">
          {/* Nombres */}
          <div className="lg:col-span-4">
            <InputField
              label="Nombres *"
              name="nombres"
              type="text"
              placeholder="Ingrese sus nombres"
              value={data.nombres ?? ''}
              onChange={handleChange}
              error={error.nombres}
            />
          </div>

          {/* Apellido paterno */}
          <div className="lg:col-span-4">
            <InputField
              label="Apellido paterno *"
              name="apellido_paterno"
              type="text"
              placeholder="Ingrese su apellido paterno"
              value={data.apellido_paterno ?? ''}
              onChange={handleChange}
              error={error.apellido_paterno}
            />
          </div>

          {/* Apellido materno */}
          <div className="lg:col-span-4">
            <InputField
              label="Apellido materno"
              name="apellido_materno"
              type="text"
              placeholder="Ingrese su apellido materno"
              value={data.apellido_materno ?? ''}
              onChange={handleChange}
              error={error.apellido_materno}
            />
          </div>

          {/* Documento */}
          <div className="lg:col-span-4">
            <InputField
              label="CI / Documento *"
              name="cedula_identidad"
              type="text"
              placeholder="Ej. 1234567"
              value={data.cedula_identidad ?? ''}
              onChange={handleChange}
              error={error.cedula_identidad}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="lg:col-span-4">
            <InputField
              label="Fecha de nacimiento *"
              name="fecha_nacimiento"
              type="date"
              value={data.fecha_nacimiento ?? ''}
              onChange={handleChange}
              error={error.fecha_nacimiento}
            />
          </div>

          {/* Correo */}
          <div className="lg:col-span-4">
            <InputField
              label="Correo electrónico *"
              name="correo"
              type="email"
              placeholder="ejemplo@dominio.com"
              value={data.correo ?? ''}
              onChange={handleChange}
              error={error.correo}
            />
          </div>

          {/* Teléfono */}
          <div className="lg:col-span-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Teléfono / WhatsApp <span className="text-emerald-800">*</span>
            </label>

            <div
              className={`flex min-h-11.5 overflow-hidden rounded-xl border bg-white ${
                error.numero_celular
                  ? 'border-red-500'
                  : 'border-slate-300 focus-within:border-emerald-700'
              }`}
            >
              <span className="flex items-center border-r border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-600">
                +591
              </span>

              <input
                name="numero_celular"
                type="tel"
                inputMode="numeric"
                placeholder="71234567"
                value={data.numero_celular ?? ''}
                onChange={handleChange}
                className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-800 outline-none"
              />
            </div>

            {error.numero_celular && (
              <p className="mt-1 text-sm text-red-600">
                {error.numero_celular}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* DATOS DE ACCESO */}
      <section className="mt-8 border-t border-slate-200 pt-7">
        <h2 className="text-xl font-bold text-slate-800">Datos de acceso</h2>

        {/* Información del usuario */}
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-900">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

          <div>
            <p className="font-semibold">
              Su número de Cédula de Identidad será su usuario.
            </p>

            <p className="mt-1">
              Utilizará este usuario y la contraseña que registre para ingresar
              al sistema y consultar sus postulaciones.
            </p>

            {data.cedula_identidad && (
              <p className="mt-2">
                Usuario:{' '}
                <span className="font-bold">{data.cedula_identidad}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-12">
          {/* Contraseña */}
          <div className="lg:col-span-4">
            <InputField
              label="Contraseña *"
              name="contrasenia"
              type="password"
              placeholder="Ingrese una contraseña"
              value={data.contrasenia ?? ''}
              onChange={handleChange}
              error={error.contrasenia}
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="lg:col-span-4">
            <InputField
              label="Confirmar contraseña *"
              name="confirmar_contrasenia"
              type="password"
              placeholder="Repita su contraseña"
              value={data.confirmar_contrasenia ?? ''}
              onChange={handleChange}
              error={error.confirmar_contrasenia}
            />
          </div>
        </div>
      </section>

      {/* ACCIONES */}
      <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
        <button
          type="submit"
          className="rounded-xl bg-emerald-800 px-7 py-3 font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}
