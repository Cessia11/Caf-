import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function App() {
  const [mensajes, setMensajes] = useState([]);
  const [sentimientos, setSentimientos] = useState([]);
  const [temas, setTemas] = useState([]);

  const fetchData = async () => {
    try {
      // Conexión a los endpoints públicos en AWS
      const resMensajes = await axios.get('http://3.141.244.88:8000/api/mensajes');
      const resSentimientos = await axios.get('http://3.141.244.88:8000/api/sentimientos');
      const resTemas = await axios.get('http://3.141.244.88:8000/api/temas');
      
      setMensajes(resMensajes.data);
      // Ajustamos los datos para que Recharts los entienda
      setSentimientos(resSentimientos.data.map(item => ({ name: item._id, value: item.count })));
      setTemas(resTemas.data.map(item => ({ name: item._id, cantidad: item.count })));
    } catch (error) {
      console.error("Error cargando datos del backend", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Actualización en tiempo real 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>☕ Café de El Salvador - Dashboard</h1>
        <p>Panel de Control de Sentimiento del Cliente</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* 1. Gráfico de Pastel de Sentimientos */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Distribución de Sentimientos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sentimientos} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                {sentimientos.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Gráfico de Barras de Temas */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Temas Frecuentes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={temas}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Feed de Mensajes Recientes  */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Mensajes Recientes (Tiempo Real)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Remitente</th>
              <th style={{ padding: '10px' }}>Mensaje</th>
              <th style={{ padding: '10px' }}>Sentimiento</th>
              <th style={{ padding: '10px' }}>Tema</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((m, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{m.numero_remitente}</td>
                <td style={{ padding: '10px' }}>{m.texto_mensaje}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', background: m.sentimiento === 'positivo' ? '#d4edda' : '#f8d7da' }}>
                    {m.sentimiento || 'Procesando...'}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{m.tema || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
