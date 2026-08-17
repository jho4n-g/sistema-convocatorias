import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getChangedFields } from '../../../../helpers/getChangedFields';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';
import InputField from '../../../../components/InputField';
import ConfirmModal from '../../../../components/ConfirmModal';
import Select from '../../../../components/Select.jsx';
//
import { FormacionAcademicaServices as Servs } from '../formacionAcademica.services.js';
import {
  formacionAcademicaSchema,
  formacionAcademicaUpdateSchema,
} from '../formacionAcademica.schema.js';
import MultiSelect from '../../../../components/MultiSelect.jsx';

const initialForm = () => ({
  nombre_formacion: '',
  area_trabajo_ids: [],
});

const camposMayuscula = ['nombre_formacion'];

export default function CargoInstitucionalModal({
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

  const [dataAreaTrabajo, setDataAreaTrabajo] = useState([]);

  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!open) return;
        setLoading(true);
        setError({});
        setForm(initialForm());

        const resAreaTrabajo = await Servs.getSelectAreaTrabajo();

        if (!resAreaTrabajo.ok) {
          throw new Error(
            resAreaTrabajo.message || 'No se pudo obtener las areas de trabajo',
          );
        }

        setDataAreaTrabajo(
          Array.isArray(resAreaTrabajo.data) ? resAreaTrabajo.data : [],
        );

        if (isEdit && id) {
          const response = await Servs.getId(id);

          if (!response.ok) {
            throw new Error(
              response.message || 'No se pudo obtener el cargo institucional',
            );
          }

          setForm(response.data);
          setOriginalForm(response.data);
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

  if (!open) return null;

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
  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(originalForm, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = isEdit
      ? formacionAcademicaUpdateSchema.safeParse(payload)
      : formacionAcademicaSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }
    setValores(result.data);

    openModal(isEdit ? MODALS.EDIT : MODALS.CREATE);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const response = await Servs.create(valores);
      if (!response.ok) {
        closeModal();
        throw new Error(
          response.message || 'No se pude crear el centro medico',
        );
      }
      toast.success(
        response.message || 'Se creo exitosamente el centro medico',
      );
      closeModal();
      onSuccess();
    } catch (e) {
      closeModal();
      const message =
        e instanceof Error ? e.message : 'Error interno del sistema';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await Servs.update(id, valores);

      if (!response.ok) {
        throw new Error(
          response.message || 'No se pude actualizar el centro medico',
        );
      }
      toast.success(
        response.message || 'Se actualizo exitisamente el centro medico',
      );
      closeModal();
      onSuccess();
    } catch (e) {
      closeModal();
      const message =
        e instanceof Error ? e.message : 'Error interno del sistema';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay (fondo) */}
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/40"
        />
        <div
          className="relative z-10 w-xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/80">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-700" />

                <span className="text-sm font-medium text-slate-700">
                  Cargando...
                </span>
              </div>
            </div>
          )}
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar centro medico' : 'Crear nuevo centro medico'}
            </h3>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="md:col-span-1 lg:col-span-12">
                <InputField
                  label="Formacion academica"
                  name="nombre_formacion"
                  type="text"
                  value={form.nombre_formacion ?? ''}
                  onChange={handleChange}
                  error={error.nombre_formacion}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-12">
                <MultiSelect
                  label="Selecciona un area de trabajo"
                  name="area_trabajo_ids"
                  options={dataAreaTrabajo}
                  value={form?.area_trabajo_ids ?? []}
                  onChange={handleChange}
                  error={error.area_trabajo_ids}
                />
              </div>
            </div>
          </div>
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
