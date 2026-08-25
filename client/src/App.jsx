import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.layout';
import LoginPage from './modules/login/LoginPage';
// import ConvocatoriasPage from './modules/Plantillas/ConvocatoriasPage';
// import ConvocatoriaDetallePage from './modules/Plantillas/ConvocatoriaDetallePage';
//import RegistroPostulantePage from './modules/Postulante/RegistroPostulante/RegistroPostulantePage';
//
import RegistroPostulantePage from './modules/Postulante/RegistroPostulantePage';
//
import InicioPage from './modules/InicioPage';
import CentroMedicoPage from './modules/admins/CentroMedicos/page/CentroMedicoPage';
import ServicioCentroPage from './modules/admins/ServicioCentro/pages/ServicioCentroPage';
import PersonaPage from './modules/admins/persona/pages/PersonaPage';
import RolPage from './modules/admins/roles/pages/RolPage';
// import ConvocatoriaServicesPage from './modules/admins/convocatoriaServicios/pages/ConvocatoriaServicesPage';
import AreaTrabajoPage from './modules/admins/areaTrabajo/pages/AreaTrabajoPage';
import CargoInstitucionalPage from './modules/admins/cargoInstitucional/pages/CargoInstitucionalPage';
import ExperienciaGeneral from './modules/admins/experienciaGeneral/pages/ExperienciaGeneral';
import ExperienciaEspecifica from './modules/admins/experienciaEspecifica/pages/ExperienciaEspecifica';
import ConvocatoriaPage from './modules/admins/convocatoria/pages/ConvocatoriaPage';
import FormacionAcademicaPage from './modules/admins/formacionAcademica/pages/FormacionAcademicaPage';
import VerPostulantesPage from './modules/admins/VerPostulantes/page/VerPostulantesPage';

//Paginas publicas
import PaginaInicioConvocatoria from './modules/public/PaginaInicio/pages/ConvocatoriasPage';
import ConvocatoriaDetallePage from './modules/public/PaginaInicio/pages/ConvocatoriaDetallePage';
//Protected Routes
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import UsuarioNormalRoute from './routes/UsuarioNormalRoute';
//usuario normal
import MisPostulaciones from './modules/usuarioNormal/misPostulaciones/pages/MisPostulacionesPage';

//
import NotFoundPage from './NotFound/NotFoundPage';

import PermissionRoute from './routes/PermissionRoute';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaInicioConvocatoria />} />
        {/* <Route path="/convocatorias" element={<ConvocatoriasPage />} /> */}
        <Route
          path="/convocatoria-detalle/:id"
          element={<ConvocatoriaDetallePage />}
        />
        <Route
          path="/registro-postulante/:id"
          element={<RegistroPostulantePage />}
        />

        <Route path="/login" element={<LoginPage />} />
        {/* ================= PRIVADAS ================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/panel" element={<Navigate to="/inicio" replace />} />
            <Route path="/inicio" element={<InicioPage />} />

            <Route element={<UsuarioNormalRoute />}>
              <Route path="/mis-postulaciones" element={<MisPostulaciones />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/rol" element={<RolPage />} />
              <Route path="/persona" element={<PersonaPage />} />

              <Route element={<PermissionRoute permiso={'centroMedico.ver'} />}>
                <Route path="/centro-medico" element={<CentroMedicoPage />} />
              </Route>

              <Route
                element={<PermissionRoute permiso={'servicioCentro.ver'} />}
              >
                <Route
                  path="/servicio-centro"
                  element={<ServicioCentroPage />}
                />
              </Route>

              {/* Convocatorias*/}
              <Route element={<PermissionRoute permiso={'areaTrabajo.ver'} />}>
                <Route path="/area-trabajo" element={<AreaTrabajoPage />} />
              </Route>

              <Route
                element={<PermissionRoute permiso={'experienciaGeneral.ver'} />}
              >
                <Route
                  path="/experiencia-general"
                  element={<ExperienciaGeneral />}
                />
              </Route>

              <Route
                element={<PermissionRoute permiso={'cargoInstitucional.ver'} />}
              >
                <Route
                  path="/cargo-institucional"
                  element={<CargoInstitucionalPage />}
                />
              </Route>
              <Route
                element={
                  <PermissionRoute permiso={'experienciaEspecifica.ver'} />
                }
              >
                <Route
                  path="/experiencia-especifica"
                  element={<ExperienciaEspecifica />}
                />
              </Route>

              <Route
                element={<PermissionRoute permiso={'formacionAcademica.ver'} />}
              >
                <Route
                  path="/formacion-academica"
                  element={<FormacionAcademicaPage />}
                />
              </Route>

              <Route element={<PermissionRoute permiso={'convocatoria.ver'} />}>
                <Route path="/convocatoria" element={<ConvocatoriaPage />} />
              </Route>
              <Route element={<PermissionRoute permiso={'postulantes.ver'} />}>
                <Route
                  path="/ver-postulantes/:id"
                  element={<VerPostulantesPage />}
                />
              </Route>
            </Route>
          </Route>
        </Route>
        {/* ================= PRIVADAS ================= */}
        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
