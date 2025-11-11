import React, { useState } from '../react';

// componente principal de login y registro
export default function Login() {
  // estado del rol seleccionado
  const [role, setRole] = useState(null);
  // modo registro o login
  const [isRegister, setIsRegister] = useState(false);
  // datos del formulario
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  // mensaje de respuesta
  const [message, setMessage] = useState('');

  // validar contrasena con reglas
  const validatePassword = (p) => {
    if (p.length < 8) return 'La contrasena debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(p)) return 'La contrasena debe contener al menos una mayuscula';
    if (!/\d/.test(p)) return 'La contrasena debe contener al menos un numero';
    return '';
  };

  // enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return setMessage('Elige si eres empleado o admin');
    const pwErr = validatePassword(form.password);
    if (pwErr) return setMessage(pwErr);

    // sanitizacion basica de datos
    const payload = {
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      rol: role,
    };

    try {
      // elegir endpoint segun modo
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setMessage(data.message || 'OK');
    } catch (err) {
      setMessage(err.message || 'Error de red');
    }
  };

  // render del componente
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '20px' }}>
      <h3>{isRegister ? 'Registro' : 'Login'}</h3>

      {/* seleccionar tipo de usuario */}
      {!role && (
        <div style={{ marginBottom: '20px' }}>
          <p>Eres empleado o admin?</p>
          <button onClick={() => setRole('empleado')} style={{ marginRight: '10px', padding: '8px 16px' }}>
            Empleado
          </button>
          <button onClick={() => setRole('admin')} style={{ padding: '8px 16px' }}>
            Admin
          </button>
        </div>
      )}

      {/* formulario de login o registro */}
      {role && (
        <form onSubmit={handleSubmit}>
          {/* campo nombre solo en registro */}
          {isRegister && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {/* campo email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* campo contrasena */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contrasena</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* botones enviar y cambiar modo */}
          <div style={{ marginTop: '20px' }}>
            <button type="submit" style={{ marginRight: '10px', padding: '8px 16px' }}>
              {isRegister ? 'Registrar' : 'Iniciar sesion'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegister((s) => !s)}
              style={{ padding: '8px 16px' }}
            >
              {isRegister ? 'Ir a login' : 'Ir a registro'}
            </button>
          </div>
        </form>
      )}

      {/* mostrar mensaje de respuesta */}
      {message && (
        <p style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          {message}
        </p>
      )}

      {/* boton para cambiar tipo de usuario */}
      {role && (
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setRole(null)}
            style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
          >
            Cambiar tipo (actual: {role})
          </button>
        </div>
      )}
    </div>
  );
}
