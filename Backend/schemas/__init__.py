# AUTH
from .auth import (
    LoginBarberoIn,
    LoginBarberoOut,
    BarberoAuthOut,
    CrearCuentaBarberoIn
)

# CLIENTES
from .cliente import (
    ClienteCreate,
    ClienteUpdate,
    ClienteOut
)

# BARBEROS
from .barbero import (
    BarberoCreate,
    BarberoUpdate,
    BarberoOut,
    BarberoDescansoUpdate  # <--- AGREGADO AQUÍ
)

# SERVICIOS
from .servicio import (
    ServicioCreate,
    ServicioUpdate,
    ServicioOut
)

# HORARIOS
from .horario import (
    HorarioBarberoCreate,
    HorarioBarberoOut
)

# VISITAS
from .visita import (
    VisitaCreate,
    VisitaUpdate,
    VisitaOut
)

# AGENDA / DISPONIBILIDAD
from .agenda import AgendaBarberoOut
from .disponibilidad import *