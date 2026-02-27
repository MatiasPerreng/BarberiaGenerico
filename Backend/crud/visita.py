from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from datetime import datetime, timedelta, time, date
import random

from models import Visita, Servicio, HorarioBarbero, Barbero
from schemas import VisitaCreate

# ======================================================================================
# CONFIGURACIÓN DE HORA LOCAL (URUGUAY UTC-3)
# ======================================================================================

def obtener_ahora_local() -> datetime:
    """Calcula la hora de Uruguay basándose en UTC (Servidor - 3 horas)."""
    return datetime.utcnow() - timedelta(hours=3)

def obtener_hoy_local() -> date:
    """Retorna la fecha actual de Uruguay."""
    return obtener_ahora_local().date()

# ======================================================================================
# UTILIDADES Y VALIDACIONES
# ======================================================================================

def overlaps(inicio_a: datetime, fin_a: datetime, inicio_b: datetime, fin_b: datetime) -> bool:
    """Detecta si dos rangos de tiempo se solapan."""
    return inicio_a < fin_b and fin_a > inicio_b

def validar_conflicto_descanso(inicio_slot: datetime, duracion_min: int, inicio_desc_str: Optional[str], fin_desc_str: Optional[str]) -> bool:
    """Verifica si el servicio invade el horario de descanso."""
    if not inicio_desc_str or not fin_desc_str:
        return False
    try:
        fecha = inicio_slot.date()
        desc_inicio = datetime.combine(fecha, datetime.strptime(inicio_desc_str, "%H:%M").time())
        desc_fin = datetime.combine(fecha, datetime.strptime(fin_desc_str, "%H:%M").time())
        fin_slot = inicio_slot + timedelta(minutes=duracion_min)
        return overlaps(inicio_slot, fin_slot, desc_inicio, desc_fin)
    except:
        return False

def generar_slots(hora_desde: time, hora_hasta: time, duracion_min: int):
    """Genera los espacios de turnos disponibles."""
    slots = []
    paso = timedelta(minutes=45)
    duracion = timedelta(minutes=duracion_min)
    hoy = obtener_hoy_local()
    actual = datetime.combine(hoy, hora_desde)
    fin_jornada = datetime.combine(hoy, hora_hasta)

    while actual + duracion <= fin_jornada:
        slots.append(actual.time())
        actual += paso
    return slots

# ======================================================================================
# 🔥 LÓGICA DE NEGOCIO: AUTO-COMPLETAR Y ANTI-SPAM
# ======================================================================================

def marcar_visitas_completadas(db: Session) -> None:
    ahora = obtener_ahora_local()
    visitas = db.query(Visita).options(joinedload(Visita.servicio)).filter(Visita.estado == "CONFIRMADO").all()
    for v in visitas:
        if not v.servicio: continue
        fin_turno = v.fecha_hora + timedelta(minutes=v.servicio.duracion_min)
        if fin_turno <= ahora:
            v.estado = "COMPLETADO"
    db.commit()

def cliente_tiene_limite_turnos(db: Session, cliente_id: int, fecha: date) -> bool:
    """Verifica si el cliente ya alcanzó el límite de 2 turnos CONFIRMADOS en el día."""
    inicio = datetime.combine(fecha, time.min)
    fin = datetime.combine(fecha, time.max)
    cantidad = db.query(Visita).filter(
        Visita.id_cliente == cliente_id,
        Visita.fecha_hora >= inicio,
        Visita.fecha_hora <= fin,
        Visita.estado == "CONFIRMADO"
    ).count()
    return cantidad >= 2

# ======================================================================================
# ASIGNACIÓN Y CRUD
# ======================================================================================

