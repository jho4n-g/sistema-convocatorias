import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { PostulanteSerivices } from '../postulante.services';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const obtenerNombreArchivo = (archivo) => {
  if (!archivo) return '';

  if (typeof archivo === 'string') {
    return archivo.split('/').pop();
  }

  return archivo.name ?? 'Documento registrado';
};

const obtenerTamanioArchivo = (archivo) => {
  if (typeof File === 'undefined' || !(archivo instanceof File)) {
    return 'Documento registrado';
  }

  const tamanioMB = archivo.size / 1024 / 1024;

  return `${tamanioMB.toFixed(2)} MB`;
};

export default function PasoDocumentos({
  documentos = {},
  setDocumentos,
  anterior,
  finalizar,
  loading = false,
}) {
  const { id } = useParams();

  const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
  const [errores, setErrores] = useState({});
  const [mensajeGeneral, setMensajeGeneral] = useState('');
  const [cargandoDocumentos, setCargandoDocumentos] = useState(true);

  // =========================================================
  // CARGAR DOCUMENTOS REQUERIDOS DESDE LA API
  // =========================================================
  useEffect(() => {
    const cargarDocumentos = async () => {
      try {
        setCargandoDocumentos(true);
        setMensajeGeneral('');

        const response = await PostulanteSerivices.getDocumentos(id);

        if (!response.ok) {
          throw new Error(
            response.message || 'No se pudieron cargar los documentos',
          );
        }

        const data = Array.isArray(response.data) ? response.data : [];

        setDocumentosRequeridos(data);
      } catch (error) {
        console.error(error);

        setMensajeGeneral(
          error.message || 'No se pudieron cargar los documentos requeridos.',
        );

        setDocumentosRequeridos([]);
      } finally {
        setCargandoDocumentos(false);
      }
    };

    cargarDocumentos();
  }, [id]);

  // =========================================================
  // VALIDAR PDF
  // =========================================================
  const validarArchivo = (file) => {
    if (!file) {
      return 'Debe seleccionar un archivo';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo no debe superar los 10 MB';
    }

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension !== 'pdf') {
      return 'Solo se permiten archivos PDF';
    }

    if (file.type !== 'application/pdf') {
      return 'Solo se permiten archivos PDF';
    }

    return null;
  };

  // =========================================================
  // SELECCIONAR / REEMPLAZAR ARCHIVO
  // =========================================================
  const handleFileChange = (e, documento) => {
    const file = e.target.files?.[0];

    const errorArchivo = validarArchivo(file);

    if (errorArchivo) {
      setErrores((prev) => ({
        ...prev,
        [documento.id]: errorArchivo,
      }));

      e.target.value = '';
      return;
    }

    setDocumentos((prev) => ({
      ...prev,
      [documento.id]: file,
    }));

    setErrores((prev) => ({
      ...prev,
      [documento.id]: null,
    }));

    setMensajeGeneral('');
  };

  // =========================================================
  // ELIMINAR ARCHIVO
  // =========================================================
  const handleEliminarArchivo = (documentoId) => {
    setDocumentos((prev) => {
      const nuevosDocumentos = { ...prev };

      delete nuevosDocumentos[documentoId];

      return nuevosDocumentos;
    });

    setErrores((prev) => ({
      ...prev,
      [documentoId]: null,
    }));

    // Limpiar input inicial
    const inputSeleccionar = document.getElementById(`input-${documentoId}`);

    if (inputSeleccionar) {
      inputSeleccionar.value = '';
    }

    // Limpiar input reemplazar
    const inputReemplazar = document.getElementById(
      `input-reemplazar-${documentoId}`,
    );

    if (inputReemplazar) {
      inputReemplazar.value = '';
    }
  };

  // =========================================================
  // VALIDAR TODOS LOS DOCUMENTOS
  // =========================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (cargandoDocumentos) {
      return;
    }

    if (documentosRequeridos.length === 0) {
      setMensajeGeneral(
        'No se encontraron documentos requeridos para esta convocatoria.',
      );
      return;
    }

    const nuevosErrores = {};

    documentosRequeridos.forEach((documento) => {
      const archivo = documentos[documento.id];

      if (!archivo) {
        nuevosErrores[documento.id] =
          `Debe adjuntar ${documento.nombre_formacion}`;
      }
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      setMensajeGeneral(
        'Debe adjuntar todos los documentos obligatorios para finalizar.',
      );

      return;
    }

    setErrores({});
    setMensajeGeneral('');

    finalizar();
  };

  // =========================================================
  // CONTADOR
  // =========================================================
  const documentosCargados = documentosRequeridos.filter((documento) =>
    Boolean(documentos[documento.id]),
  ).length;

  const totalDocumentos = documentosRequeridos.length;

  const documentacionCompleta =
    totalDocumentos > 0 && documentosCargados === totalDocumentos;

  const porcentaje =
    totalDocumentos > 0 ? (documentosCargados / totalDocumentos) * 100 : 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      {/* =====================================================
          ENCABEZADO
      ====================================================== */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
            <DocumentTextIcon className="h-7 w-7 text-emerald-800" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-emerald-950">
              Documentos requeridos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Último paso para completar su postulación.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" />

          <div className="text-sm leading-6 text-emerald-900">
            <p>Adjunte los documentos solicitados para esta convocatoria.</p>

            <p className="mt-1">
              Solo se permiten archivos{' '}
              <span className="font-semibold">PDF</span> con un tamaño máximo de{' '}
              <span className="font-semibold">10 MB por archivo</span>.
            </p>

            <p className="mt-1">
              Todos los documentos indicados son obligatorios.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CARGANDO
      ====================================================== */}
      {cargandoDocumentos && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-5 text-center">
          <p className="text-sm font-semibold text-slate-600">
            Cargando documentos requeridos...
          </p>
        </div>
      )}

      {/* =====================================================
          PROGRESO
      ====================================================== */}
      {!cargandoDocumentos && totalDocumentos > 0 && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Documentos cargados
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {documentosCargados} de {totalDocumentos}
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                documentacionCompleta
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {documentacionCompleta
                ? 'Documentación completa'
                : 'Documentación pendiente'}
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-800 transition-all duration-500"
              style={{
                width: `${porcentaje}%`,
              }}
            />
          </div>
        </section>
      )}

      {/* =====================================================
          LISTA DE DOCUMENTOS
      ====================================================== */}
      {!cargandoDocumentos && (
        <section className="mt-7 space-y-5">
          {documentosRequeridos.length > 0 ? (
            documentosRequeridos.map((documento, index) => {
              const archivo = documentos[documento.id];
              const error = errores[documento.id];

              return (
                <article
                  key={documento.id}
                  className={`rounded-2xl border p-5 transition ${
                    error
                      ? 'border-red-300 bg-red-50/30'
                      : archivo
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Información documento */}
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                          archivo ? 'bg-emerald-100' : 'bg-slate-100'
                        }`}
                      >
                        {archivo ? (
                          <CheckCircleIcon className="h-6 w-6 text-emerald-700" />
                        ) : (
                          <span className="text-sm font-bold text-slate-600">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900">
                          {documento.nombre_formacion}

                          <span className="ml-1 text-red-600">*</span>
                        </h3>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          Solo PDF · Máximo 10 MB
                        </p>
                      </div>
                    </div>

                    {/* Seleccionar archivo */}
                    {!archivo && (
                      <div className="shrink-0">
                        <input
                          id={`input-${documento.id}`}
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, documento)}
                        />

                        <label
                          htmlFor={`input-${documento.id}`}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                        >
                          <ArrowUpTrayIcon className="h-5 w-5" />
                          Seleccionar PDF
                        </label>
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      ARCHIVO SELECCIONADO
                  ================================================== */}
                  {archivo && (
                    <div className="mt-5 flex flex-col gap-4 rounded-xl border border-emerald-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <DocumentTextIcon className="h-7 w-7 shrink-0 text-emerald-700" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {obtenerNombreArchivo(archivo)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {obtenerTamanioArchivo(archivo)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {/* Reemplazar */}
                        <input
                          id={`input-reemplazar-${documento.id}`}
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, documento)}
                        />

                        <label
                          htmlFor={`input-reemplazar-${documento.id}`}
                          className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Reemplazar
                        </label>

                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={() => handleEliminarArchivo(documento.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      ERROR DEL DOCUMENTO
                  ================================================== */}
                  {error && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                      <ExclamationCircleIcon className="h-5 w-5 shrink-0" />

                      <span>{error}</span>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
              <DocumentTextIcon className="mx-auto h-9 w-9 text-slate-400" />

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No se encontraron documentos requeridos.
              </p>
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          MENSAJE GENERAL
      ====================================================== */}
      {mensajeGeneral && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <p className="text-sm text-red-700">{mensajeGeneral}</p>
        </div>
      )}

      {/* =====================================================
          BOTONES
      ====================================================== */}
      <footer className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={loading || cargandoDocumentos}
          onClick={anterior}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Anterior
        </button>

        <button
          type="submit"
          disabled={loading || cargandoDocumentos}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-8 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Guardando registro...' : 'Finalizar registro'}

          {!loading && <CheckCircleIcon className="h-5 w-5" />}
        </button>
      </footer>
    </form>
  );
}
