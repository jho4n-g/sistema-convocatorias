import { useRef, useState } from 'react';
import {
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentCheckIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import InputField from '../../../components/InputField';
import Select from '../../../components/Select';
import { PostulanteSerivices } from '../postulante.services';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { datosFormacionAcademica } from '../schemas/pasoFormacionAcademica.schema';

export const initialFormacion = {
  nivel_academico_id: '',
  titulo: '',
  institucion: '',
  estado: '',
};

const estadosAcademicos = [
  { value: 'EN_CURSO', label: 'EN CURSO' },
  { value: 'FINALIZADO', label: 'FINALIZADO' },
  { value: 'PENDIENTE', label: 'PENDIENTE' },
];
const camposMayuscula = ['titulo', 'institucion'];

export default function PasoFormacionAcademica({
  data,
  setData,
  formaciones = [],
  setFormaciones,
  anterior,
  siguiente,
}) {
  const inputFileRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [error, setError] = useState({});
  const [mensajePaso, setMensajePaso] = useState('');
  //
  const [dataNivelAcademico, setDataNivelAcademico] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const resNivelAcademico =
        await PostulanteSerivices.getSelectNivelAcademico();

      if (!resNivelAcademico.ok) {
        throw new Error(
          resNivelAcademico.message ||
            'No se pudo cargar los niveles academicos',
        );
      }
      setDataNivelAcademico(
        Array.isArray(resNivelAcademico.data) ? resNivelAcademico.data : [],
      );
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: camposMayuscula.includes(name)
        ? String(value).toUpperCase()
        : value,
    }));

    setError((prev) => ({ ...prev, [name]: null }));
  };

  const limpiarFormulario = () => {
    setData(initialFormacion);
    setIdEdicion(null);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleGuardarFormacion = () => {
    const result = datosFormacionAcademica.safeParse(data);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    const nuevaFormacion = {
      ...data,
      id_temporal: idEdicion ?? crypto.randomUUID(),
    };

    setFormaciones((prev) => {
      if (idEdicion) {
        return prev.map((formacion) =>
          formacion.id_temporal === idEdicion ? nuevaFormacion : formacion,
        );
      }

      return [...prev, nuevaFormacion];
    });

    limpiarFormulario();
    setMensajePaso('');
  };

  const handleEditar = (formacion) => {
    setData({
      nivel_academico_id: formacion.nivel_academico_id ?? '',
      titulo: formacion.titulo ?? '',
      institucion: formacion.institucion ?? '',
      estado: formacion.estado ?? '',
    });

    setIdEdicion(formacion.id_temporal);
    setMensajePaso('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleEliminar = (idTemporal) => {
    setFormaciones((prev) =>
      prev.filter((formacion) => formacion.id_temporal !== idTemporal),
    );

    if (idEdicion === idTemporal) {
      limpiarFormulario();
    }
  };

  const obtenerNivel = (nivelId) => {
    return (
      dataNivelAcademico.find(
        (nivel) => String(nivel.value) === String(nivelId),
      )?.label ?? 'No especificado'
    );
  };

  const obtenerEstado = (estado) => {
    return (
      estadosAcademicos.find((item) => item.value === estado)?.label ??
      'No especificado'
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formaciones.length === 0) {
      toast.info(
        'Debe agregar al menos una formación académica para continuar.',
      );
      return;
    }

    siguiente();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      {/* Encabezado */}
      <section>
        <h2 className="text-2xl font-bold text-emerald-950">
          Formación académica y posgrados
        </h2>

        <div className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" />

          <div className="text-sm text-emerald-900">
            <p>
              Registre su formación profesional principal y, si corresponde, sus
              especialidades, maestrías o doctorados.
            </p>

            <p className="mt-1">
              Los campos marcados con <span className="font-bold">*</span> son
              obligatorios.
            </p>
          </div>
        </div>
      </section>

      {/* Campos */}
      <section className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <Select
          label="Nivel académico *"
          name="nivel_academico_id"
          placeholder="Seleccione un nivel académico"
          options={dataNivelAcademico}
          value={data.nivel_academico_id ?? ''}
          onChange={handleChange}
          error={error.nivel_academico_id}
        />

        <Select
          label="Estado académico *"
          name="estado"
          placeholder="Seleccione el estado"
          options={estadosAcademicos}
          value={data.estado ?? ''}
          onChange={handleChange}
          error={error.estado}
        />

        <InputField
          label="Título o formación obtenida *"
          name="titulo"
          type="text"
          placeholder="Ej. Ingeniería de Sistemas"
          value={data.titulo ?? ''}
          onChange={handleChange}
          error={error.titulo}
        />

        <InputField
          label="Institución *"
          name="institucion"
          type="text"
          placeholder="Ej. Universidad Mayor de San Simón"
          value={data.institucion ?? ''}
          onChange={handleChange}
          error={error.institucion}
        />
      </section>

      {/* Guardar registro */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleGuardarFormacion}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-900"
        >
          {idEdicion ? (
            <PencilSquareIcon className="h-5 w-5" />
          ) : (
            <PlusCircleIcon className="h-5 w-5" />
          )}

          {idEdicion ? 'Guardar cambios' : 'Agregar formación'}
        </button>
      </div>

      {mensajePaso && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {mensajePaso}
        </p>
      )}

      {/* Formaciones agregadas */}
      <section className="mt-8">
        <h3 className="text-lg font-bold text-emerald-950">
          Formaciones registradas
        </h3>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left">
              <thead className="bg-emerald-50 text-sm text-emerald-950">
                <tr>
                  <th className="px-4 py-3">Nivel</th>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Institución</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {formaciones.length > 0 ? (
                  formaciones.map((formacion) => (
                    <tr
                      key={formacion.id_temporal}
                      className="text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 font-medium">
                        {obtenerNivel(formacion.nivel_academico_id)}
                      </td>

                      <td className="px-4 py-4">{formacion.titulo}</td>

                      <td className="px-4 py-4">{formacion.institucion}</td>

                      <td className="px-4 py-4">
                        {obtenerEstado(formacion.estado)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleEditar(formacion)}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEliminar(formacion.id_temporal)
                            }
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
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
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      Todavía no registró ninguna formación académica.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Navegación */}
      <footer className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-8 py-3 font-semibold text-white transition hover:bg-emerald-900"
        >
          Siguiente
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </footer>
    </form>
  );
}
