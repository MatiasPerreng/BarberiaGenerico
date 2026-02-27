from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from core.email import enviar_email_confirmacion

from routers import (
    clientes,
    barberos,
    visitas,
    horarios,
    servicios,
    auth,
    admin,
    perfil,
    tv,
)

app = FastAPI(
    title="API Barbería",
    version="1.0.0",
)

# =======================
# TEST EMAIL (temporal)
# =======================

@app.get("/test-email")
async def test_email():
    await enviar_email_confirmacion(
        destinatario="tuemail@gmail.com",
        asunto="Test Barbería",
        cuerpo="Este es un email de prueba desde FastAPI.",
    )
    return {"status": "email enviado"}


# =======================
# STATIC FILES (MEDIA)
# =======================
# 👉 URLs públicas: /media/...
# 👉 Disco real: static/...

app.mount(
    "/media/servicios",
    StaticFiles(directory="static/servicios"),
    name="media-servicios",
)

app.mount(
    "/media/barberos",
    StaticFiles(directory="static/barberos"),
    name="media-barberos",
)

# =======================
# CORS
# =======================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.62:5173",
        "http://167.62.53.159:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# ROUTERS
# =======================

app.include_router(auth.router)
app.include_router(clientes.router)
app.include_router(barberos.router)
app.include_router(servicios.router)
app.include_router(horarios.router)
app.include_router(visitas.router)
app.include_router(admin.router)
app.include_router(perfil.router)
app.include_router(tv.router)

# =======================
# HEALTH CHECK
# =======================

@app.get("/")
def health():
    return {"status": "ok"}
