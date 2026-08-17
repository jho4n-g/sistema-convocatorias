import { useRef, useState } from 'react';
import {
  ArrowUpTrayIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import InputField from '../../../components/InputField';
import Select from '../../../components/Select';
import TextAreaField from '../../../components/TextAreaField';

import { datosExperienciaSchema } from '../schemas/pasoExperienciaLaboral.schema';
const camposMayuscula = [
  'cargo_puesto',
  'empresa_institucion',
  'area',
  'gestion',
];

export const initialExperiencia = {
  cargo_puesto: '',
  empresa_institucion: '',
  area: '',
  gestion: '',
};

const generarIdTemporal = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const esArchivo = (archivo) => {
  return typeof File !== 'undefined' && archivo instanceof File;
};

export default function PasoExperienciaLaboral({
  data,
  setData,
  experiencias = [],
  setExperiencias,

  trabajoEnInstitucion,
  setTrabajoEnInstitucion,

  anterior,
  siguiente,
}) {
  const inputFileRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setData((prev) => ({
      ...prev,

      [name]: camposMayuscula.includes(name)
        ? String(value).toUpperCase()
        : type === 'checkbox'
          ? checked
          : value,
    }));
    setError((prev) => ({ ...prev, [name]: null }));
  };

  const handleDetalleInstitucionChange = (e) => {
    const { name, value } = e.target;

    setAntecedenteInstitucional((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMensaje('');
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const limpiarFormulario = () => {
    setData({
      ...initialExperiencia,
    });

    setIdEdicion(null);
    setMensaje('');

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const validarDatosExperiencia = () => {
    const result = datosExperienciaSchema.safeParse(data);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return false;
    }

    return true;
  };

  const handleGuardarExperiencia = () => {
    if (!validarDatosExperiencia()) {
      return;
    }

    const nuevaExperiencia = {
      ...data,
      cargo_puesto: data.cargo_puesto.trim(),
      empresa_institucion: data.empresa_institucion.trim(),
      area: data.area?.trim() ?? '',

      id_temporal: idEdicion ?? generarIdTemporal(),
    };

    setExperiencias((prev) => {
      if (idEdicion) {
        return prev.map((item) =>
          item.id_temporal === idEdicion ? nuevaExperiencia : item,
        );
      }

      return [...prev, nuevaExperiencia];
    });

    limpiarFormulario();
  };

  const handleEditar = (experiencia) => {
    setData({
      cargo_puesto: experiencia.cargo_puesto ?? '',
      empresa_institucion: experiencia.empresa_institucion ?? '',
      area: experiencia.area ?? '',
      gestion: experiencia.gestion ?? '',
    });

    setIdEdicion(experiencia.id_temporal);
    setMensaje('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleEliminar = (idTemporal) => {
    setExperiencias((prev) =>
      prev.filter((item) => item.id_temporal !== idTemporal),
    );

    if (idEdicion === idTemporal) {
      limpiarFormulario();
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';

    const [year, month, day] = fecha.split('-');

    if (!year || !month || !day) {
      return fecha;
    }

    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMensaje('');
    siguiente();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      {/* Título principal */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <BriefcaseIcon className="h-6 w-6 text-emerald-800" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-emerald-950">
              Experiencia laboral
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registre su experiencia profesional y antecedentes en la
              institución.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" />

          <p className="text-sm leading-6 text-emerald-900">
            Todos los campos marcados con <span className="font-bold">*</span>{' '}
            son obligatorios. Puede registrar más de una experiencia laboral.
          </p>
        </div>
      </section>

      {/* Antecedente institucional */}
      <section className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
        <div className="flex items-start gap-3">
          <BuildingOffice2Icon className="mt-0.5 h-6 w-6 shrink-0 text-emerald-800" />

          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              Antecedente en la institución
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Esta información es independiente de las experiencias laborales
              que registrará más abajo.
            </p>
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-slate-800">
            ¿Trabajó anteriormente en la Caja Nacional de Salud?{' '}
            <span className="text-red-600">*</span>
          </legend>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-3 transition ${
                trabajoEnInstitucion === true
                  ? 'border-emerald-700 bg-white ring-2 ring-emerald-700/10'
                  : 'border-slate-300 bg-white hover:border-emerald-400'
              }`}
            >
              <input
                type="radio"
                name="trabajo_en_institucion"
                checked={trabajoEnInstitucion === true}
                onChange={() => setTrabajoEnInstitucion(true)}
                className="h-4 w-4 accent-emerald-800"
              />

              <span className="text-sm font-semibold text-slate-700">Sí</span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-3 transition ${
                trabajoEnInstitucion === false
                  ? 'border-emerald-700 bg-white ring-2 ring-emerald-700/10'
                  : 'border-slate-300 bg-white hover:border-emerald-400'
              }`}
            >
              <input
                type="radio"
                name="trabajo_en_institucion"
                checked={trabajoEnInstitucion === false}
                onChange={() => setTrabajoEnInstitucion(false)}
                className="h-4 w-4 accent-emerald-800"
              />

              <span className="text-sm font-semibold text-slate-700">No</span>
            </label>
          </div>
        </fieldset>
      </section>

      {/* Formulario de experiencia */}
      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              {idEdicion
                ? 'Editar experiencia laboral'
                : 'Agregar experiencia laboral'}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Complete la información de una experiencia y agréguela a la tabla.
            </p>
          </div>

          {idEdicion && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <InputField
              label="Cargo / puesto *"
              name="cargo_puesto"
              type="text"
              placeholder="Ej. Analista de Sistemas"
              value={data.cargo_puesto ?? ''}
              onChange={handleChange}
              error={error.cargo_puesto}
            />
          </div>

          <div className="lg:col-span-4">
            <InputField
              label="Empresa / institución *"
              name="empresa_institucion"
              type="text"
              placeholder="Ej. Soluciones Integradas S.A."
              value={data.empresa_institucion ?? ''}
              onChange={handleChange}
              error={error.empresa_institucion}
            />
          </div>

          <div className="lg:col-span-4">
            <InputField
              label="Área"
              name="area"
              type="text"
              placeholder="Ej. Tecnología de la Información"
              value={data.area ?? ''}
              onChange={handleChange}
              error={error.area}
            />
          </div>

          <div className="lg:col-span-4">
            <InputField
              label="Gestion *"
              name="gestion"
              type="text"
              value={data.gestion ?? ''}
              onChange={handleChange}
              error={error.gestion}
            />
          </div>
        </div>
      </section>

      {/* Agregar experiencia */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleGuardarExperiencia}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
        >
          {idEdicion ? (
            <PencilSquareIcon className="h-5 w-5" />
          ) : (
            <PlusCircleIcon className="h-5 w-5" />
          )}

          {idEdicion ? 'Guardar cambios' : 'Agregar experiencia'}
        </button>
      </div>

      {mensaje && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <p className="text-sm text-red-700">{mensaje}</p>
        </div>
      )}

      {/* Tabla */}
      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              Experiencias registradas
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {experiencias.length}{' '}
              {experiencias.length === 1
                ? 'experiencia registrada'
                : 'experiencias registradas'}
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-237.5 text-left">
              <thead className="bg-slate-50 text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Cargo / puesto</th>
                  <th className="px-4 py-3">Empresa / institución</th>
                  <th className="px-4 py-3">Área</th>
                  <th className="px-4 py-3">Periodo</th>

                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {experiencias.length > 0 ? (
                  experiencias.map((item) => (
                    <tr
                      key={item.id_temporal}
                      className="text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {item.cargo_puesto}
                      </td>

                      <td className="px-4 py-4">{item.empresa_institucion}</td>

                      <td className="px-4 py-4">
                        {item.area || 'No especificada'}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        {item.gestion}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleEditar(item)}
                            className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 transition hover:text-emerald-900"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEliminar(item.id_temporal)}
                            className="inline-flex items-center gap-1.5 font-semibold text-red-600 transition hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Todavía no registró ninguna experiencia laboral.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Navegación */}
      <footer className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={anterior}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Anterior
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-8 py-3 font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
        >
          Siguiente
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </footer>
    </form>
  );
}
