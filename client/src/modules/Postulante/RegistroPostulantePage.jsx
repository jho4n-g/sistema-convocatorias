import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stepper from '../../components/Stepper';

import PasoDatosPersonales from './RegistroPostulante/PasoDatosPersonales';
import PasoFormacionAcademica from './RegistroPostulante/FormacionAcademica';

import { initialExperiencia } from './RegistroPostulante/PasoExperienciaLaboral';

import PasoExperienciaLaboral from './RegistroPostulante/PasoExperienciaLaboral';
import PasoDocumentos from './RegistroPostulante/PasoDocumentos';
import { PostulanteSerivices as Servs } from './postulante.services';

import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const steps = [
  {
    id: 1,
    label: 'Datos personales',
  },
  {
    id: 2,
    label: 'Formacion academica',
  },
  {
    id: 3,
    label: 'Experiencia',
  },
  {
    id: 4,
    label: 'Documentos',
  },
];

const nivelesAcademicos = [
  {
    value: 1,
    label: 'Técnico medio',
  },
  {
    value: 2,
    label: 'Técnico superior',
  },
  {
    value: 3,
    label: 'Licenciatura',
  },
  {
    value: 4,
    label: 'Especialidad',
  },
  {
    value: 5,
    label: 'Maestría',
  },
  {
    value: 6,
    label: 'Doctorado',
  },
];

export default function RegistroPostulantePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formacion, setFormacion] = useState({});
  const [formaciones, setFormaciones] = useState([]);
  const [formData, setFormData] = useState({
    nombres: '',
    correo: '',
    apellido_paterno: '',
    apellido_materno: '',
    numero_celular: '',
    contrasenia: '',
  });
  //
  const [trabajoEnInstitucion, setTrabajoEnInstitucion] = useState(false);
  const [experiencia, setExperiencia] = useState({
    ...initialExperiencia,
  });

  const [experiencias, setExperiencias] = useState([]);
  //
  const [documentosPostulacion, setDocumentosPostulacion] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const siguiente = () => {
    setCurrentStep(currentStep + 1);
  };
  const anterior = () => {
    setCurrentStep(currentStep - 1);
  };
  const handleOpenRegister = () => {
    setOpenModal(true);
  };

  const handleRegister = async () => {
    const payload = {
      ...formData,
      trabajo_anteriormente_institucion: trabajoEnInstitucion,
      formaciones,
      experiencias,
      documentos: documentosPostulacion,
    };

    try {
      setLoading(true);

      const response = await Servs.register(id, payload);
      if (!response.ok) {
        setOpenModal(false);
        throw new Error(response.message || 'No pudimos registrarte');
      }
      toast.success(response.message || 'Registro guardado correctamente');
      navigate('/');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Error interno del sistema';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PasoDatosPersonales
            data={formData}
            setData={setFormData}
            siguiente={siguiente}
          />
        );

      case 2:
        return (
          <PasoFormacionAcademica
            data={formacion}
            setData={setFormacion}
            formaciones={formaciones}
            setFormaciones={setFormaciones}
            nivelesAcademicos={[
              { value: 1, label: 'Técnico medio' },
              { value: 2, label: 'Técnico superior' },
              { value: 3, label: 'Licenciatura' },
              { value: 4, label: 'Especialidad' },
              { value: 5, label: 'Maestría' },
              { value: 6, label: 'Doctorado' },
            ]}
            anterior={anterior}
            siguiente={siguiente}
          />
        );

      case 3:
        return (
          <PasoExperienciaLaboral
            data={experiencia}
            setData={setExperiencia}
            experiencias={experiencias}
            setExperiencias={setExperiencias}
            trabajoEnInstitucion={trabajoEnInstitucion}
            setTrabajoEnInstitucion={setTrabajoEnInstitucion}
            anterior={anterior}
            siguiente={siguiente}
          />
        );
      case 4:
        return (
          <PasoDocumentos
            documentos={documentosPostulacion}
            setDocumentos={setDocumentosPostulacion}
            anterior={anterior}
            finalizar={handleOpenRegister}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Encabezado */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div
                className="
          flex h-14 w-14
          items-center justify-center
          rounded-2xl
          bg-white
          p-2
          shadow-md
          ring-1 ring-slate-200
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

              <div>
                <h1
                  className="
            text-3xl
            font-bold
            text-emerald-950
          "
                >
                  Registro de postulante
                </h1>

                <p
                  className="
            mt-1
            text-slate-500
          "
                >
                  Completa la información necesaria para participar en los
                  procesos de selección.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigate(`/convocatoria-detalle/${id}`);
              }}
              className="text-left text-sm font-semibold text-emerald-800 transition hover:text-emerald-950 hover:underline sm:text-base"
            >
              Volver al inicio de sesion
            </button>
          </div>

          {/* Contenedor principal */}
          <div
            className="
        overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-white
        shadow-xl"
          >
            {/* Zona Stepper */}
            <div
              className="
          border-b
          border-slate-200
          bg-linear-to-r
          from-emerald-950
          to-emerald-800
          px-6
          py-8
          sm:px-10
        "
            >
              <Stepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={(step) => {
                  if (step <= currentStep) {
                    setCurrentStep(step);
                  }
                }}
              />
            </div>

            {/* Formulario */}
            <div
              className="
          px-6
          py-10
          sm:px-10
          lg:px-16
        "
            >
              <div
                className="
            mx-auto
            max-w-7xl
          "
              >
                {renderStep()}
              </div>
            </div>
          </div>

          {/* Pie */}
          <p
            className="
        mt-6
        text-center
        text-sm
        text-slate-400
      "
          >
            Sistema de Gestión de Convocatorias y Selección de Personal
          </p>
        </div>
      </div>
      <ConfirmModal
        open={openModal}
        loading={loading}
        onClose={() => {
          setOpenModal(false);
        }}
        title="¿Estas seguro que desar guardar lo datos?"
        onConfirm={handleRegister}
      />
    </>
  );
}
