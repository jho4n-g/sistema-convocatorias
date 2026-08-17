import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
  HomeIcon,
  IdentificationIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const menuSections = [
  {
    title: 'Principal',
    items: [
      {
        label: 'Inicio',
        path: '/panel',
        icon: HomeIcon,
        end: true,

        publicAuth: true,
      },
    ],
  },
  // ==========================
  // USUARIO NORMAL
  // ==========================
  {
    title: 'Mi cuenta',
    normalUserOnly: true,

    items: [
      {
        label: 'Mis postulaciones',
        path: '/mis-postulaciones',
        icon: ClipboardDocumentCheckIcon,
      },
    ],
  },
  // ==========================
  // USUARIOS ADMINISTRATIVOS
  // ==========================
  {
    title: 'ADMIN',
    items: [
      {
        label: 'Usuarios',
        path: '/persona',
        icon: UsersIcon,
        permission: 'admin.admin',
      },
      {
        label: 'Roles',
        path: '/rol',
        icon: UsersIcon,
        permission: 'admin.admin',
      },
    ],
  },
  {
    title: 'Organización',
    items: [
      {
        label: 'Centros médicos',
        path: '/centro-medico',
        icon: BuildingOffice2Icon,
        permission: 'centroMedico.ver',
      },
      {
        label: 'Servicios de centros médicos',
        path: '/servicio-centro',
        icon: Squares2X2Icon,
        permission: 'servicioCentro.ver',
      },
    ],
  },
  {
    title: 'Catálogos institucionales',
    items: [
      {
        label: 'Áreas de trabajo',
        path: '/area-trabajo',
        icon: AdjustmentsHorizontalIcon,
        permission: 'areaTrabajo.ver',
      },
      {
        label: 'Cargos institucionales',
        path: '/cargo-institucional',
        icon: BriefcaseIcon,
        permission: 'cargoInstitucional.ver',
      },
      {
        label: 'Experiencia general',
        path: '/experiencia-general',
        icon: IdentificationIcon,
        permission: 'experienciaGeneral.ver',
      },
      {
        label: 'Experiencia específica',
        path: '/experiencia-especifica',
        icon: DocumentCheckIcon,
        permission: 'experienciaEspecifica.ver',
      },
      {
        label: 'Formación académica',
        path: '/formacion-academica',
        icon: AcademicCapIcon,
        permission: 'formacionAcademica.ver',
      },
    ],
  },
  {
    title: 'Convocatorias',
    items: [
      {
        label: 'Gestión de convocatorias',
        path: '/convocatoria',
        icon: ClipboardDocumentCheckIcon,
        permission: 'convocatoria.ver',
      },
    ],
  },
];

function SidebarItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => `
        group relative flex min-h-12 items-center rounded-xl
        px-3.5 py-3 transition-all duration-200
        focus:outline-none focus-visible:ring-2
        focus-visible:ring-emerald-300/70

        ${collapsed ? 'justify-center' : 'justify-between gap-3'}

        ${
          isActive
            ? `
              bg-white/15
              text-white
              shadow-sm
              ring-1 ring-white/10
            `
            : `
              text-emerald-50/75
              hover:bg-white/10
              hover:text-white
            `
        }
      `}
    >
      {({ isActive }) => (
        <>
          <div
            className={`flex min-w-0 items-center ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <Icon
              className={`
                h-5.5 w-5.5 shrink-0 transition-colors
                ${
                  isActive
                    ? 'text-white'
                    : `
                      text-emerald-100/75
                      group-hover:text-white
                    `
                }
              `}
            />

            {!collapsed && (
              <span className="min-w-0 truncate text-sm font-medium">
                {item.label}
              </span>
            )}
          </div>

          {!collapsed && item.badge !== undefined && (
            <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-emerald-900">
              {item.badge}
            </span>
          )}

          {isActive && (
            <span
              aria-hidden="true"
              className="
                absolute left-0 top-1/2
                h-7 w-1
                -translate-y-1/2
                rounded-r-full
                bg-emerald-300
              "
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { usuario } = useAuth();
  const esUsuarioNormal = usuario?.nombre_rol === 'UsuarioNormal';
  const esSuperAdmin = usuario?.nombre_rol === 'admin_super_admin';

  const tienePermiso = (permiso) => {
    return usuario?.permisos?.includes(permiso);
  };

  const menuFiltrado = menuSections
    .filter((section) => {
      // Usuario normal: solo sus secciones + públicas
      if (esUsuarioNormal) {
        if (section.normalUserOnly) {
          return true;
        }

        return section.items.some((item) => item.publicAuth);
      }

      // SuperAdmin y administrativos:
      // nunca ven las secciones exclusivas del usuario normal
      if (section.normalUserOnly) {
        return false;
      }

      return true;
    })
    .map((section) => ({
      ...section,

      items: section.items.filter((item) => {
        // Inicio u opciones comunes
        if (item.publicAuth) {
          return true;
        }

        // Usuario normal
        if (esUsuarioNormal) {
          return section.normalUserOnly;
        }

        // Super Admin ve TODO lo administrativo
        if (esSuperAdmin) {
          return true;
        }

        // Los demás usuarios administrativos dependen de permisos
        if (item.permission) {
          return tienePermiso(item.permission);
        }

        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Botón para abrir en móvil */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="
          fixed left-4 top-4 z-40
          rounded-xl bg-emerald-900 p-3
          text-white shadow-lg
          transition hover:bg-emerald-950
          focus:outline-none
          focus-visible:ring-4
          focus-visible:ring-emerald-700/30
          lg:hidden
        "
        aria-label="Abrir menú de navegación"
        aria-expanded={mobileOpen}
        aria-controls="sidebar-principal"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Fondo móvil */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú de navegación"
          onClick={handleCloseMobile}
          className="
            fixed inset-0 z-40
            bg-slate-950/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      <aside
        id="sidebar-principal"
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-72 flex-col
          bg-linear-to-b
          from-emerald-950
          via-emerald-900
          to-emerald-950
          text-white
          shadow-2xl
          transition-[width,transform]
          duration-300

          lg:sticky
          lg:top-0
          lg:z-30
          lg:translate-x-0

          ${collapsed ? 'lg:w-22' : 'lg:w-72'}

          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Encabezado */}
        <header className="relative shrink-0 border-b border-white/10 px-4 py-5">
          <button
            type="button"
            onClick={handleCloseMobile}
            className="
              absolute right-3 top-3
              rounded-lg p-2
              text-white/70
              transition
              hover:bg-white/10
              hover:text-white
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-white/50
              lg:hidden
            "
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <div
              className="
                flex h-13 w-13 shrink-0
                items-center justify-center
                rounded-2xl bg-white p-1.5
                shadow-lg
                ring-1 ring-white/20
              "
            >
              <img
                src="/logo_CNS.webp"
                alt="Logo de la Caja Nacional de Salud"
                className="h-full w-full object-contain"
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-wide">
                  CNS
                </h1>

                <p className="mt-0.5 truncate text-xs text-emerald-100/75">
                  Sistema de gestion convocatorias
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Navegación */}
        <nav
          aria-label="Menú principal"
          className="
            min-h-0 flex-1
            overflow-y-auto
            px-3 py-5
            [scrollbar-color:rgba(255,255,255,0.2)_transparent]
            scrollbar-thin"
        >
          <div className="space-y-6">
            {menuFiltrado.map((section) => (
              <section key={section.title}>
                {!collapsed && (
                  <h2
                    className="
                      mb-2 px-3
                      text-[11px] font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-emerald-200/55
                    "
                  >
                    {section.title}
                  </h2>
                )}

                {collapsed && (
                  <div className="mx-auto mb-3 h-px w-8 bg-white/10" />
                )}

                <div className="space-y-1.5">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      collapsed={collapsed}
                      onNavigate={handleCloseMobile}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </nav>

        {/* Pie */}
        <footer className="shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            className={`
              hidden min-h-11 w-full
              items-center rounded-xl
              border border-white/10
              text-sm font-medium
              text-emerald-100/80
              transition
              hover:bg-white/10
              hover:text-white
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-white/40
              lg:flex

              ${collapsed ? 'justify-center px-3' : 'justify-center gap-2 px-4'}
            `}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeftIcon className="h-5 w-5" />
                <span>Contraer menú</span>
              </>
            )}
          </button>
        </footer>
      </aside>
    </>
  );
}
