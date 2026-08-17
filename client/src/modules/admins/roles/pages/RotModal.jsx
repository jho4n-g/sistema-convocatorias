import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { getChangedFields } from '../../../../helpers/getChangedFields';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';

import InputField from '../../../../components/InputField';
import ConfirmModal from '../../../../components/ConfirmModal';

import { RolServices as Servs } from '../roles.services';
import { rolSchema, rolUpdateSchema } from '../rol.schema';

const initialForm = () => ({
  nombre_rol: '',
  permisos: [],
});

const camposMayuscula = ['nombre_rol'];

/**
 * Nombres amigables para mostrar los módulos.
 */
const nombresModulos = {
  centroMedico: 'Centro médico',
  servicioCentro: 'Servicio centro médico',
  areaTrabajo: 'Área de trabajo',
  cargoInstitucional: 'Cargo institucional',
  experienciaGeneral: 'Experiencia general',
  experienciaEspecifica: 'Experiencia específica',
  formacionAcademica: 'Formación académica',
  convocatoria: 'Convocatorias',
  postulantes: 'Postulantes',
};

export default function RolModal({
  open,
  isEdit = false,
  id,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm());
  const [originalForm, setOriginalForm] = useState(initialForm());

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [valores, setValores] = useState(null);
  const [dataPermisos, setDataPermisos] = useState([]);

  const { closeModal, isModalOpen, openModal } = useModalManager();

  // ============================================================
  // CARGAR DATOS
  // ============================================================

  useEffect(() => {
    const loadData = async () => {
      if (!open) return;

      try {
        setLoading(true);
        setError({});
        setValores(null);

        setForm(initialForm());
        setOriginalForm(initialForm());

        // --------------------------------------------------------
        // Cargar permisos
        // --------------------------------------------------------

        const resPermisos = await Servs.getPermisos();

        if (!resPermisos.ok) {
          throw new Error(
            resPermisos.message || 'No se encontraron los permisos',
          );
        }

        const permisosRecibidos = Array.isArray(resPermisos.data)
          ? resPermisos.data
          : [];

        /**
         * En tu BD actualmente tienes algunos permisos repetidos.
         *
         * Con esto evitamos mostrarlos dos veces en el frontend
         * utilizando codigo_permiso como identificador único.
         */
        const permisosUnicos = Array.from(
          new Map(
            permisosRecibidos.map((permiso) => [
              permiso.codigo_permiso,
              permiso,
            ]),
          ).values(),
        );

        setDataPermisos(permisosUnicos);

        // --------------------------------------------------------
        // Si estamos editando, cargar el rol
        // --------------------------------------------------------

        if (isEdit && id) {
          const data = await Servs.getId(id);

          if (!data.ok) {
            throw new Error(
              data.message || 'No se pudo cargar la información del rol',
            );
          }

          /**
           * Soporta cualquiera de estos formatos:
           *
           * permisos: [8, 9, 10]
           *
           * o
           *
           * permisos: [
           *   { id: 8, nombre_permiso: '...' },
           *   { id: 9, nombre_permiso: '...' }
           * ]
           */

          const permisosIds = Array.isArray(data.data.permisos)
            ? data.data.permisos
                .map((permiso) => {
                  if (typeof permiso === 'object' && permiso !== null) {
                    return Number(permiso.id);
                  }

                  return Number(permiso);
                })
                .filter((permisoId) => Number.isInteger(permisoId))
            : [];

          const formData = {
            nombre_rol: data.data.nombre_rol ?? '',
            permisos: permisosIds,
          };

          setForm(formData);
          setOriginalForm(formData);
        }
      } catch (e) {
        toast.error(
          e instanceof Error
            ? e.message
            : 'Algo salió mal, inténtelo más tarde',
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, isEdit, id]);

  // ============================================================
  // AGRUPAR PERMISOS
  // ============================================================

  const permisosAgrupados = useMemo(() => {
    return dataPermisos.reduce((acc, permiso) => {
      if (!permiso.codigo_permiso) {
        return acc;
      }

      const modulo = permiso.codigo_permiso.split('.')[0];

      if (!acc[modulo]) {
        acc[modulo] = [];
      }

      acc[modulo].push(permiso);

      return acc;
    }, {});
  }, [dataPermisos]);

  // ============================================================
  // INPUT NORMAL
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
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

  // ============================================================
  // SELECCIONAR / QUITAR UN PERMISO
  // ============================================================

  const handlePermisoChange = (permisoId) => {
    const idNumber = Number(permisoId);

    setForm((prev) => {
      const seleccionados = Array.isArray(prev.permisos) ? prev.permisos : [];

      const existe = seleccionados.includes(idNumber);

      return {
        ...prev,

        permisos: existe
          ? seleccionados.filter((idPermiso) => idPermiso !== idNumber)
          : [...seleccionados, idNumber],
      };
    });

    setError((prev) => ({
      ...prev,
      permisos: null,
    }));
  };

  // ============================================================
  // SELECCIONAR TODOS LOS PERMISOS DE UN MÓDULO
  // ============================================================

  const handleSeleccionarModulo = (permisosModulo) => {
    const idsModulo = permisosModulo.map((permiso) => Number(permiso.id));

    setForm((prev) => {
      const seleccionados = prev.permisos ?? [];

      const todosSeleccionados = idsModulo.every((permisoId) =>
        seleccionados.includes(permisoId),
      );

      if (todosSeleccionados) {
        // Quitar todos los permisos del módulo
        return {
          ...prev,

          permisos: seleccionados.filter(
            (permisoId) => !idsModulo.includes(permisoId),
          ),
        };
      }

      // Agregar permisos sin duplicarlos
      return {
        ...prev,

        permisos: [...new Set([...seleccionados, ...idsModulo])],
      };
    });

    setError((prev) => ({
      ...prev,
      permisos: null,
    }));
  };

  // ============================================================
  // VALIDACIÓN
  // ============================================================

  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(originalForm, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = isEdit
      ? rolUpdateSchema.safeParse(payload)
      : rolSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setError(fieldErrors);

      toast.error('Datos incorrectos');

      return;
    }

    setValores(result.data);

    openModal(isEdit ? MODALS.EDIT : MODALS.CREATE);
  };

  // ============================================================
  // CREAR
  // ============================================================

  const handleCreate = async () => {
    try {
      setLoading(true);

      const response = await Servs.create(valores);

      if (!response.ok) {
        throw new Error(response.message || 'No se pudo crear el rol');
      }

      toast.success(response.message || 'Se creó exitosamente el rol');

      closeModal();

      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      closeModal();

      const message =
        e instanceof Error ? e.message : 'Error interno del sistema';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ACTUALIZAR
  // ============================================================

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const response = await Servs.update(id, valores);

      if (!response.ok) {
        throw new Error(response.message || 'No se pudo actualizar el rol');
      }

      toast.success(response.message || 'Se actualizó exitosamente el rol');

      closeModal();

      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      closeModal();

      const message =
        e instanceof Error ? e.message : 'Error interno del sistema';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SI EL MODAL ESTÁ CERRADO
  // ============================================================

  if (!open) {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        {/* Fondo */}
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/40"
        />

        {/* Modal */}
        <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {isEdit ? 'Editar rol' : 'Crear nuevo rol'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Seleccione los permisos que tendrá este rol.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ================================================= */}
          {/* BODY */}
          {/* ================================================= */}

          <div className="min-h-0 flex-1 overflow-y-auto bg-white p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* ============================================= */}
              {/* NOMBRE DEL ROL */}
              {/* ============================================= */}

              <div className="lg:col-span-12">
                <div className="max-w-md">
                  <InputField
                    label="Nombre del rol"
                    name="nombre_rol"
                    placeholder="Ingrese el nombre del rol"
                    type="text"
                    value={form.nombre_rol ?? ''}
                    onChange={handleChange}
                    error={error.nombre_rol}
                  />
                </div>
              </div>

              {/* ============================================= */}
              {/* PERMISOS */}
              {/* ============================================= */}

              <div className="lg:col-span-12">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Permisos
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Seleccionados:{' '}
                      <span className="font-semibold text-slate-700">
                        {form.permisos?.length ?? 0}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Error permisos */}
                {error.permisos && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">
                      {Array.isArray(error.permisos)
                        ? error.permisos.join(', ')
                        : error.permisos}
                    </p>
                  </div>
                )}

                {/* Loading */}
                {loading && dataPermisos.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500">
                      Cargando permisos...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(permisosAgrupados).map(
                      ([modulo, permisosModulo]) => {
                        const todosSeleccionados = permisosModulo.every(
                          (permiso) =>
                            form.permisos?.includes(Number(permiso.id)),
                        );

                        return (
                          <div
                            key={modulo}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                          >
                            {/* CABECERA DEL MÓDULO */}

                            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                              <label className="flex cursor-pointer items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={todosSeleccionados}
                                  onChange={() =>
                                    handleSeleccionarModulo(permisosModulo)
                                  }
                                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-emerald-700"
                                />

                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {nombresModulos[modulo] ?? modulo}
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    {permisosModulo.length} permisos
                                  </p>
                                </div>
                              </label>
                            </div>

                            {/* LISTA DE PERMISOS */}

                            <div className="p-2">
                              {permisosModulo.map((permiso) => {
                                const permisoId = Number(permiso.id);

                                const checked =
                                  form.permisos?.includes(permisoId) ?? false;

                                return (
                                  <label
                                    key={permiso.id}
                                    className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition hover:bg-slate-50"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() =>
                                        handlePermisoChange(permisoId)
                                      }
                                      className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 accent-emerald-700"
                                    />

                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-slate-700">
                                        {permiso.nombre_permiso}
                                      </p>

                                      <p className="mt-0.5 break-all text-xs text-slate-400">
                                        {permiso.codigo_permiso}
                                      </p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}

                {dataPermisos.length === 0 && !loading && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                    <p className="text-sm text-slate-500">
                      No se encontraron permisos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <div className="flex justify-end gap-2 p-5">
            <button
              className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-emerald-800 px-3 py-2 text-white hover:bg-emerald-900"
              onClick={handleValidation}
            >
              {isEdit ? 'Editar cambios' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* CONFIRM MODAL */}
      {/* ===================================================== */}

      <ConfirmModal
        open={isModalOpen(isEdit ? MODALS.EDIT : MODALS.CREATE)}
        onClose={closeModal}
        loading={loading}
        onConfirm={isEdit ? handleUpdate : handleCreate}
        title={isEdit ? '¿Confirmar edición?' : '¿Confirmar creación?'}
      />
    </>
  );
}