def asignar_barbero_automatico(db: Session, fecha_hora: datetime, duracion_min: int) -> Optional[int]:
    fecha = fecha_hora.date()
    hora_str = fecha_hora.strftime("%H:%M")
    inicio = datetime.combine(fecha, time.min)
    fin = datetime.combine(fecha, time.max)
    candidatos = []

    for barbero in db.query(Barbero).filter(Barbero.activo == True).all():
        disponibilidad = get_disponibilidad(db, fecha, None, barbero.id_barbero, duracion_min)
        if hora_str not in disponibilidad["turnos"]: continue
        turnos = db.query(Visita).filter(
            Visita.id_barbero == barbero.id_barbero,
            Visita.fecha_hora >= inicio,
            Visita.fecha_hora <= fin,
            Visita.estado == "CONFIRMADO"
        ).count()
        candidatos.append((barbero.id_barbero, turnos))

    if not candidatos: return None
    min_turnos = min(t[1] for t in candidatos)
    menos_cargados = [idb for idb, t in candidatos if t == min_turnos]
    return random.choice(menos_cargados)

def create_visita(db: Session, visita_in: VisitaCreate) -> Visita:
    servicio = db.query(Servicio).filter(Servicio.id_servicio == visita_in.id_servicio).first()
    if not servicio: raise ValueError("Servicio no existe")

    # 🔥 VALIDACIÓN: Máximo 2 agendas por día
    if cliente_tiene_limite_turnos(db, visita_in.id_cliente, visita_in.fecha_hora.date()):
        raise ValueError("Ya tenés 2 turnos reservados para hoy.")

    # 🔥 VALIDACIÓN DE ÚLTIMO SEGUNDO: Verificar disponibilidad real antes de insertar
    disponibilidad_actual = get_disponibilidad(
        db, 
        visita_in.fecha_hora.date(), 
        visita_in.id_servicio, 
        visita_in.id_barbero
    )
    hora_solicitada = visita_in.fecha_hora.strftime("%H:%M")
    
    if hora_solicitada not in disponibilidad_actual["turnos"]:
        raise ValueError("Lo sentimos, alguien se agendó ese turno segundos antes que vos.")

    if visita_in.id_barbero is None:
        visita_in.id_barbero = asignar_barbero_automatico(db, visita_in.fecha_hora, servicio.duracion_min)
        if not visita_in.id_barbero: raise ValueError("No hay barberos disponibles")

    visita = Visita(
        fecha_hora=visita_in.fecha_hora,
        id_cliente=visita_in.id_cliente,
        id_barbero=visita_in.id_barbero,
        id_servicio=visita_in.id_servicio,
        estado="CONFIRMADO"
    )
    db.add(visita)
    db.commit()
    db.refresh(visita)
    return visita

def update_estado_visita(db: Session, visita_id: int, nuevo_estado: str) -> Visita:
    visita = db.query(Visita).get(visita_id)
    if not visita: raise ValueError("Visita no encontrada")
    visita.estado = nuevo_estado
    db.commit()
    db.refresh(visita)
    return visita

def get_visita_by_id(db: Session, visita_id: int) -> Optional[Visita]:
    return (
        db.query(Visita)
        .options(joinedload(Visita.cliente), joinedload(Visita.servicio), joinedload(Visita.barbero))
        .filter(Visita.id_visita == visita_id)
        .first()
    )

def get_agenda_by_barbero(db: Session, barbero_id: int, fecha: Optional[date] = None):
    marcar_visitas_completadas(db)
    query = (
        db.query(Visita)
        .options(joinedload(Visita.cliente), joinedload(Visita.servicio))
        .filter(Visita.id_barbero == barbero_id, Visita.estado == "CONFIRMADO")
    )
    if fecha:
        inicio = datetime.combine(fecha, time.min)
        fin = datetime.combine(fecha, time.max)
        query = query.filter(Visita.fecha_hora >= inicio, Visita.fecha_hora <= fin)
    return query.order_by(Visita.fecha_hora).all()

def get_visitas_by_barbero(db: Session, barbero_id: int, fecha: Optional[date] = None):
    return get_agenda_by_barbero(db, barbero_id, fecha)

