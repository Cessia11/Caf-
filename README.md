# Sistema de Análisis de Feedback - Café de El Salvador

Este proyecto es una solución integral de inteligencia de negocios que captura el mensaje del cliente a través de WhatsApp, procesa el sentimiento y la categoría del mensaje mediante un modelo de IA local, y visualiza métricas en tiempo real para la toma de decisiones gerenciales.

---

## 1. Configuración y Ejecución Local

### Backend (FastAPI)
1. Instalar dependencias:
   `pip install fastapi uvicorn pymongo python-dotenv scikit-learn joblib twilio`
2. Configurar archivo `.env`:
   `MONGO_URI==mongodb+srv://esquivelnohemy01_db_user:3Xxe0bkvByKlIvoR@cluster01.63jizie.mongodb.net/?appName=Cluster01`
3. Ejecutar servidor:
   `python -m uvicorn main:app --reload` (Puerto 8000)

### Frontend (React)
1. Entrar a la carpeta: `cd cafe-dashboard`
2. Instalar y ejecutar:
   `npm install`
   `npm start` (Puerto 3000)

### Conexión Twilio (Webhook)
Exponer el puerto local usando Ngrok: `ngrok http 8000`. Configurar la URL resultante en la consola de Twilio: `https://tu-url.ngrok-free.app/webhook/whatsapp`.

---

## 2. Customer Journey Map (End-to-End)

* **Punto de Contacto (Trigger):** El cliente termina su consumo y ve un código QR en su ticket o mesa: *"¿Cómo estuvo tu café hoy? Escríbenos al WhatsApp"*.
* **Interacción:** El cliente envía un mensaje natural (ej. "Me encantó la semita, pero el café tardó mucho").
* **Captura (Backend):** Twilio intercepta el mensaje y lo envía vía Webhook a nuestro servidor de manera instantánea.
* **Ingesta de Datos:** El sistema guarda el mensaje crudo en **MongoDB Atlas** para auditoría, adjuntando timestamp y número de remitente.
* **Análisis con IA (El "Cerebro"):** El servidor procesa el texto con un modelo de clasificación local. La IA extrae el **Sentimiento** (Positivo, Negativo, Neutral) y la **Categoría** (Servicio, Calidad, Tiempos, Limpieza).
* **Visualización (Dashboard):** Los datos procesados alimentan gráficos dinámicos en React.
* **Acción:** El gerente revisa el dashboard y toma decisiones operativas basadas en datos reales.

---

## 3. Matriz de Valor (Decisiones de Negocio)

1.  **Decisión Operativa Inmediata:** Si se detecta un alto de sentimiento negativo en "Tiempos" en horas altas, se habilita una segunda caja o se reasigna personal a la barra.
2.  **Gestión de Calidad:** Ante tendencias de quejas sobre "sabor" o "temperatura", se ordena una calibración inmediata de máquinas o revisión de proveedores.
3.  **Estrategia de Fidelización:** Identificación de clientes frecuentes con feedback positivo para el envío de cupones de agradecimiento y fidelización.

---

## 4. Estrategia de IA y Prompts

Para este proyecto se utilizó una estrategia de **Zero-Shot Prompting con Restricción de Esquema Estricta**:

* **Instrucción de Rol:** Se define al modelo como "Analista de Calidad de Café de El Salvador".
* **Formato JSON Estricto:** Se obliga a la IA a responder únicamente en formato JSON para evitar errores de parseo en el backend.
* **Gobernanza de Datos:** Se delimitan las categorías (Servicio, Calidad, Precio, etc.) para mantener la integridad referencial en las gráficas.
* **Resiliencia (Modelo Local):** Para garantizar disponibilidad 24/7 y evitar límites de cuota de APIs externas (como Google Gemini), se entrenó un modelo local de **Machine Learning (SVM)** basado en el dataset generado por los prompts, asegurando latencias de milisegundos.

---

##  5. Arquitectura del Sistema (Diagramas C4)

### Nivel 1: Contexto
Muestra la interacción global entre el Cliente, el Sistema de Feedback y el Gerente.

### Nivel 2: Contenedores
Detalla la comunicación entre el Sandbox de Twilio, el API en FastAPI, el Modelo de IA Local, la base de datos MongoDB y el Dashboard en React.

*(Nota: Los diagramas se encuentran adjuntos en la carpeta /diagramas).*

---

## Stack Tecnológico
* **Backend:** Python / FastAPI
* **Frontend:** React.js / Recharts
* **Base de Datos:** MongoDB Atlas (NoSQL)
* **IA:** Scikit-Learn (Modelo de Clasificación Local)
* **Infraestructura:** Twilio API / Ngrok
