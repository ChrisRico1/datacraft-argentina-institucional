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

Los puntos del mapa son centros urbanos aproximados sin fuente geodésica oficial y nunca representan obras, límites o pertenencia espacial. El polígono oficial aún no está integrado. Monitor PISA es el visualizador oficial vinculado.