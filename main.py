import os
import time
import uuid
from datetime import datetime
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from twilio.twiml.messaging_response import MessagingResponse
from pymongo import MongoClient
from dotenv import load_dotenv
import joblib  


load_dotenv()

app = FastAPI(title="API Café de El Salvador - Backend Final")

# REQUISITO: Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Conexión a MongoDB
cliente_mongo = MongoClient(os.getenv("MONGO_URI"))
db = cliente_mongo["cafe_el_salvador"]
coleccion_feedback = db["mensajes"]

# 3. Cargar mis Propios modelos de IA entrenados en Colab
print("Cargando IA local...")
modelo_sentimiento = joblib.load('ia_sentimiento.pkl')
modelo_tema = joblib.load('ia_tema.pkl')

def analizar_mensaje_ia(texto):
    """Analiza el texto usando nuestra propia IA entrenada"""
    inicio = time.time()
    try:
        # La IA lee el texto y hace la predicción en tiempo real
        pred_sentimiento = modelo_sentimiento.predict([texto])[0]
        pred_tema = modelo_tema.predict([texto])[0]
        
        latencia = round((time.time() - inicio) * 1000, 2)
        
        return {
            "valido": True,
            "datos": {
                "sentimiento": pred_sentimiento,
                "tema": pred_tema,
                "resumen": "Clasificado por IA local"
            },
            "auditoria": {
                "id_ejecucion": str(uuid.uuid4()),
                "latencia_ms": latencia,
                "version_prompt": "ml-local-v1" # Trazabilidad actualizada
            }
        }
    except Exception as e:
        print(f"Error en análisis local: {e}")
        return {"valido": False}

# --- RUTA 1: WEBHOOK (Recibe de WhatsApp) ---
@app.post("/webhook/whatsapp")
async def webhook_twilio(request: Request):
    formulario = await request.form()
    numero = formulario.get("From")
    mensaje = formulario.get("Body")
    
    # Análisis inmediato con IA
    analisis = analizar_mensaje_ia(mensaje)
    
    # REQUISITO: Guardar en MongoDB con trazabilidad
    documento = {
        "numero_remitente": numero,
        "texto_mensaje": mensaje,
        "timestamp": datetime.now(),
        "estado": "completado" if analisis["valido"] else "error"
    }
    
    if analisis["valido"]:
        documento.update(analisis["datos"])
        documento["metadatos_auditoria"] = analisis["auditoria"]
    
    coleccion_feedback.insert_one(documento)
    return Response(content=str(MessagingResponse()), media_type="application/xml")

# --- RUTAS PARA EL DASHBOARD ---

@app.get("/api/mensajes")
def listar_mensajes():
    """Feed de mensajes recientes"""
    return list(coleccion_feedback.find({}, {"_id": 0}).sort("timestamp", -1).limit(10))

@app.get("/api/sentimientos")
def stats_sentimientos():
    """Datos para gráfico de pastel"""
    pipeline = [{"$group": {"_id": "$sentimiento", "count": {"$sum": 1}}}]
    return list(coleccion_feedback.aggregate(pipeline))

@app.get("/api/temas")
def stats_temas():
    """Datos para gráfico de barras"""
    pipeline = [{"$group": {"_id": "$tema", "count": {"$sum": 1}}}]
    return list(coleccion_feedback.aggregate(pipeline))