import os
from celery import Celery
from celery.schedules import crontab

app = Celery('barberia')

app.conf.update(
    broker_url='redis://localhost:6379/0',
    result_backend='redis://localhost:6379/0',
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Montevideo',
    enable_utc=True,
)

# Esto busca tareas automáticamente en la carpeta services
app.autodiscover_tasks(['services']) 

# --- ESTO ES LO QUE FALTABA: LA AGENDA ---
app.conf.beat_schedule = {
    'verificar-recordatorios-cada-minuto': {
        'task': 'enviar_recordatorios_agenda', # Nombre exacto que pusiste en @app.task
        'schedule': 60.0, # Ejecutar cada 60 segundos
    },
}

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')