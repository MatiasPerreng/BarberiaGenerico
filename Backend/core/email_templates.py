from models import Visita


# ======================================================================================
# EMAIL CONFIRMACIÓN
# ======================================================================================

def generar_email_confirmacion(visita: Visita) -> str:
    cliente = visita.cliente
    servicio = visita.servicio
    barbero = visita.barbero

    fecha = visita.fecha_hora.strftime("%d/%m/%Y")
    hora = visita.fecha_hora.strftime("%H:%M")

    return f"""
👑 KING BARBER 👑

Hola {cliente.nombre},

Tu turno fue confirmado con éxito ✨  
Estás a un paso de vivir la experiencia **King Barber**, donde cada detalle importa.

━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha: {fecha}
⏰ Hora: {hora}
✂️ Servicio: {servicio.nombre}
👤 Barbero: {barbero.nombre}
━━━━━━━━━━━━━━━━━━━━━━

— Equipo King Barber
"""


# ======================================================================================
# EMAIL CANCELACIÓN
# ======================================================================================

def generar_email_cancelacion(visita: Visita) -> str:
    cliente = visita.cliente
    servicio = visita.servicio
    barbero = visita.barbero

    fecha = visita.fecha_hora.strftime("%d/%m/%Y")
    hora = visita.fecha_hora.strftime("%H:%M")

    return f"""
👑 KING BARBER 👑

Hola {cliente.nombre},

Te informamos que tu turno fue **cancelado** ❌  
Si fue un error o querés reprogramar, podés hacerlo cuando quieras.

━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha: {fecha}
⏰ Hora: {hora}
✂️ Servicio: {servicio.nombre}
👤 Barbero: {barbero.nombre}
━━━━━━━━━━━━━━━━━━━━━━

Gracias por avisar con tiempo 💈

— Equipo King Barber
"""
