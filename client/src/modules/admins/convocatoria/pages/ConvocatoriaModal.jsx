import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getChangedFields } from '../../../../helpers/getChangedFields';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';
import InputField from '../../../../components/InputField';
import Select from '../../../../components/Select';
import MultiSelect from '../../../../components/MultiSelect';
import TextAreaField from '../../../../components/TextAreaField';
import ConfirmModal from '../../../../components/ConfirmModal';
//
import { ConvocatoriaServices as Servs } from '../convocatoria.services';
import {
  convocatoriaSchema,
  convocatoriaUpdateSchema,
} from '../convocatoria.schema';

const initialForm = () => ({
  cargo_institucional_id: '',
  experiencia_general_id: '',
  servicio_revisor_id: '',
  cantidad_personal: '',
  objetivo_cargo: '',
  titulo_cargo: '',
  descripcion: '',
  estado: '',
  fecha_publicacion: '',
  fecha_cierre: '',
  formacion_academica_ids: [],
  experiencia_especifica_ids: [],
});

const camposMayuscula = ['objetivo_cargo', 'descripcion', 'titulo_cargo'];

export default function CentroMedicoModal({
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

  const [dataAreaTrabajo, setDataAreaTrabajo] = useState([]);
  const [valorAreaTrabajo, setValorAreaTrabajo] = useState([]);
  const [dataCargoInstitucional, setDataCargoInstitucional] = useState([]); //
  const [dataFormacionAcademica, setDataFormacionAcademica] = useState([]); //
  //
  const [dataCentroMedico, setDataCentroMedico] = useState([]);
  const [valorCentroMedico, setValorCentroMedico] = useState([]);
  const [dataServicioMedico, setDataServicioMedico] = useState([]); //
  //
  const [dataExperienciaEspecifica, setDataExperienciaEspecifica] = useState(
    [],
  );
  const [dataExperienciaGeneral, setDataExperienciaGeneral] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!open) return;
        setLoading(true);
        setError({});
        setForm(initialForm());

        const resAreaTrabajo = await Servs.getSelectAreaTrabajo();

        if (!resAreaTrabajo) {
          throw new Error(
            resAreaTrabajo.message || 'No se pudo cargar las aras de trabajo',
          );
        }
        setDataAreaTrabajo(
          Array.isArray(resAreaTrabajo.data) ? resAreaTrabajo.data : [],
        );

        const resCentroMedico = await Servs.getSelectCentroMedico();
        if (!resCentroMedico.ok) {
          throw new Error(
            resCentroMedico.message || 'No se pudo cargar los centros medicos',
          );
        }
        setDataCentroMedico(
          Array.isArray(resCentroMedico.data) ? resCentroMedico.data : [],
        );

        const resExperienciaGeneral = await Servs.getSelectExperienciaGeneral();
        if (!resExperienciaGeneral.ok) {
          throw new Error(
            resExperienciaGeneral.message ||
              'No se pudo cargar la experiencia general',
          );
        }

        setDataExperienciaGeneral(
          Array.isArray(resExperienciaGeneral.data)
            ? resExperienciaGeneral.data
            : [],
        );

        const resExperienciaEspecifica =
          await Servs.getSelectExperienciaEspecifica();

        if (!resExperienciaEspecifica.ok) {
          throw new Error(
            resExperienciaEspecifica.message ||
              'No se pudo cargar la experiencia especifica',
          );
        }

        setDataExperienciaEspecifica(
          Array.isArray(resExperienciaEspecifica.data)
            ? resExperienciaEspecifica.data
            : [],
        );

        if (isEdit && id) {
          const data = await Servs.getId(id);

          if (!data.ok) {
            throw new Error(
              data.message || 'No se pudo cargar la convocatoria',
            );
          }
          setValorAreaTrabajo(data?.data?.area_trabajo_id);
          setValorCentroMedico(data?.data?.centro_medico_id);

          setForm(data.data);
          setOriginalForm(data.data);
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
        setLoading(true);

        if (!valorAreaTrabajo) {
          setDataCargoInstitucional([]);
          setDataFormacionAcademica([]);
        } else {
          const resCargosInst =
            await Servs.getSelectCargoInstitucional(valorAreaTrabajo);

          if (!resCargosInst.ok) {
            throw new Error('No se pudo cargar los cargos institucionales');
          }

          setDataCargoInstitucional(
            Array.isArray(resCargosInst.data) ? resCargosInst.data : [],
          );
          const resFormAcad =
            await Servs.getSelectFormacionAcademica(valorAreaTrabajo);

          if (!resFormAcad.ok) {
            throw new Error('No se pudo cargar la formacion academica');
          }
          setDataFormacionAcademica(
            Array.isArray(resFormAcad.data) ? resFormAcad.data : [],
          );
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
  }, [valorAreaTrabajo]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!open) return;
        setLoading(true);
        if (!valorCentroMedico) {
          setDataServicioMedico([]);
        } else {
          const resServicioMedico =
            await Servs.getSelectServicioMedico(valorCentroMedico);
          if (!resServicioMedico.ok) {
            throw new Error('No se pudo cargar los centros medico');
          }
          setDataServicioMedico(
            Array.isArray(resServicioMedico.data) ? resServicioMedico.data : [],
          );
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
  }, [valorCentroMedico]);
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
      ? convocatoriaUpdateSchema.safeParse(payload)
      : convocatoriaSchema.safeParse(payload);

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
        <div className="   relative z-10 flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {isEdit ? 'Editar convocatoria' : 'Crear nueva convocatoria'}
              </h3>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-white sm:p-6 mb-2">
            <fieldset className="border border-slate-300 shadow mb-2 p-10 rounded-lg">
              <legend>Cuandro de equivalencias</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-1 lg:col-span-3">
                  <Select
                    label="Seleccione area de trabajo"
                    options={dataAreaTrabajo}
                    value={valorAreaTrabajo}
                    onChange={(e) => {
                      setValorAreaTrabajo(e.target.value);
                    }}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <Select
                    label="Seleccione cargo institucional"
                    name={'cargo_institucional_id'}
                    options={dataCargoInstitucional}
                    value={form?.cargo_institucional_id}
                    onChange={handleChange}
                    error={error.cargo_institucional_id}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Titulo del cargo"
                    name="titulo_cargo"
                    placeholder="Ingreso el valor requerido"
                    type="text"
                    value={form.titulo_cargo ?? ''}
                    onChange={handleChange}
                    error={error.titulo_cargo}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <MultiSelect
                    label="Seleccione formacion academica"
                    name={'formacion_academica_ids'}
                    options={dataFormacionAcademica}
                    value={form?.formacion_academica_ids}
                    onChange={handleChange}
                    error={error.formacion_academica_ids}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-3">
                  <Select
                    label="Seleccione experiencia general"
                    name={'experiencia_general_id'}
                    options={dataExperienciaGeneral}
                    value={form?.experiencia_general_id}
                    onChange={handleChange}
                    error={error.experiencia_general_id}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <MultiSelect
                    label="Seleccione experiencia especifica"
                    name={'experiencia_especifica_ids'}
                    options={dataExperienciaEspecifica}
                    value={form?.experiencia_especifica_ids}
                    onChange={handleChange}
                    error={error.experiencia_especifica_ids}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-3">
                  <Select
                    label="Seleccione estado"
                    name={'estado'}
                    options={[
                      { value: 'BORRADOR', label: 'BORRADOR' },
                      { value: 'PUBLICADO', label: 'PUBLICADO' },
                      { value: 'ANULADO', label: 'ANULADO' },
                    ]}
                    value={form?.estado}
                    onChange={handleChange}
                    error={error.estado}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Fecha publicacion"
                    name="fecha_publicacion"
                    placeholder="Ingreso el valor requerido"
                    type="date"
                    value={form.fecha_publicacion ?? ''}
                    onChange={handleChange}
                    error={error.fecha_publicacion}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Fecha de cierre"
                    name="fecha_cierre"
                    placeholder="Ingreso el valor requerido"
                    type="date"
                    value={form.fecha_cierre ?? ''}
                    onChange={handleChange}
                    error={error.fecha_cierre}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Cantidad de personal requeridad"
                    name="cantidad_personal"
                    placeholder="Ingreso el valor requerido"
                    type="number"
                    value={form.cantidad_personal ?? ''}
                    onChange={handleChange}
                    error={error.cantidad_personal}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="border-2 border-slate-300 shadow-sm mb-5 p-10 rounded-lg">
              <legend>Datos complementarios</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-1 lg:col-span-3">
                  <Select
                    label="Seleccione centro medico"
                    options={dataCentroMedico}
                    value={valorCentroMedico}
                    onChange={(e) => {
                      setValorCentroMedico(e.target.value);
                    }}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <Select
                    label="Seleccione servicio del centro medico revisor para la convocatorias"
                    name={'servicio_revisor_id'}
                    options={dataServicioMedico}
                    value={form?.servicio_revisor_id}
                    onChange={handleChange}
                    error={error.servicio_revisor_id}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <TextAreaField
                    label="Descripcion"
                    rows={2}
                    name="descripcion"
                    placeholder="Ingreso el valor requerido"
                    type="text"
                    value={form.descripcion ?? ''}
                    onChange={handleChange}
                    error={error.descripcion}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <TextAreaField
                    rows={2}
                    label="Objetivo de cargo"
                    name="objetivo_cargo"
                    placeholder="Ingreso el valor requerido"
                    type="text"
                    value={form.objetivo_cargo ?? ''}
                    onChange={handleChange}
                    error={error.objetivo_cargo}
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div className="shrink-0 border-t border-slate-200 bg-white p-5">
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
