import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";

export default function Perfil() {
  const [form, setForm] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/alumnos/me",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setForm(res.data);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    
  try {
    const cleanData = {
      curp: form.curp || null,
      lugar_nacimiento: form.lugar_nacimiento || null,
      fecha_nacimiento: form.fecha_nacimiento
        ? new Date(form.fecha_nacimiento)
        : null,
      sexo: form.sexo || null,
      estado_civil: form.estado_civil || null,
      calle: form.calle || null,
      numero: form.numero || null,
      colonia: form.colonia || null,
      codigo_postal: form.codigo_postal || null,
      telefono: form.telefono || null,
      ciudad: form.ciudad || null,
      estado_direccion: form.estado_direccion || null
      
    };

    console.log("cleanData:", cleanData);

    await axios.put(
      "http://localhost:3000/api/alumnos/perfil",
      cleanData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
      
    );

    alert("Datos actualizados");
  } catch (error) {
    console.error(error);
    alert("Error al guardar");
  }
};

  return (
    <MainLayout title="Perfil">

      <p className="text-gray-600 mb-6">
        Gestiona tu información académica y personal.
      </p>

        {/* CARD */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="font-semibold mb-4">Datos generales</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="curp"
              value={form.curp || ""}
              onChange={handleChange}
              placeholder="CURP"
              className="input"
            />

            <input
              name="lugar_nacimiento"
              value={form.lugar_nacimiento || ""}
              onChange={handleChange}
              placeholder="Lugar de nacimiento"
              className="input"
            />

            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento?.split("T")[0] || ""}
              onChange={handleChange}
              className="input"
            />

            <select
              name="sexo"
              value={form.sexo || ""}
              onChange={handleChange}
              className="input"
            >
              <option value="">Sexo</option>
              <option>Masculino</option>
              <option>Femenino</option>
            </select>

          </div>
        </div>

        {/* DOMICILIO */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="font-semibold mb-4">Domicilio</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input name="calle" value={form.calle || ""} onChange={handleChange} placeholder="Calle" className="input" />
            <input name="numero" value={form.numero || ""} onChange={handleChange} placeholder="Número" className="input" />
            <input name="colonia" value={form.colonia || ""} onChange={handleChange} placeholder="Colonia" className="input" />
            <input name="codigo_postal" value={form.codigo_postal || ""} onChange={handleChange} placeholder="Código Postal" className="input" />
            <input name="telefono" value={form.telefono || ""} onChange={handleChange} placeholder="Teléfono" className="input" />
            <input name="ciudad" value={form.ciudad || ""} onChange={handleChange} placeholder="Ciudad" className="input" />
            <input name="estado_direccion" value={form.estado_direccion || ""} onChange={handleChange}  placeholder="Estado" className="input"/>

          </div>

        </div>

        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-6 py-3 rounded"
        >
          Guardar cambios
        </button>

    </MainLayout>
  );
}