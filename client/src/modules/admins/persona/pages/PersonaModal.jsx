import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getChangedFields } from '../../../../helpers/getChangedFields';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';
import InputField from '../../../../components/InputField';
import Select from '../../../../components/Select';
import ConfirmModal from '../../../../components/ConfirmModal';
//
import { PersonaServices as Servs } from '../persona.services';
import {
  personaAdminSchema,
  personaAdminUpdateSchema,
} from '../persona.schemas';

const initialForm = () => ({
  cedula_identidad: '',
  correo: '',
  rol_id: 0,
  servicio_id: 0,
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimento: '',
  numero_celular: '',
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
  const [dataCentrosMedicos, setDataCentrosMedicos] = useState([]);
  const [dataServiciosCentro, setDataServiciosCentro] = useState([]);
  const [dataRoles, setDataRoles] = useState([]);

  const [datoCentroMedico, setDatoCentroMedico] = useState('');
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!open) return;
        setLoading(true);
        const resCentrosMedico = await Servs.getSelectCentros();
        if (!resCentrosMedico?.ok) {
          throw new Error('No se puede cargar los centros medicos');
        }
        setDataCentrosMedicos(
          Array.isArray(resCentrosMedico?.data) ? resCentrosMedico.data : [],
        );
        const resRoles = await Servs.getSelectRoles();
        if (!resRoles?.ok) {
          throw new Error('No se puede cargar los centros medicos');
        }
        setDataRoles(Array.isArray(resRoles?.data) ? resRoles.data : []);
        setError({});
        setForm(initialForm());

        if (isEdit && id) {
          const response = await Servs.getId(id);
          if (!response.ok) {
            throw Error('No se pudo cargar el usuario');
          }

          if (
            !Number.isInteger(Number(response.data.servicio_id)) ||
            !Number.isInteger(Number(response.data.centro_medico_id)) ||
            !Number.isInteger(Number(response.data.rol_id))
          ) {
            throw new Error('Error al cargar los complementos');
          }
          setDatoCentroMedico(response.data.centro_medico_id);

          const resCentros = await Servs.getSelectCentros();
          setDataCentrosMedicos(
            Array.isArray(resCentros.data) ? resCentros.data : [],
          );
          const resServices = await Servs.getSelectServicios(
            response.data.centro_medico_id,
          );
          setDataServiciosCentro(
            Array.isArray(resServices.data) ? resServices.data : [],
          );

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

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!open) return;
        if (!datoCentroMedico) {
          setDataServiciosCentro([]);
        } else {
          const resServices = await Servs.getSelectServicios(datoCentroMedico);
          if (!resServices.ok) {
            throw new Error(
              resServices.message ||
                'No se pude cargar los servicios del centro',
            );
          }
          setDataServiciosCentro(
            Array.isArray(resServices.data) ? resServices.data : [],
          );
        }
      } catch (e) {
        setDataServiciosCentro([]);
        toast.error(
          e instanceof Error
            ? e.message
            : 'Algo salió mal, inténtelo más tarde',
        );
      } finally {
      }
    };
    loadData();
  }, [datoCentroMedico]);

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
      ? personaAdminUpdateSchema.safeParse(payload)
      : personaAdminSchema.safeParse(payload);

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
        throw new Error(response.message || 'No se pudo crear el regestro');
      }
      toast.success(response.message || 'Se creo exitosamente el registro');

      setForm(initialForm());
      setDataCentrosMedicos(null);
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
          className="relative z-10 w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
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
                  label="Cedula de indentidad"
                  name="cedula_identidad"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.cedula_identidad ?? ''}
                  onChange={handleChange}
                  error={error.cedula_identidad}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Nombres"
                  name="nombres"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.nombres ?? ''}
                  onChange={handleChange}
                  error={error.nombres}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Apellido paterno"
                  name="apellido_paterno"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.apellido_paterno ?? ''}
                  onChange={handleChange}
                  error={error.apellido_paterno}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Apellido materno"
                  name="apellido_materno"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.apellido_materno ?? ''}
                  onChange={handleChange}
                  error={error.apellido_materno}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Fecha de nacimiento"
                  name="fecha_nacimento"
                  placeholder="Ingrese el dato..."
                  type="date"
                  value={form.fecha_nacimento ?? ''}
                  onChange={handleChange}
                  error={error.fecha_nacimento}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Numero de celular"
                  name="numero_celular"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.numero_celular ?? ''}
                  onChange={handleChange}
                  error={error.numero_celular}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <InputField
                  label="Correo"
                  name="correo"
                  placeholder="Ingrese el dato..."
                  type="text"
                  value={form.correo ?? ''}
                  onChange={handleChange}
                  error={error.correo}
                />
              </div>

              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <Select
                  label="Seleccionar centro medico"
                  name="centro_medico_id"
                  options={dataCentrosMedicos}
                  value={datoCentroMedico}
                  onChange={(e) => {
                    const centroMedicoId = e.target.value;
                    setDatoCentroMedico(centroMedicoId);
                    setForm((prev) => ({
                      ...prev,
                      servicio_id: '',
                    }));
                    setError((prev) => ({
                      ...prev,
                      servicio_id: null,
                    }));
                  }}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <Select
                  label="Seleccionar servicio"
                  name="servicio_id"
                  options={dataServiciosCentro}
                  value={form?.servicio_id ?? ''}
                  onChange={handleChange}
                  error={error.servicio_id}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4 space-y-4">
                <Select
                  label="Seleccionar un rol"
                  name="rol_id"
                  options={dataRoles}
                  value={form.rol_id}
                  onChange={handleChange}
                  error={error.rol_id}
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
