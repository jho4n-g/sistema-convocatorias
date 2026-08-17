import { useMemo, useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';
import ConfirmModal from '../../../../components/ConfirmModal';
//
import ExperienciaEspecificaModal from './ExperienciaEspecificaModal';
import { ExperienciaEspecificaServices as Servs } from '../experienciaEspecifica.services';

import { usePermisos } from '../../../../hooks/usePermisos';

export default function ExperienciaGeneralPage() {
  const { modalState, openModal, closeModal, isModalOpen } = useModalManager();
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { tienePermiso } = usePermisos();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_experiencia',
        header: 'Experiencia especifica',
      },

      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            {tienePermiso('experienciaEspecifica.editar') && (
              <button
                type="button"
                className="rounded-xl bg-slate-200 px-3 py-2 text-black hover:bg-slate-300 border border-slate-500"
                onClick={() => openModal(MODALS.EDIT, row.original)}
              >
                Editar
              </button>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const fetchFilas = async () => {
    try {
      setLoading(true);
      const response = await Servs.getAll(
        pagination.page,
        pagination.limit,
        searchInput,
      );
      if (response.ok) {
        setFila(response?.data || []);
        setPagination((prev) => ({
          ...prev,
          page: response?.page || prev.page,
          totalItems: response?.total || 0,
          totalPages: response?.totalPages || 1,
        }));
      }

      if (!response.ok) {
        toast.error(response.message || 'Error al cargar datos');
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFilas();
  }, [pagination.page, pagination.limit, searchInput]);
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          GESTION DE EXPERIENCIA GENERAL
        </h2>
        {tienePermiso('experienciaEspecifica.crear') && (
          <button
            className="
            rounded-xl
            bg-emerald-800
            px-10 py-2
            text-white
            hover:bg-emerald-900
          "
            onClick={() => {
              openModal(MODALS.CREATE);
            }}
          >
            Nuevo registro
          </button>
        )}
      </div>
      {/* BUSCADOR */}
      <div className="rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="w-full md:max-w-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Buscar
          </label>

          <div className="relative">
            <MagnifyingGlassIcon
              className="
                pointer-events-none
                absolute left-3 top-1/2
                h-5 w-5
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Buscar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="
                w-full rounded-2xl
                border border-slate-300
                bg-white
                py-2 pl-10 pr-10
                text-sm text-slate-900
              "
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="
                  absolute right-2 top-1/2
                  -translate-y-1/2
                  rounded-full
                  p-1
                "
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <DataTable
        data={filas}
        columns={columns}
        loading={loading}
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={(newPage) =>
          setPagination((prev) => ({
            ...prev,
            page: newPage,
          }))
        }
        limit={pagination.limit}
        onLimitChange={(newLimit) =>
          setPagination((prev) => ({
            ...prev,
            page: 1,
            limit: Number(newLimit),
          }))
        }
      />

      <ExperienciaEspecificaModal
        open={isModalOpen(MODALS.CREATE)}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          fetchFilas();
        }}
      />
      <ExperienciaEspecificaModal
        open={isModalOpen(MODALS.EDIT)}
        isEdit={true}
        dataRow={modalState.data}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          fetchFilas();
        }}
      />
    </>
  );
}
