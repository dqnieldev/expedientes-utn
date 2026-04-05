import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import {
  User, MapPin, GraduationCap, Lock,
  Eye, EyeOff, Save, CheckCircle, AlertCircle
} from "lucide-react";

// ── Validaciones ──────────────────────────────────────────────
const validators = {
  curp: (v) => {
    if (!v) return "La CURP es obligatoria.";
    if (!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(v.toUpperCase()))
      return "Formato de CURP inválido.";
    return "";
  },
  lugar_nacimiento: (v) => !v ? "El lugar de nacimiento es obligatorio." : "",
  fecha_nacimiento: (v) => !v ? "La fecha de nacimiento es obligatoria." : "",
  sexo:             (v) => !v ? "Selecciona un sexo." : "",
  estado_civil:     (v) => !v ? "Selecciona el estado civil." : "",
  calle:            (v) => !v ? "La calle es obligatoria." : "",
  numero:           (v) => !v ? "El número es obligatorio." : "",
  colonia:          (v) => !v ? "La colonia es obligatoria." : "",
  codigo_postal:    (v) => {
    if (!v) return "El código postal es obligatorio.";
    if (!/^\d{5}$/.test(v)) return "El código postal debe tener 5 dígitos.";
    return "";
  },
  ciudad:           (v) => !v ? "La ciudad es obligatoria." : "",
  estado_direccion: (v) => !v ? "El estado es obligatorio." : "",
  telefono:         (v) => {
    if (!v) return "El teléfono es obligatorio.";
    if (!/^\d{10}$/.test(v)) return "El teléfono debe tener 10 dígitos.";
    return "";
  },
};

const passwordValidators = {
  actual:    (v) => !v ? "Ingresa tu contraseña actual." : "",
  nueva:     (v) => {
    if (!v) return "Ingresa la nueva contraseña.";
    if (v.length < 6) return "Mínimo 6 caracteres.";
    if (!/[A-Z]/.test(v)) return "Debe tener al menos una mayúscula.";
    if (!/\d/.test(v)) return "Debe tener al menos un número.";
    return "";
  },
  confirmar: (v, nueva) => {
    if (!v) return "Confirma la nueva contraseña.";
    if (v !== nueva) return "Las contraseñas no coinciden.";
    return "";
  },
};

