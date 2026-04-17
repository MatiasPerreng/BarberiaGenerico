import os
from pathlib import Path

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
    estadisticas,
    carousel,
    tv,
)

app = FastAPI(
    title="API Barbería",
    version="1.0.0",
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
(STATIC_DIR / "servicios").mkdir(parents=True, exist_ok=True)
(STATIC_DIR / "barberos").mkdir(parents=True, exist_ok=True)
(STATIC_DIR / "carousel").mkdir(parents=True, exist_ok=True)

# =======================
# TEST EMAIL (solo si ENABLE_TEST_EMAIL=true en .env)
# =======================
if os.getenv("ENABLE_TEST_EMAIL", "").lower() in ("true", "1", "yes"):
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
    StaticFiles(directory=str(STATIC_DIR / "servicios")),
    name="media-servicios",
)

app.mount(
    "/media/barberos",
    StaticFiles(directory=str(STATIC_DIR / "barberos")),
    name="media-barberos",
)

app.mount(
    "/media/carousel",
    StaticFiles(directory=str(STATIC_DIR / "carousel")),
    name="media-carousel",
)

# =======================
# CORS
# =======================

_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.62:5173",
    "http://167.62.53.159:5173",
]
_extra = os.getenv("CORS_ORIGINS", "")
if _extra.strip():
    allow_origins = _default_origins + [
        o.strip() for o in _extra.split(",") if o.strip()
    ]
else:
    allow_origins = _default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
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
app.include_router(estadisticas.router)
app.include_router(carousel.router)
app.include_router(tv.router)

# =======================
# HEALTH CHECK
# =======================

@app.get("/")
def health():
    return {"status": "ok"}
