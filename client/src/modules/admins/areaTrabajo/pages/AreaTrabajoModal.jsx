import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getChangedFields } from '../../../../helpers/getChangedFields';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';
import InputField from '../../../../components/InputField';
import ConfirmModal from '../../../../components/ConfirmModal';
//
import { AreaTrabajoServices as Servs } from '../areaTrabajo.services';
import { areaTrabajoSchema } from '../areaTrabajo.schema';

const initialForm = () => ({
  nombre_area: '',
});

export default function CentroMedicoModal({
  open,
  isEdit = false,
  id,
  onClose,
  onSuccess,
  dataRow,
}) {
  const [form, setForm] = useState(initialForm());
  const [originalForm, setOriginalForm] = useState(initialForm());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [valores, setValores] = useState(null);

  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!open) return;
        setLoading(true);
        setError({});
        setForm(initialForm());

        if (isEdit) {
          const data = {
            nombre_area: dataRow?.nombre_area ?? '',
          };

          setForm(data);
          setOriginalForm(data);
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
  }, [open, isEdit, id, dataRow]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
    setError((prev) => ({ ...prev, [name]: null }));
  };
  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(originalForm, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = areaTrabajoSchema.safeParse(payload);

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
      const response = await Servs.update(dataRow.id, valores);
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
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar centro medico' : 'Crear nuevo centro medico'}
            </h3>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="md:col-span-1 lg:col-span-12">
                <InputField
                  label="Nombre del area de trabajo"
                  name="nombre_area"
                  type="text"
                  value={form.nombre_area ?? ''}
                  onChange={handleChange}
                  error={error.nombre_area}
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
