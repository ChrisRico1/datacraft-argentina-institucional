# Observatorio: carga de datos

El catálogo se define en `catalog.ts`. Las rutas `/observatorio` y `/observatorio/$slug` usan la misma estructura. No hay backend ni importador público de archivos.

`data/works.json` y `data/metrics.json` comienzan vacíos intencionalmente. Solo incorporar datos tras validar su fuente y alcance. `parseWorks(text, "csv" | "json")` y `loadWorks(url, format)` preparan la carga futura; el segundo se llama desde un evento del navegador, no desde un loader protegido.

## CSV de obras

Encabezado obligatorio:

```csv
id,municipality,jurisdiction,sector,name,service,infrastructure,status,progress,beneficiaries,cutoff,sourceId,territorialScope
```

- `municipality`: referencia del catálogo; `jurisdiction`: PBA o CABA, coherente con municipio.
- `sector`: Alta, Media, Baja o vacío; no asignar por centro municipal.
- `service`: Cloacal o Agua potable; la vista cloacal excluye agua potable.
- `progress`: 0–100 o vacío; `beneficiaries`: entero no negativo o vacío. Vacíos se convierten en null.
- `cutoff`: fecha real ISO YYYY-MM-DD; `sourceId`: identificador de una fuente registrada.
- `territorialScope`: Cuenca o Partido completo. Este último activa el aviso territorial.
- `status`: estado literal de fuente o vacío. `infrastructure`: tipo documentado.
- Identificadores únicos; CSV mal formado o registros inválidos son rechazados, no omitidos silenciosamente.

Las métricas JSON requieren `id,label,value,unit,year,scope,sourceId`. No agregar una métrica municipal como si fuera de cuenca. Los gráficos permanecen vacíos hasta implementar una serie validada con metadatos por visualización; cargar un inventario no habilita automáticamente gráficos ni sumatorias.

## Importador aislado de ACUMAR

`acumar-import.ts` interpreta los CSV oficiales de seguimiento 2024 y 2025, pero no alimenta la ruta pública ni sustituye el inventario comprimido.

- Los servicios se distinguen como `Agua potable`, `Cloacal`, `Mixto` o `Desconocido`. Los registros mixtos no se clasifican automáticamente como cloacales.
- `obra_estado` y `obra_sub_estado` se conservan por separado.
- `obra_id` se conserva como identificador de origen, pero puede repetirse o estar vacío; no es una clave única.
- Las fechas se interpretan como M/D/YYYY cuando esa lectura es inequívoca. Se admite D/M/YYYY cuando el primer componente supera 12; si ambos componentes son <= 12, se mantiene M/D/YYYY como convención dominante.
- El campo `raw` conserva los valores originales del registro.
- La auditoría de los dos archivos completos está en `docs/acumar-works-2024-2025-reconciliation.md`.

Los puntos del mapa son centros urbanos aproximados sin fuente geodésica oficial y nunca representan obras ni pertenencia espacial. El mapa incorpora la geometría **Subcuencas ACUMAR** publicada por IGN en el proyecto Anticipando la Crecida (capa `ign_riesgo:anticipando_crecida_subcuenca_acumar`, EPSG:4326; atribución IGN y ACUMAR). Se prioriza el servicio WFS GeoJSON para aplicar la simbología institucional azul desde Leaflet; si el navegador no puede acceder al WFS (por ejemplo, por restricciones CORS), se utiliza como respaldo el WMS oficial con su estilo predeterminado. La capa se puede activar o desactivar desde el control correspondiente. No enviar `SLD_BODY`: el GeoServer del IGN rechaza estilos dinámicos con el error `Dynamic style usage is forbidden`. Esta geometría representa subcuencas del proyecto Anticipando la Crecida y no debe presentarse como equivalente al límite hidrográfico aprobado por la Resolución ACUMAR 1113/2013 ni confundirse con el límite jurisdiccional. Monitor PISA continúa siendo el visualizador oficial de las capas hidrográfica y jurisdiccional.
