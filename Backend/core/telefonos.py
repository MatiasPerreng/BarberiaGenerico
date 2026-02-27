# core/telefonos.py

def normalizar_telefono_uy(telefono: str) -> str:

    if not telefono:
        return ""

    tel = telefono.strip().replace(" ", "").replace("-", "")

    # ya viene en formato internacional
    if tel.startswith("598"):
        return tel

    # viene con 0 adelante
    if tel.startswith("0"):
        return "598" + tel[1:]

    # viene sin 0 (ej: 95064060)
    if len(tel) == 8:
        return "598" + tel

    # fallback (lo devuelve igual, pero no rompe)
    return tel
