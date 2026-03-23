# Sistema de Análisis de Feedback - Café de El Salvador

Este proyecto es una solución integral de **Inteligencia de Negocios (BI)** que captura el feedback de clientes a través de WhatsApp, procesa el sentimiento y la categoría mediante un modelo de IA local (Machine Learning), y visualiza métricas en tiempo real en un dashboard profesional alojado en la nube.

---

## 1. Infraestructura y Despliegue (Cloud Stack)

A diferencia de una ejecución local básica, este sistema está desplegado en una arquitectura de nivel empresarial:

* **Servidor Cloud:** AWS EC2 (Ubuntu Server 24.04 LTS).
* **Gestor de Procesos:** PM2 (Garantiza disponibilidad 24/7 y reinicio automático de servicios).
* **Base de Datos:** MongoDB Atlas (Cluster NoSQL en la nube con acceso global).
* **Gateway:** Twilio WhatsApp Business API.

### Estado de los Servicios en Producción
* **Backend (API & Bot):** Running on `http://3.141.244.88:8000`
* **Frontend (Dashboard):** Running on `http://3.141.244.88:3000`

---

## 2. Configuración Técnica

### Dependencias Principales
El sistema requiere las siguientes librerías para su correcto funcionamiento en el entorno virtual (`venv`):
`pip install fastapi uvicorn pymongo python-dotenv scikit-learn joblib twilio python-multipart`

### Variables de Entorno (.env)
El backend se conecta a la base de datos mediante una URI de MongoDB Atlas:
`MONGO_URI=mongodb+srv://esquivelnohemy01_db_user:3Xxe0bkvByKlIvoR@cluster01.63jizie.mongodb.net/`

---

## 3. Customer Journey Map (End-to-End)

1.  **Trigger:** El cliente finaliza su café y escanea un código QR en la mesa.
2.  **Interacción:** Envía un mensaje por WhatsApp (ej. *"La semita estaba rica pero el café tardó mucho"*).
3.  **Captura (Cloud Webhook):** Twilio intercepta el mensaje y lo envía vía Webhook a nuestra **IP de AWS**: `/webhook/whatsapp`.
4.  **Ingesta:** El sistema guarda el mensaje en **MongoDB Atlas** para auditoría y trazabilidad.
5.  **Cerebro de IA (Inferencia Local):** Un modelo de **Machine Learning (SVM)** procesa el texto extrayendo:
    * **Sentimiento:** Positivo, Negativo, Neutral.
    * **Categoría:** Servicio, Calidad, Tiempos, Limpieza.
6.  **Visualización:** El Dashboard en **React** consume la API y actualiza los gráficos automáticamente cada 5 segundos.

---

## 4. Matriz de Valor y Decisiones Gerenciales

| Hallazgo en Dashboard | Decisión de Negocio (Insight) | Impacto |
| :--- | :--- | :--- |
| Alta frecuencia de Negativo en **"Tiempos"** | Reasignación de personal a barra en horas pico. | Mejora en satisfacción del cliente. |
| Quejas recurrentes en **"Calidad"** | Calibración de máquinas o revisión de proveedores. | Consistencia del producto premium. |
| Sentimiento Positivo constante | Identificación de promotores para fidelización. | Aumento de clientes recurrentes. |

---

## 5. Estrategia de IA y Resiliencia

* **Modelo de Machine Learning:** Se utiliza un clasificador **LinearSVC** entrenado localmente. Esto elimina la dependencia de APIs externas, reduce costos y garantiza latencias de respuesta menores a 100ms.
* **Robustez con PM2:** Se implementó **PM2** para monitorear los procesos de Node.js y Python. Si un proceso falla, el gestor lo reinicia automáticamente en milisegundos.
* **Seguridad de Red:** Configuración de **Security Groups en AWS** y **Network Access en MongoDB** para permitir el tráfico seguro entre servicios.

---

## 6. Stack Tecnológico Final

* **Backend:** Python 3.12 / FastAPI (Asíncrono).
* **Frontend:** React.js / Recharts (Dashboard Dinámico).
* **Base de Datos:** MongoDB Atlas (NoSQL Cloud).
* **IA:** Scikit-Learn / Joblib (Inferencia Local).
* **DevOps:** AWS EC2 / PM2 / GitHub.

  ---
  
## 7. Cómo probar el sistema en vivo (Demo)

El sistema se encuentra desplegado en AWS y conectado al Sandbox de Twilio. Para interactuar con la Inteligencia Artificial y ver los resultados en el Dashboard, siga estos pasos:

1. **Conectar al Sandbox:** Envíe un mensaje de WhatsApp al número oficial de pruebas de Twilio: **whatsapp:+14155238886**.
2. **Código de Activación:** El primer mensaje debe ser exactamente el siguiente código para enlazar su sesión:
**`join source-provide`**
3. **Confirmación:** Recibirá un mensaje de Twilio indicando *"You are all set!"*.
4. **Enviar Feedback:** Escriba un mensaje natural simulando ser un cliente de la cafetería. 


