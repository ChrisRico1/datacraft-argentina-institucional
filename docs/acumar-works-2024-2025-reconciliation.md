# ACUMAR — reconciliación de los seguimientos de obras 2024 y 2025

## Alcance

Esta auditoría utiliza los dos CSV completos entregados para el proyecto Infraestructura Cloacal:

- Seguimiento de obras de agua y cloaca, segundo semestre de 2024.
- Seguimiento de obras de agua y cloaca, segundo semestre de 2025.

Los archivos se analizaron como cortes independientes. No se incorporan al inventario público ni se fusionan sus filas. La comparación por nombre sirve para detectar coincidencias candidatas, no para certificar continuidad administrativa de una obra.

## Identificación de los archivos recibidos

| Corte | Archivo recibido | Tamaño | SHA-256 |
|---|---|---:|---|
| 2024 | seguimient_-obras_agua_cloaca_2024 (1).csv | 49.639 bytes | 0e76dd57f34a672ac5118bbeba52c0caed7e365f8c1cb9d12264fa70fc51e345 |
| 2025 | seguimiento_obras_agua_cloaca_2025 (1).csv | 93.579 bytes | ca912df7cabc00724e8ce3e07283ed566a80292ffc97ddd82abe34269ab1316c |

Los archivos son CSV UTF-8. El archivo 2024 presenta 23 columnas en el encabezado, tres de ellas vacías (Unnamed: 20 a Unnamed: 22), y cuatro filas completamente vacías. Al omitir únicamente esas filas vacías quedan 207 registros. El archivo 2025 contiene 20 columnas y 412 registros.

## Perfil de registros por servicio

La clasificación se realizó sobre el valor original de tipo_fluido, normalizando espacios, saltos de línea y separadores. Los registros mixtos se mantienen separados; no se contabilizan como obras exclusivamente cloacales.

| Corte | Agua | Cloaca | Agua y cloaca | Total con datos |
|---|---:|---:|---:|---:|
| 2024 | 126 | 77 | 4 | 207 |
| 2025 | 196 | 213 | 3 | 412 |

En 2024 aparece además un valor AGUA con espacio final, normalizado como agua. En 2025 los valores mixtos aparecen como AGUA - CLOACA y AGUA seguido de un salto de línea y CLOACA. El importador ahora los reconoce como Mixto, sin mezclarlos con agua potable ni con cloacas.

## Identificadores

Los identificadores obra_id no son claves únicas y no deben utilizarse para deduplicar:

- En 2024, 39 filas pertenecen a grupos con identificador no vacío repetido. Se observan, entre otros, SP3, 12B y 8.
- En 2025, 28 filas pertenecen a grupos con identificador no vacío repetido. Se observan, entre otros, S/P3, 4a y 3a.
- En 2025 hay 12 registros con datos y obra_id vacío.
- Las cuatro filas vacías de 2024 se excluyen mediante skipEmptyLines: greedy; no son obras sin identificador.

El importador conserva cada fila, deja sourceWorkId en null cuando el identificador está vacío y no descarta registros por identificadores repetidos. Cualquier identidad interna futura debe distinguir al menos el corte y la fila de origen, además de conservar el identificador ACUMAR sin tratarlo como único.

## Fechas de inicio

La convención dominante de ambos archivos es M/D/YYYY. El corte 2024 contiene cuatro valores inequívocos en formato D/M/YYYY, identificables porque el primer componente supera 12: 22/12/2024, 17/8/2023 (dos registros) y 18/9/2023.

| Corte | Fechas interpretables | Sin fecha o marcador de ausencia | Formatos inválidos |
|---|---:|---:|---:|
| 2024 | 170 | 37 | 0 |
| 2025 | 356 | 56 | 0 |

El parser admite ambas convenciones cuando la fecha es inequívoca. Si ambos componentes son iguales o menores que 12, conserva la interpretación dominante M/D/YYYY; no existe información en la celda para distinguir con certeza el orden. Fechas imposibles o formatos no reconocidos permanecen como null. No se convierten marcadores de ausencia en fechas.

## Coincidencias entre los cortes cloacales

Se compararon los 77 registros exclusivamente cloacales de 2024 con los 213 de 2025 mediante el nombre de obra normalizado (minúsculas, acentos y espacios). El resultado es:

- 68 coincidencias textuales normalizadas.
- 9 nombres presentes solo en el corte 2024.
- 145 nombres presentes solo en el corte 2025.

Estas cantidades no demuestran que existan 145 obras nuevas ni que nueve hayan sido eliminadas. Puede haber cambios de denominación, agrupamientos, desagregaciones o modificaciones administrativas que no se resuelven con una comparación textual. Los registros mixtos quedan fuera de esta comparación.

Entre las 68 coincidencias de nombre se observaron diferencias en:

| Campo | Coincidencias con valores diferentes |
|---|---:|
| Estado de ejecución | 12 |
| Subestado | 61 |
| Porcentaje de avance | 14 |
| Beneficiarios | 1 |
| Contratista | 6 |
| Fecha de inicio | 3 |

Los valores se compararon después de normalizar espacios y formatos numéricos evidentes. Las diferencias se conservan como diferencias entre cortes; no se reemplaza el dato de un año por el del otro. En particular, obra_estado y obra_sub_estado son dimensiones distintas: una obra puede figurar como finalizada y, a la vez, faltar su puesta en servicio o estar en servicio parcial.

## Cambios realizados en el importador

En src/features/observatorio/acumar-import.ts:

- Se agrega el servicio Mixto para los registros que informan agua y cloaca.
- Se interpretan las fechas D/M inequívocas del archivo 2024, manteniendo M/D como convención para fechas ambiguas.
- Se conserva sourceWorkId como identificador de origen, permitiendo valores vacíos y repetidos.
- Se mantienen por separado executionStatus y subStatus.
- Se conserva el registro original en raw; no se sobrescriben los valores fuente.

Las pruebas cubren los formatos y anomalías observados en los dos cortes. La función sigue siendo un importador aislado: no reemplaza works.json.gz.b64, no cambia la ruta pública y no publica automáticamente los CSV.

## Límites territoriales y decisiones de integración

Los archivos informan provincia, departamento y, en ciertos casos, listas de jurisdicciones en un mismo campo. No contienen coordenadas de obra ni una asignación verificable a sector alto, medio o bajo de la cuenca. Por lo tanto:

- No se asignan sectores de cuenca a partir del municipio o departamento.
- No se convierten los puntos de referencia municipal en ubicaciones de obras.
- No se infiere pertenencia hidrográfica por el nombre del municipio.
- No se distribuyen beneficiarios ni avances entre jurisdicciones.
- Los registros mixtos no se incorporan automáticamente a la vista de obras exclusivamente cloacales.
- No se mezclan los cortes 2024 y 2025 como una única foto de situación.

## Estado del inventario publicado

El recurso comprimido actualmente usado por la ruta pública permanece sin cambios en esta PR. La reconciliación de los CSV originales no autoriza por sí sola a sustituirlo: antes de una futura actualización deberán definirse la identidad estable por fila y corte, el tratamiento de los registros mixtos y la correspondencia documentada de los registros que no coinciden por nombre.

La PR no modifica la página pública, los filtros, el mapa, los indicadores ni la geometría. Tampoco modifica la PR #81, que continúa siendo un cambio separado sobre los estados de carga del inventario.