def get_visitas_completadas(db: Session, fecha: Optional[date] = None):
    marcar_visitas_completadas(db)
    query = (
        db.query(Visita)
        .options(joinedload(Visita.cliente), joinedload(Visita.servicio), joinedload(Visita.barbero))
        .filter(Visita.estado == "COMPLETADO")
    )
    if fecha:
        inicio = datetime.combine(fecha, time.min)
        fin = datetime.combine(fecha, time.max)
        query = query.filter(Visita.fecha_hora >= inicio, Visita.fecha_hora <= fin)
    return query.order_by(Visita.fecha_hora.desc()).all()

def get_visitas_completadas_por_barbero(db: Session, barbero_id: int, fecha: Optional[date] = None):
    marcar_visitas_completadas(db)
    query = (
        db.query(Visita)
        .options(joinedload(Visita.cliente), joinedload(Visita.servicio))
        .filter(Visita.estado == "COMPLETADO", Visita.id_barbero == barbero_id)
    )
    if fecha:
        inicio = datetime.combine(fecha, time.min)
        fin = datetime.combine(fecha, time.max)
        query = query.filter(Visita.fecha_hora >= inicio, Visita.fecha_hora <= fin)
    return query.order_by(Visita.fecha_hora.desc()).all()

def get_disponibilidad(db: Session, fecha: date, id_servicio: Optional[int], id_barbero: Optional[int] = None, duracion_override: Optional[int] = None):
    if duracion_override:
        duracion = duracion_override
    else:
        servicio = db.query(Servicio).filter(Servicio.id_servicio == id_servicio).first()
        if not servicio: raise ValueError("Servicio no existe")
        duracion = servicio.duracion_min

    dia_semana = fecha.isoweekday()
    q_horarios = db.query(HorarioBarbero).filter(
        HorarioBarbero.dia_semana == dia_semana,
        HorarioBarbero.fecha_desde <= fecha,
        HorarioBarbero.fecha_hasta >= fecha
    )

    if id_barbero: q_horarios = q_horarios.filter(HorarioBarbero.id_barbero == id_barbero)
    horarios_laborales = q_horarios.all()
    if not horarios_laborales: return {"fecha": fecha, "turnos": []}

    inicio_dia = datetime.combine(fecha, time.min)
    fin_dia = datetime.combine(fecha, time.max)
    q_visitas = db.query(Visita).filter(
        Visita.fecha_hora >= inicio_dia,
        Visita.fecha_hora <= fin_dia,
        Visita.estado != "CANCELADO"
    )
    if id_barbero: q_visitas = q_visitas.filter(Visita.id_barbero == id_barbero)
    visitas = q_visitas.all()

    slots_disponibles = []
    ahora_local = obtener_ahora_local()
    hoy_local = obtener_hoy_local()

    for horario in horarios_laborales:
        barbero = db.query(Barbero).get(horario.id_barbero)
        slots = generar_slots(horario.hora_desde, horario.hora_hasta, duracion)
        for slot in slots:
            inicio_slot = datetime.combine(fecha, slot)
            if fecha == hoy_local and inicio_slot < ahora_local: continue
            if barbero and validar_conflicto_descanso(inicio_slot, duracion, barbero.descanso_inicio, barbero.descanso_fin): continue
            
            fin_slot = inicio_slot + timedelta(minutes=duracion)
            conflicto = False
            visitas_del_barbero = [v for v in visitas if v.id_barbero == horario.id_barbero]
            for visita in visitas_del_barbero:
                inicio_visita = visita.fecha_hora
                v_dur = visita.servicio.duracion_min if visita.servicio else 30
                fin_visita = inicio_visita + timedelta(minutes=v_dur)
                if overlaps(inicio_slot, fin_slot, inicio_visita, fin_visita):
                    conflicto = True
                    break
            if not conflicto: slots_disponibles.append(slot.strftime("%H:%M"))

    return {"fecha": fecha, "turnos": sorted(set(slots_disponibles))}