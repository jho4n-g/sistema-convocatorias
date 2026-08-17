import { useMemo, useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';
import { MODALS, useModalManager } from '../../../../hooks/userModalManager';
import ConfirmModal from '../../../../components/ConfirmModal';
import { MisPostulacionesServices as Servs } from '../MisPostulaciones.services';
import DataTableLocal from '../../../../components/DataTableLocal';
import MisPostulacioenesModal from './MisPostulacioenesModal';

export default function MisPostulacionesPage() {
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { modalState, openModal, closeModal, isModalOpen } = useModalManager();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'titulo_cargo',
        header: 'TITULO',
      },
      {
        accessorKey: 'nombre_cargo',
        header: 'CARGO',
      },
      {
        accessorKey: 'estado',
        header: 'ESTADO',
      },

      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'ACCIONES',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-xl bg-slate-200 px-3 py-2 text-black hover:bg-slate-300 border border-slate-500"
              onClick={() => openModal(MODALS.VIEW, row.original.id)}
            >
              VER CONVOCATORIA
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    const fetchFilas = async () => {
      try {
        setLoading(true);
        const response = await Servs.listaPostulaciones();
        if (response.ok) {
          setFila(response?.data || []);
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
    fetchFilas();
  }, []);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">MIS POSTULACIONES</h2>
      </div>
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

      <DataTableLocal data={filas} columns={columns} loading={loading} />

      <MisPostulacioenesModal
        id={modalState.data}
        open={isModalOpen(MODALS.VIEW)}
        onClose={closeModal}
      />
    </>
  );
}
