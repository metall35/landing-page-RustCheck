# Limpieza y configuración de Google Analytics 4

Documento de trabajo para dejar la medición confiable. Se divide en lo que ya se
arregló en el código y lo que hay que hacer a mano en la consola de GA4.

Propiedad: `GA_PROPERTY_ID = 15343179608` · Measurement ID: `G-34J4G4DS01`

---

## Parte A — Ya corregido en el código

No requiere acción en la consola. Se documenta para que se entienda por qué los
números de antes y los de ahora no van a coincidir.

### A.1 Cada paso del formulario se contaba dos veces

`trackFormEvent("form_step_view", { step_number: N })` disparaba **dos** eventos:
el genérico `form_step_view` y el numerado `form_step_N`. El backend contaba los
dos, así que cada vista de paso valía 2 — tanto en GA4 como en el dashboard
interno.

Ahora se emite un solo evento por paso: `form_step_N`.

> **Impacto en el histórico:** todos los conteos de pasos anteriores a este
> cambio están inflados ~2x. No son comparables con los nuevos.

### A.2 Las fuentes de tráfico eran inventadas

El endpoint del dashboard rellenaba el desglose de redes sociales con
porcentajes fijos sobre el total de sesiones cuando no había datos reales:

```
Facebook  35%     TikTok    8%
Instagram 25%     YouTube   4%
Google    20%     Directo   8%
```

Y el conteo real **siempre** daba cero, porque la fuente de tráfico solo viajaba
en el POST de la reserva y nunca llegaba a los eventos de analytics. O sea que
ese panel mostraba el relleno inventado el 100% del tiempo.

Ahora: la atribución viaja en todos los eventos, el desglose se arma con
`sessionSource` real de GA4, y si no hay datos se muestra vacío en vez de
inventar.

### A.3 "Sessions" no eran sessions

Se usaba el `eventCount` de `page_view` como total de sesiones, y los usuarios
se estimaban como `sessions * 0.85`. Ahora se piden las métricas reales
`sessions` y `totalUsers` a la GA Data API.

### A.4 El embudo estaba forzado

Una cadena de `Math.max` obligaba a que cada paso fuera mayor o igual al
siguiente, lo que tapaba justamente los huecos de tracking que el embudo debería
revelar. Ahora se reportan los conteos como se miden.

Además el porcentaje de abandono se calculaba contra el paso 2 en vez de contra
la gente que llegó a ese paso, lo que hacía que todas las tasas se leyeran
mucho más bajas de lo que eran.

---

## Parte B — Qué hay que hacer en la consola de GA4

### B.1 Excluir tráfico interno — *prioridad alta*

Hoy las visitas del equipo, del cliente y de quien esté probando el sitio
cuentan como sesiones reales y ensucian la tasa de conversión.

**Admin → Data Streams → el stream web → Configure tag settings → Show all →
Define internal traffic**

Crear una regla con las IPs públicas de:
- La oficina de Rust Check Newmarket
- El equipo que desarrolla / administra el sitio

Después: **Admin → Data Settings → Data Filters** → activar el filtro
`Internal Traffic` en modo **Active** (viene en *Testing* por defecto, y en
*Testing* no filtra nada).

> Se necesita que el cliente pase la IP pública de la oficina.
> La sacan entrando a `whatismyip.com` desde la red del taller.

### B.2 Marcar los Key Events (conversiones) — *prioridad alta*

Ahora mismo la propiedad no tiene conversiones definidas, así que ningún reporte
de GA muestra rendimiento real y no se puede optimizar campañas contra ellas.

**Admin → Events → marcar como Key Event:**

| Evento | Qué es |
|---|---|
| `booking_submit_success` | Cita agendada (conversión principal) |
| `lead_submit_success` | Solicitud de llamada |
| `click_phone` | Click en el teléfono |
| `generate_lead` | Evento recomendado GA4, cubre ambos leads |

### B.3 Retención de datos

**Admin → Data Settings → Data Retention** → subir de 2 meses (default) a
**14 meses**. Sin esto no se pueden hacer comparativas año contra año ni
análisis de cohortes.

### B.4 Vincular Google Ads

Si hay campañas de Google Ads corriendo: **Admin → Product Links → Google Ads
Links**. Sin el vínculo, el tráfico de Ads entra como `google / cpc` sin datos
de campaña y no se pueden importar las conversiones.

### B.5 Revisar los eventos viejos

Después del arreglo A.1, el evento `form_step_view` **ya no se envía**. Va a
seguir apareciendo en los reportes históricos. No se puede borrar, pero conviene
saber que a partir de la fecha del deploy ese evento queda en cero.

---

## Parte C — Sobre "limpiar" el histórico

Hay que ser claros con esto porque suele generar expectativas equivocadas:

**GA4 no permite borrar datos históricos de forma selectiva.** No existe un
"resetear métricas". Lo único disponible es:

- **Data Deletion Requests** (Admin → Data Deletion Requests): sirve para borrar
  parámetros y datos de usuario por motivos de privacidad, no para depurar
  métricas. Tarda hasta 7 días y no revierte conteos.
- **Filtros de datos**: aplican hacia adelante, no retroactivamente.

Entonces hay dos caminos reales:

| Opción | Qué implica |
|---|---|
| **Seguir en la propiedad actual** | Se marca una fecha de corte (el deploy de estos cambios) y todo lo anterior se considera no confiable. Se conserva el histórico como referencia gruesa. |
| **Crear propiedad nueva** | Arranca en cero y limpio desde el día uno, con la configuración correcta. Se pierde toda comparación con el histórico y hay que cambiar el Measurement ID en el sitio. |

**Recomendación:** quedarse en la propiedad actual, marcar la fecha de corte y
aplicar B.1–B.4. El histórico sucio es de pocos meses y el costo de perder la
comparación no compensa.

---

## Anexo — Inventario de eventos que envía el sitio

Útil para configurar los reportes personalizados.

**Embudo del formulario**
- `form_step_1` … `form_step_8` — vista de cada paso (con `step_number`, `step_name`)
- `form_step_complete` — avance confirmado de un paso
- `form_option_selected` — selección dentro de un paso
- `form_submit_error` — error al enviar

**Conversiones**
- `booking_submit_success` — cita agendada
- `lead_submit_success` — solicitud de llamada
- `generate_lead` — con `lead_type`: `appointment_booking` | `call_back_request`
- `vehicle_completed_sedan` | `_suv` | `_pickup` | `_other`

**Interacción**
- `begin_checkout` — arranque del formulario
- `select_content` — click en CTA (`item_id`: `book_now` | `set_appointment_hero`)
- `click_book_now_navbar`, `click_hero_appointment`
- `contact`, `click_phone`
- `view_item` — click en el mapa / ubicación

Todos los eventos llevan ahora el parámetro `traffic_source` con la fuente
detectada (utm, gclid, fbclid, ttclid o referrer).

---

## Pendientes que dependen del cliente

1. **IP pública de la oficina** para el filtro de tráfico interno (B.1).
2. **Acceso de administrador** a la propiedad GA4 para aplicar B.1–B.4.
3. **Confirmar si hay Google Ads** activo, para el vínculo de B.4.
