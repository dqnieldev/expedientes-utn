import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import {
  User, MapPin, GraduationCap, Lock,
  Hash, BookOpen, Eye, EyeOff, Save, CheckCircle
} from "lucide-react";

const InputField = ({ label, name, value, onChange, placeholder, type = "text", readOnly = false }) => (
  <div>
    <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm transition
        ${readOnly
          ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        }`}
    />
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={14} className="text-primary" />
      </div>
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default function Perfil() {
  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ actual: "", nueva: "", confirmar: "" });
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/alumnos/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setForm(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const cleanData = {
        curp:             form.curp || null,
        lugar_nacimiento: form.lugar_nacimiento || null,
        fecha_nacimiento: form.fecha_nacimiento ? new Date(form.fecha_nacimiento) : null,
        sexo:             form.sexo || null,
        estado_civil:     form.estado_civil || null,
        calle:            form.calle || null,
        numero:           form.numero || null,
        colonia:          form.colonia || null,
        codigo_postal:    form.codigo_postal || null,
        telefono:         form.telefono || null,
        ciudad:           form.ciudad || null,
        estado_direccion: form.estado_direccion || null,
      };

      await axios.put("http://localhost:3000/api/alumnos/perfil", cleanData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  const handleChangePassword = async () => {
    setErrorPassword("");

    if (!passwords.actual || !passwords.nueva || !passwords.confirmar) {
      return setErrorPassword("Completa todos los campos.");
    }
    if (passwords.nueva !== passwords.confirmar) {
      return setErrorPassword("Las contraseñas nuevas no coinciden.");
    }
    if (passwords.nueva.length < 6) {
      return setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
    }

    try {
      await axios.put(
        "http://localhost:3000/api/auth/change-password",
        { newPassword: passwords.nueva },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswords({ actual: "", nueva: "", confirmar: "" });
      setSavedPassword(true);
      setTimeout(() => setSavedPassword(false), 3000);
    } catch (error) {
      setErrorPassword("Error al cambiar la contraseña.");
    }
  };

  return (
    <MainLayout title="Perfil">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
        <p className="text-sm text-gray-400 mt-1">
          Gestiona tu información personal y de acceso.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">

        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-6">

          {/* DATOS ACADÉMICOS */}
          <SectionCard icon={GraduationCap} title="Datos Académicos">
            <div className="flex flex-col gap-3">
              <InputField label="Nombre completo" name="nombre"    value={form.nombre}             readOnly />
              <InputField label="Matrícula"        name="matricula" value={form.matricula}          readOnly />
              <InputField label="Carrera"          name="carrera"   value={form.carrera}            readOnly />
              <InputField label="Cuatrimestre"     name="cuatrimestre_actual" value={form.cuatrimestre_actual} readOnly />

              <div>
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block mb-1">
                  Estado
                </label>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  <CheckCircle size={11} />
                  {form.estado}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* CAMBIAR CONTRASEÑA */}
          <SectionCard icon={Lock} title="Cambiar Contraseña">
            <div className="flex flex-col gap-3">

              {errorPassword && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {errorPassword}
                </div>
              )}

              {savedPassword && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2 rounded-lg">
                  <CheckCircle size={12} />
                  Contraseña actualizada correctamente
                </div>
              )}

              {[
                { label: "Contraseña actual",   key: "actual",    show: showActual,    toggle: setShowActual    },
                { label: "Nueva contraseña",     key: "nueva",     show: showNueva,     toggle: setShowNueva     },
                { label: "Confirmar contraseña", key: "confirmar", show: showConfirmar, toggle: setShowConfirmar },
              ].map(({ label, key, show, toggle }) => (
                <div key={key}>
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={passwords[key]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                    <button
                      type="button"
                      onClick={() => toggle(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleChangePassword}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-[#013d31] active:scale-95 transition-all duration-150 mt-1"
              >
                <Lock size={13} />
                Actualizar Contraseña
              </button>

            </div>
          </SectionCard>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {/* DATOS PERSONALES */}
          <SectionCard icon={User} title="Datos Personales">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="CURP"               name="curp"             value={form.curp}             onChange={handleChange} placeholder="CURP" />
              <InputField label="Lugar de nacimiento" name="lugar_nacimiento" value={form.lugar_nacimiento} onChange={handleChange} placeholder="Ciudad, Estado" />
              <InputField label="Fecha de nacimiento" name="fecha_nacimiento" value={form.fecha_nacimiento?.split("T")[0]} onChange={handleChange} type="date" />

              <div>
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block mb-1">Sexo</label>
                <select
                  name="sexo"
                  value={form.sexo || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block mb-1">Estado Civil</label>
                <select
                  name="estado_civil"
                  value={form.estado_civil || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option>Soltero/a</option>
                  <option>Casado/a</option>
                  <option>Divorciado/a</option>
                  <option>Viudo/a</option>
                </select>
              </div>

            </div>
          </SectionCard>

          {/* DOMICILIO */}
          <SectionCard icon={MapPin} title="Domicilio">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="Calle"         name="calle"            value={form.calle}            onChange={handleChange} placeholder="Calle" />
              <InputField label="Número"        name="numero"           value={form.numero}           onChange={handleChange} placeholder="Número exterior/interior" />
              <InputField label="Colonia"       name="colonia"          value={form.colonia}          onChange={handleChange} placeholder="Colonia" />
              <InputField label="Código Postal" name="codigo_postal"    value={form.codigo_postal}    onChange={handleChange} placeholder="00000" />
              <InputField label="Ciudad"        name="ciudad"           value={form.ciudad}           onChange={handleChange} placeholder="Ciudad" />
              <InputField label="Estado"        name="estado_direccion" value={form.estado_direccion} onChange={handleChange} placeholder="Estado" />
              <InputField label="Teléfono"      name="telefono"         value={form.telefono}         onChange={handleChange} placeholder="10 dígitos" type="tel" />
            </div>
          </SectionCard>

          {/* BOTÓN GUARDAR */}
          <div className="flex items-center justify-end gap-3">
            {savedProfile && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle size={13} />
                Cambios guardados
              </span>
            )}
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-[#013d31] active:scale-95 transition-all duration-150"
            >
              <Save size={14} />
              Guardar Cambios
            </button>
          </div>

        </div>
      </div>

    </MainLayout>
  );
}