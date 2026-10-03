# Cartas del día: cómo funcionan los archivos

La app trae dentro el primer mes: 30 cartas por voz (cristiana, budista y universal) en español, inglés y portugués. El resto del año viaja en archivos que la app descarga sola.

| Archivo | Qué es | ¿Lo editas? |
|---|---|---|
| `es-biblioteca.json`, `en-biblioteca.json`, `pt-biblioteca.json` | La biblioteca del año: cartas del día y cartas con fecha (Adviento, Pascua, lunas llenas, Día de las Madres…). | No. Se genera; cuando haya cartas nuevas te llegará un archivo actualizado y solo lo reemplazas. |
| `es.json`, `en.json`, `pt.json` | Tus cartas publicadas a mano: nuevas o con fecha. Empiezan vacías. | Sí. |

Los seis archivos van en la carpeta `cartas/` del repositorio, junto a `index.html`. Si falta alguno, la app sigue funcionando con lo que tenga.

## Publicar una carta a mano

Agrégala a la lista `cartas` de `es.json` (o de `en.json` o `pt.json`).

## Formato

```json
{
  "version": 1,
  "cartas": [
    {
      "id": "r-2026-11-02-c",
      "voz": "cristiano",
      "fecha": "2026-11-02",
      "temas": ["fe", "relaciones"],
      "texto": "Primer párrafo.\n\nSegundo párrafo.",
      "cita": { "t": "Texto del versículo en RV1909.", "ref": "Juan 11:25" },
      "cierre": "Una línea para llevar."
    }
  ]
}
```

| Campo | Obligatorio | Qué hace |
|---|---|---|
| `id` | Sí | Único y que no cambie nunca. Si repites el id de una carta de la app, la tuya la reemplaza. |
| `voz` | Sí | `cristiano`, `budista` o `universal`. Mezcla recibe las tres voces; espiritual recibe universal y budista. |
| `texto` | Sí | Separa los párrafos con `\n\n`. Van de 60 a 150 palabras, en segunda persona y sin firma. |
| `cierre` | Sí | Una frase corta para llevar. |
| `fecha` | No | `AAAA-MM-DD`. Esa carta llega ese día a todos los de esa voz, salvo que sea su primer día (ese día llega la de bienvenida). También puedes usar `fechas` (una lista) o `md` (`MM-DD`, se repite cada año). |
| `temas` | No | Qué cultiva: `calma`, `confianza`, `animo`, `fe`, `relaciones`, `cuerpo`, `proposito`. Una carta sin fecha llega con más probabilidad a quien cultiva esos temas. |
| `cita` | No | `t` es el texto y `ref` la referencia. Biblia: solo RV1909, con la ortografía moderna que usa la app («a», no «á»). Budista: en palabras propias, con `ref` «Inspirado en…». |
| `momento` | No | `fin_mes`, `inicio_mes`, `primera` o `primer_mes`. Úsalo solo para reemplazar las de la app. |

## Reglas de voz

- **Sin firma.** La carta es la enseñanza.
- **No se ponen palabras en boca de Dios.** Se habla de Él; las palabras de Dios solo aparecen cuando las cita la Escritura.
- **Nada de promesas de salud** (curar, sanar la ansiedad…). Si un tema es pesado, la carta invita a pedir ayuda.
- **Un momento concreto de la vida,** no ideas abstractas: el fin de mes, una relación que terminó, poner un límite.

Revisa que el archivo sea JSON válido antes de subirlo (por ejemplo, en jsonlint.com). Si tiene un error, la app lo ignora y sigue con las cartas que trae.
