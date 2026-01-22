// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ServiciosPage from "./pages/ServiciosPage";
import PrincipiosPage from "./pages/PrincipiosPage";
import ContactoPage from "./pages/ContactoPage";
import IndemnizacionPage from "./pages/IndemnizacionPage";
import Bono14Page from "./pages/Bono14Page";
import AguinaldoPage from "./pages/AguinaldoPage";
import ISRLaboralPage from "./pages/ISRLaboralPage";
import ISREmpresaMensualPage from "./pages/ISREmpresaMensualPage";
import ISREmpresaTrimestralPage from "./pages/ISREmpresaTrimestralPage";
import ISOTrimestralPage from "./pages/ISOTrimestralPage";
import SobreNosotrosPage from "./pages/SobreNosotrosPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/principios" element={<PrincipiosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/calculadora-indemnizacion" element={<IndemnizacionPage />} />
          <Route path="/calculadora-bono14" element={<Bono14Page />} />
          <Route path="/calculadora-aguinaldo" element={<AguinaldoPage />} />
          <Route path="/calculadora-isr-laboral" element={<ISRLaboralPage />} />
          <Route path="/calculadora-isr-empresa-mensual" element={<ISREmpresaMensualPage />} />
          <Route path="/calculadora-isr-empresa-trimestral" element={<ISREmpresaTrimestralPage />} />
          <Route path="/calculadora-iso-trimestral" element={<ISOTrimestralPage />} />
          <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;