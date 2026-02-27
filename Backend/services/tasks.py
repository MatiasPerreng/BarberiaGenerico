from core.celery import app
from datetime import datetime, timedelta
from sqlalchemy.orm import joinedload

# Imports desde la raiz
from database import SessionLocal 
from models import Visita 
from .whatsapp import enviar_recordatorio_whatsapp

@app.task(name="enviar_recordatorios_agenda")
def verificar_recordatorios():
    db = SessionLocal()
    try:
        # CORRECCION DE HORA: El servidor usa UTC, restamos 3 para Uruguay
        # Usamos utcnow para tener una base solida
        ahora_uy = datetime.utcnow() - timedelta(hours=3)
        
        # Definimos el rango: buscamos citas que ocurran dentro de 55 a 65 minutos
        rango_inicio = ahora_uy + timedelta(minutes=55)
        rango_fin = ahora_uy + timedelta(minutes=65)

        print("--- EJECUTANDO VERIFICACION DE RECORDATORIOS ---")
        print(f"Reloj Uruguay: {ahora_uy.strftime('%H:%M:%S')}")
        print(f"Buscando citas entre {rango_inicio.strftime('%H:%M')} y {rango_fin.strftime('%H:%M')}")

        citas = db.query(Visita).options(
            joinedload(Visita.cliente),
            joinedload(Visita.servicio),
            joinedload(Visita.barbero)
        ).filter(
            Visita.fecha_hora.between(rango_inicio, rango_fin),
            Visita.notificado_wsp == False,
            Visita.estado == 'CONFIRMADO'
        ).all()

        if not citas:
            print("Resultado: No se encontraron citas en este rango horario.")
            return

        for cita in citas:
            # Verificacion de seguridad por si el cliente no tiene telefono
            if not cita.cliente or not cita.cliente.telefono:
                print(f"AVISO: Saltando cita {cita.id_visita}: Cliente sin telefono.")
                continue

            print(f"PROCESANDO: Iniciando envio para: {cita.cliente.nombre} (ID: {cita.id_visita})")
            
            resultado = enviar_recordatorio_whatsapp(cita)
            
            # Verificamos si Meta devolvio un ID de mensaje (exito)
            # Nota: Meta devuelve una lista 'messages' en caso de exito
            if resultado and "messages" in resultado:
                cita.notificado_wsp = True
                print(f"OK: Mensaje enviado a {cita.cliente.telefono}")
            else:
                # Intentamos capturar el error de la respuesta de Meta
                error_detail = "Sin respuesta de Meta"
                if resultado and "error" in resultado:
                    error_detail = resultado["error"].get("message", "Error desconocido")
                
                print(f"ERROR: No se pudo enviar a {cita.cliente.telefono}. Detalle: {error_detail}")
        
        db.commit()
        print("--- FIN DEL PROCESO ---")

    except Exception as e:
        print(f"ERROR CRITICO EN TASK: {str(e)}")
        db.rollback()
    finally:
        db.close()