import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const userMenuRef = useRef(null);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-end gap-5">
            {/* Notificaciones */}
            {/* <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-emerald-800"
            >
              <BellIcon className="h-6 w-6" />

              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
            </button> */}

            <div ref={userMenuRef} className="relative">
              {/* Usuario */}
              <button
                type="button"
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="
          flex items-center gap-3 rounded-xl px-3 py-2
          transition hover:bg-slate-100
        "
              >
                {/* Información */}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    {`${usuario.nombres} ${usuario.apellido_paterno}`}
                  </p>

                  {/* <p className="text-xs text-slate-500">Recursos Humanos</p> */}
                </div>
                {/* Avatar */}
                <div
                  className="
            flex h-11 w-11 items-center justify-center
            rounded-full bg-emerald-900
            text-sm font-bold text-white
            shadow-sm
          "
                >
                  CP
                </div>

                <ChevronDownIcon
                  className={`
                hidden h-5 w-5 text-slate-400 transition
                sm:block
                ${openUserMenu ? 'rotate-180' : ''}
              `}
                />
              </button>

              {/* Dropdown */}
              {openUserMenu && (
                <div
                  className="
                absolute right-0 mt-1 w-64
                overflow-hidden rounded-2xl
                border border-slate-200
                bg-white shadow-xl
                animate-in fade-in zoom-in-95
              "
                >
                  {/* Cabecera usuario */}
                  {/* <div className="border-b border-slate-100 px-5 py-4">
                    <p className="font-semibold text-slate-800">Carlos Pérez</p>

                    <p className="text-sm text-slate-500">
                      carlos.perez@institucion.bo
                    </p>
                  </div> */}

                  {/* Opciones */}
                  <div className="p-2">
                    {/* <button
                      type="button"
                      className="
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm text-slate-700
                    transition
                    hover:bg-emerald-50
                    hover:text-emerald-900
                  "
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      Mi perfil
                    </button> */}
                    {/* 
                    <button
                      type="button"
                      className="
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm text-slate-700
                    transition
                    hover:bg-emerald-50
                    hover:text-emerald-900
                  "
                    >
                      <Cog6ToothIcon className="h-5 w-5" />
                      Configuración
                    </button> */}
                  </div>

                  {/* Cerrar sesión */}
                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      className="
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm font-medium
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                      onClick={() => {
                        navigate('/');
                        logout();
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
