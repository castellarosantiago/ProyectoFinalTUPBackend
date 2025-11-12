import React, { useState } from 'react';

// componente principal de login y registro
export default function Login() {
  // estado del rol seleccionado
  const [role, setRole] = useState<'empleado' | 'admin' | null>(null);
  // modo registro o login
  const [isRegister, setIsRegister] = useState(false);
  // datos del formulario
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  // mensaje de respuesta
  const [message, setMessage] = useState('');
  // tipo de mensaje (error o success)
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');

  // validar contrasena con reglas
  const validatePassword = (p: string) => {
    if (p.length < 8) return 'La contrasena debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(p)) return 'La contrasena debe contener al menos una mayuscula';
    if (!/\d/.test(p)) return 'La contrasena debe contener al menos un numero';
    return '';
  };

  // enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setMessage('Elige si eres empleado o admin');
      setMessageType('error');
      return;
    }
    const pwErr = validatePassword(form.password);
    if (pwErr) {
      setMessage(pwErr);
      setMessageType('error');
      return;
    }

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
      if (!res.ok) {
        setMessage(data.message || 'Error en la solicitud');
        setMessageType('error');
      } else {
        setMessage(data.message || 'Exito!');
        setMessageType('success');
        // limpiar formulario
        setForm({ nombre: '', email: '', password: '' });
      }
    } catch (err: any) {
      setMessage(err.message || 'Error de red');
      setMessageType('error');
    }
  };

  // render del componente
  return (
    <div>
      <h2>{isRegister ? 'Registro' : 'Login'}</h2>

      {/* seleccionar tipo de usuario */}
      {!role && (
        <div>
          <p>Eres empleado o admin?</p>
          <button onClick={() => setRole('empleado')}>Empleado</button>
          <button onClick={() => setRole('admin')}>Admin</button>
        </div>
      )}

      {/* formulario de login o registro */}
      {role && (
        <form onSubmit={handleSubmit}>
          {/* campo nombre solo en registro */}
          {isRegister && (
            <div>
              <label>Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          {/* campo email */}
          <div>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
            />
          </div>

          {/* campo contrasena */}
          <div>
            <label>Contrasena</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 8 caracteres, mayuscula y numero"
            />
          </div>

          {/* botones enviar y cambiar modo */}
          <div style={{ marginTop: '20px' }}>
            <button type="submit">{isRegister ? 'Registrar' : 'Iniciar sesion'}</button>
            <button
              type="button"
              onClick={() => setIsRegister((s) => !s)}
            >
              {isRegister ? 'Ir a login' : 'Ir a registro'}
            </button>
          </div>
        </form>
      )}

      {/* mostrar mensaje de respuesta */}
      {message && (
        <p className={`message ${messageType}`}>
          {message}
        </p>
      )}

      {/* boton para cambiar tipo de usuario */}
      {role && (
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => {
              setRole(null);
              setMessage('');
              setForm({ nombre: '', email: '', password: '' });
            }}
            style={{ backgroundColor: '#6c757d' }}
          >
            Cambiar tipo (actual: {role})
          </button>
        </div>
      )}
    </div>
  );
}
