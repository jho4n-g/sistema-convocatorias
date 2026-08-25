import { useEffect, useState } from 'react';
import Select from '../../../../components/Select';
import { toast } from 'react-toastify';

const initialForm = () => ({
  estado: '',
});

export default function RevisarPostulante({
  open,
  onConfirm,
  onClose,
  loading,
}) {
  const [form, setForm] = useState(initialForm());
  const [error, setError] = useState({});

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Card */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className=" w-[92%] max-w-md">
          <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                SELECCIONE UN ESTADO PARA EL POSTULANTE
              </h3>
              <Select
                name={'estado'}
                value={form.estado}
                onChange={handleChange}
                options={[
                  { value: 'APROBADO', label: 'APROBADO' },
                  { value: 'OBSERVADO', label: 'OBSERVADO' },
                ]}
                error={error.estado}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                CANCELER
              </button>

              <button
                onClick={() => {
                  if (!form?.estado) {
                    toast.error('Debe eligir una opcion');
                    return;
                  }
                  onConfirm(form);
                }}
                disabled={loading}
                className={[
                  'rounded-xl px-4 py-2 text-white disabled:opacity-60 bg-emerald-800 hover:bg-emerald-900',
                ].join(' ')}
              >
                {loading ? 'PROCESANDO...' : 'CONFIRMAR'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
