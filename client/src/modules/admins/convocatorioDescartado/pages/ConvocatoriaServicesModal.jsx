import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getChangedFields } from '../../../../helpers/getChangedFields';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';
import InputField from '../../../../components/InputField';
import TextAreaField from '../../../../components/TextAreaField';
import Select from '../../../../components/Select';
import ConfirmModal from '../../../../components/ConfirmModal';
//
import { ConvocatoriaServices as Servs } from '../convocatoria.services';
import {
  convocatoriaSchema,
  convocatoriaUpdateSchema,
} from '../convocatoria.schema';

const initialForm = () => ({
  titulo: '',
  cargo: '',
  area: '',
  experiencia_minima: '',
  nivel_academico: '',
  objetivo_cargo: '',
  descripcion: '',
});

export default function PersonaModal({
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
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();
  //

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!open) return;
        setLoading(true);
        setError({});
        setForm(initialForm());

        if (isEdit && id) {
          const response = await Servs.getId(id);
          if (!response.ok) {
            throw Error('No se pudo cargar la convocatoria');
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
      [name]: value,
    }));
    setError((prev) => ({ ...prev, [name]: null }));
  };

  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(originalForm, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = isEdit
      ? convocatoriaUpdateSchema.safeParse(payload)
      : convocatoriaSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      console.log(result.error.flatten().fieldErrors);
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
        throw new Error(response.message || 'No se pudo crear el regestro');
      }
      toast.success(response.message || 'Se creo exitosamente el registro');

      setForm(initialForm());
      setError({});
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
          className="relative z-10 w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar usuario' : 'Crear nuevo usuario'}
            </h3>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Titulo"
                  name="titulo"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.titulo ?? ''}
                  onChange={handleChange}
                  error={error.titulo}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Cargo"
                  name="cargo"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.cargo ?? ''}
                  onChange={handleChange}
                  error={error.cargo}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Area"
                  name="area"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.area ?? ''}
                  onChange={handleChange}
                  error={error.area}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Cantidad personal"
                  name="cantidad_personal"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.cantidad_personal ?? ''}
                  onChange={handleChange}
                  error={error.cantidad_personal}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Expriencia minima expresada en meses"
                  name="experiencia_minima"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.experiencia_minima ?? ''}
                  onChange={handleChange}
                  error={error.experiencia_minima}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Nivel academico"
                  name="nivel_academico"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.nivel_academico ?? ''}
                  onChange={handleChange}
                  error={error.nivel_academico}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-6 space-y-4">
                <TextAreaField
                  label="Objetivo del cargo"
                  name="objetivo_cargo"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.objetivo_cargo ?? ''}
                  onChange={handleChange}
                  error={error.objetivo_cargo}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-6 space-y-4">
                <TextAreaField
                  label="descripcion"
                  name="objetidescripcionvo_cargo"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.descripcion ?? ''}
                  onChange={handleChange}
                  error={error.descripcion}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-5">
            <button
              className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
              onClick={() => {
                setForm(initialForm());
                setError({});
                onClose();
              }}
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
