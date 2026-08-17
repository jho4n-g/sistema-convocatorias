import {
  EyeIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import DisplayField from '../../../../components/DisplayField';
import DataTableLocal from '../../../../components/DataTableLocal';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { VerPostulante as Serv } from '../verPostulantes.services';

export default function VerPostulanteModal({ open, id, onClose }) {
  const [form, setForm] = useState(null);
  const [dataTabla, setDataTable] = useState([]);
  const [dataFA, setDataFA] = useState([]);
  const [dataEL, setDataEL] = useState([]);
  const [loading, setLoading] = useState(false);

  const [documentoUrl, setDocumentoUrl] = useState(null);
  const [documentoNombre, setDocumentoNombre] = useState('');
  const [loadingDocumento, setLoadingDocumento] = useState(false);

  const verDocumento = async (documento) => {
    try {
      setLoadingDocumento(true);

      const response = await Serv.verDocumento(documento.id);

      if (!(response instanceof Blob)) {
        throw new Error(response?.message || 'No se pudo cargar el documento');
      }

      const url = URL.createObjectURL(response);

      setDocumentoUrl(url);
      setDocumentoNombre(
        documento.nombre_original || documento.nombre_formacion || 'Documento',
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el documento',
      );
    } finally {
      setLoadingDocumento(false);
    }
  };
  const cerrarDocumento = () => {
    if (documentoUrl) {
      URL.revokeObjectURL(documentoUrl);
    }

    setDocumentoUrl(null);
    setDocumentoNombre('');
  };

  const abrirDocumentoNuevaPestana = () => {
    if (!documentoUrl) return;

    const nuevaVentana = window.open(
      documentoUrl,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_formacion',
        header: 'DOCUMENTO PRESENTADO',
      },
      {
        id: 'acciones',
        header: 'ACCIONES',

        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => verDocumento(row.original)}
            className="
              inline-flex items-center gap-2
              rounded-lg
              border border-emerald-700
              px-3 py-2
              text-sm font-medium
              text-emerald-700
              transition
              hover:bg-emerald-50
            "
          >
            <EyeIcon className="h-5 w-5" />
            VER
          </button>
        ),
      },
    ],
    [],
  );

  const columnsFA = useMemo(
    () => [
      {
        accessorKey: 'titulo',
        header: 'TITULO',
      },
      {
        accessorKey: 'institucion',
        header: 'INSTITUCION',
      },
      {
        accessorKey: 'nivel_academico',
        header: 'NIVEL ACADEMICO',
      },
      {
        accessorKey: 'estado',
        header: 'ESTADO',
      },
    ],
    [],
  );
  const columnsEL = useMemo(
    () => [
      {
        accessorKey: 'empresa_institucion',
        header: 'EMPRESA',
      },
      {
        accessorKey: 'cargo_puesto',
        header: 'CARGO',
      },
      {
        accessorKey: 'area',
        header: 'AREA',
      },
      {
        accessorKey: 'gestion',
        header: 'GESTION',
      },
    ],
    [],
  );
  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const response = await Serv.getId(id);

        if (!response.ok) {
          throw new Error(
            response.message || 'No se pudo cargar la convocatoria',
          );
        }

        setForm(response.data.persona);

        setDataTable(
          Array.isArray(response.data.documentos)
            ? response.data.documentos
            : [],
        );

        setDataFA(
          Array.isArray(response.data.formacionAcademica)
            ? response.data.formacionAcademica
            : [],
        );

        setDataEL(
          Array.isArray(response.data.experienciaLaboral)
            ? response.data.experienciaLaboral
            : [],
        );
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
  }, [open, id]);

  useEffect(() => {
    if (!open) {
      setForm(null);
      setDataTable([]);
      cerrarDocumento();
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Fondo */}
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Contenedor */}
        <div
          className="
            relative z-10
            flex
            max-h-[95vh]
            w-full
            max-w-8xl
            flex-col
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-2xl
          "
        >
          {/* HEADER */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                DETALLES DEL POSTULANTE
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-lg p-2
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-800
              "
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <fieldset className="mb-8 rounded-xl border border-slate-200 p-5">
              <legend className="px-2 text-sm font-semibold text-slate-700">
                DATOS
              </legend>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <DisplayField
                  label="CEDULA IDENTIDAD"
                  value={form?.cedula_identidad}
                />

                <DisplayField label="NOMBRES" value={form?.nombres} />

                <DisplayField
                  label="APELLIDO PATERNO"
                  value={form?.apellido_paterno}
                />

                <DisplayField
                  label="APELLIDO MATERNO"
                  value={form?.apellido_materno}
                />

                <DisplayField
                  label="FECHA DE NACIMIENTO"
                  value={form?.fecha_nacimiento}
                />

                <DisplayField label="CORREO" value={form?.correo} />

                <DisplayField
                  label="NUMERO CELULAR"
                  value={form?.numero_celular}
                />

                <DisplayField
                  label="TRABAJO ANTERIORMENTE EN LA CAJA"
                  value={form?.trabajo_anteriormente_institucion ? 'SI' : 'NO'}
                />
              </div>
            </fieldset>
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-slate-900">
                  FORMACION ACADEMICA
                </h4>
              </div>

              <DataTableLocal
                data={dataFA}
                columns={columnsFA}
                loading={loading}
              />
            </div>
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-slate-900">
                  EXPERIENCIA LABORAL
                </h4>
              </div>

              <DataTableLocal
                data={dataEL}
                columns={columnsEL}
                loading={loading}
              />
            </div>
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-slate-900">
                  DOCUMENTOS PRESENTADOS
                </h4>

                <p className="text-sm text-slate-500">
                  Documentos adjuntados durante la postulación.
                </p>
              </div>

              <DataTableLocal
                data={dataTabla}
                columns={columns}
                loading={loading}
              />
            </div>
          </div>
          {/* FOOTER */}
          <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  rounded-xl
                  bg-red-700
                  px-5 py-2.5
                  font-medium
                  text-white
                  transition
                  hover:bg-red-800
                  disabled:opacity-50
                "
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VISOR DEL DOCUMENTO */}
      {documentoUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            onClick={cerrarDocumento}
            className="absolute inset-0 bg-black/70"
          />

          <div
            className="
              relative z-10
              flex
              h-[90vh]
              w-full
              max-w-5xl
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >
            {/* Header PDF */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div>
                <h4 className="font-semibold text-slate-900">
                  {documentoNombre}
                </h4>

                <p className="text-xs text-slate-500">
                  Vista previa del documento
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={abrirDocumentoNuevaPestana}
                  disabled={loadingDocumento || !documentoUrl}
                  className="
        inline-flex items-center gap-2
        rounded-lg
        border border-emerald-700
        px-3 py-2
        text-sm font-medium
        text-emerald-700
        transition
        hover:bg-emerald-50
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  ABRIR EN PESTAÑA
                </button>

                <button
                  type="button"
                  onClick={cerrarDocumento}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* PDF */}
            <div className="min-h-0 flex-1 bg-slate-100">
              {loadingDocumento ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-slate-500">Cargando documento...</p>
                </div>
              ) : (
                <iframe
                  src={documentoUrl}
                  title={documentoNombre}
                  className="h-full w-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