// ── Componentes ───────────────────────────────────────────────
const InputField = ({ label, name, value, onChange, onBlur, placeholder, type = "text", readOnly = false, error = "" }) => (
  <div>
    <label className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-1">
      {label}{!readOnly && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm transition
        ${readOnly
          ? "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          : error
            ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary"
        }`}
    />
    {error && (
      <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, onBlur, options, error = "" }) => (
  <div>
    <label className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-1">
      {label}<span className="text-red-400 ml-0.5">*</span>
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm transition
        ${error
          ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        }`}
    >
      <option value="">Seleccionar</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
    {error && (
      <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
        <Icon size={14} className="text-primary" />
      </div>
      <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ── Página ────────────────────────────────────────────────────
export default function Perfil() {
  const [form, setForm]               = useState({});
  const [errors, setErrors]           = useState({});
  const [passwords, setPasswords]     = useState({ actual: "", nueva: "", confirmar: "" });
  const [passErrors, setPassErrors]   = useState({});
  const [showActual, setShowActual]   = useState(false);
  const [showNueva, setShowNueva]     = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [savedProfile, setSavedProfile]  = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/alumnos/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setForm(res.data));
  }, []);

  const handleBlur = (name, value) => {
    if (!validators[name]) return;
    setErrors(prev => ({ ...prev, [name]: validators[name](value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: validators[name]?.(value) || "" }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach(key => {
      newErrors[key] = validators[key](form[key]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === "");
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
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
    }
  };

  const handlePassBlur = (key, value) => {
    const error = key === "confirmar"
      ? passwordValidators.confirmar(value, passwords.nueva)
      : passwordValidators[key]?.(value) || "";
    setPassErrors(prev => ({ ...prev, [key]: error }));
  };

  const handleChangePassword = async () => {
    setErrorPassword("");
    const newPassErrors = {
      actual:    passwordValidators.actual(passwords.actual),
      nueva:     passwordValidators.nueva(passwords.nueva),
      confirmar: passwordValidators.confirmar(passwords.confirmar, passwords.nueva),
    };
    setPassErrors(newPassErrors);
    if (Object.values(newPassErrors).some(e => e)) return;
    try {
      await axios.put(
        "http://localhost:3000/api/auth/change-password",
        { currentPassword: passwords.actual, newPassword: passwords.nueva },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswords({ actual: "", nueva: "", confirmar: "" });
      setPassErrors({});
      setSavedPassword(true);
      setTimeout(() => setSavedPassword(false), 3000);
    } catch (error) {
      setErrorPassword(error.response?.data?.message || "Error al cambiar la contraseña.");
    }
  };

  return (
    <MainLayout title="Perfil">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Gestiona tu información personal y de acceso.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start pb-10">

        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-6">

          {/* DATOS ACADÉMICOS */}
          <SectionCard icon={GraduationCap} title="Datos Académicos">
            <div className="flex flex-col gap-3">
              <InputField label="Nombre completo"  name="nombre"              value={form.nombre}              readOnly />
              <InputField label="Matrícula"         name="matricula"           value={form.matricula}           readOnly />
              <InputField label="Carrera"           name="carrera"             value={form.carrera}             readOnly />
              <InputField label="Cuatrimestre"      name="cuatrimestre_actual" value={form.cuatrimestre_actual} readOnly />
              <div>
                <label className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-1">
                  Estado
                </label>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle size={11} />{form.estado}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* CAMBIAR CONTRASEÑA */}
          <SectionCard icon={Lock} title="Cambiar Contraseña">
            <div className="flex flex-col gap-3">

              {errorPassword && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs px-3 py-2 rounded-lg">
                  <AlertCircle size={12} />{errorPassword}
                </div>
              )}

              {savedPassword && (
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-2 rounded-lg">
                  <CheckCircle size={12} />Contraseña actualizada correctamente
                </div>
              )}

              {[
                { label: "Contraseña actual",   key: "actual",    show: showActual,    toggle: setShowActual    },
                { label: "Nueva contraseña",     key: "nueva",     show: showNueva,     toggle: setShowNueva     },
                { label: "Confirmar contraseña", key: "confirmar", show: showConfirmar, toggle: setShowConfirmar },
              ].map(({ label, key, show, toggle }) => (
                <div key={key}>
                  <label className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-1">
                    {label}<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={passwords[key]}
                      onChange={(e) => {
                        setPasswords(prev => ({ ...prev, [key]: e.target.value }));
                        if (passErrors[key]) handlePassBlur(key, e.target.value);
                      }}
                      onBlur={(e) => handlePassBlur(key, e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2.5 pr-10 rounded-xl border text-sm transition
                        ${passErrors[key]
                          ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => toggle(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {passErrors[key] && (
                    <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                      <AlertCircle size={10} />{passErrors[key]}
                    </p>
                  )}
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
              <InputField label="CURP"                name="curp"             value={form.curp}             onChange={handleChange} onBlur={(e) => handleBlur("curp", e.target.value)}             placeholder="CURP (18 caracteres)" error={errors.curp} />
              <InputField label="Lugar de nacimiento" name="lugar_nacimiento" value={form.lugar_nacimiento} onChange={handleChange} onBlur={(e) => handleBlur("lugar_nacimiento", e.target.value)} placeholder="Ciudad, Estado"        error={errors.lugar_nacimiento} />
              <InputField label="Fecha de nacimiento" name="fecha_nacimiento" value={form.fecha_nacimiento?.split("T")[0]} onChange={handleChange} onBlur={(e) => handleBlur("fecha_nacimiento", e.target.value)} type="date" error={errors.fecha_nacimiento} />
              <SelectField label="Sexo"         name="sexo"         value={form.sexo}         onChange={handleChange} onBlur={(e) => handleBlur("sexo", e.target.value)}         options={["Masculino", "Femenino"]}                            error={errors.sexo} />
              <SelectField label="Estado Civil" name="estado_civil" value={form.estado_civil} onChange={handleChange} onBlur={(e) => handleBlur("estado_civil", e.target.value)} options={["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"]} error={errors.estado_civil} />
            </div>
          </SectionCard>

          {/* DOMICILIO */}
          <SectionCard icon={MapPin} title="Domicilio">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="Calle"         name="calle"            value={form.calle}            onChange={handleChange} onBlur={(e) => handleBlur("calle", e.target.value)}            placeholder="Calle"      error={errors.calle} />
              <InputField label="Número"        name="numero"           value={form.numero}           onChange={handleChange} onBlur={(e) => handleBlur("numero", e.target.value)}           placeholder="Ext/Int"    error={errors.numero} />
              <InputField label="Colonia"       name="colonia"          value={form.colonia}          onChange={handleChange} onBlur={(e) => handleBlur("colonia", e.target.value)}          placeholder="Colonia"    error={errors.colonia} />
              <InputField label="Código Postal" name="codigo_postal"    value={form.codigo_postal}    onChange={handleChange} onBlur={(e) => handleBlur("codigo_postal", e.target.value)}    placeholder="00000"      error={errors.codigo_postal} />
              <InputField label="Ciudad"        name="ciudad"           value={form.ciudad}           onChange={handleChange} onBlur={(e) => handleBlur("ciudad", e.target.value)}           placeholder="Ciudad"     error={errors.ciudad} />
              <InputField label="Estado"        name="estado_direccion" value={form.estado_direccion} onChange={handleChange} onBlur={(e) => handleBlur("estado_direccion", e.target.value)} placeholder="Estado"     error={errors.estado_direccion} />
              <InputField label="Teléfono"      name="telefono"         value={form.telefono}         onChange={handleChange} onBlur={(e) => handleBlur("telefono", e.target.value)}         placeholder="10 dígitos" type="tel" error={errors.telefono} />
            </div>
          </SectionCard>

          {/* BOTÓN GUARDAR */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end gap-3">
              {savedProfile && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle size={13} />Cambios guardados
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
      </div>

    </MainLayout>
  );
}