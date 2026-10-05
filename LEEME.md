# «Tu paso de hoy»: cómo funcionan los archivos

La app trae dentro los pasos de nivel 1 y los de fechas especiales, en español, inglés y portugués. El resto de la biblioteca (niveles 2 y 3) viaja en archivos que la app descarga sola.

| Archivo | Qué es | ¿Lo editas? |
|---|---|---|
| `es-biblioteca.json`, `en-biblioteca.json`, `pt-biblioteca.json` | La biblioteca completa: pasos de vida, de práctica en la app, de escritura y con fecha. | No. Se genera; cuando haya pasos nuevos te llegará un archivo actualizado y solo lo reemplazas. |
| `es.json`, `en.json`, `pt.json` | Tus pasos publicados a mano. Empiezan vacíos. | Sí. |

Los seis archivos van en la carpeta `pasos/` del repositorio, junto a `index.html` (al lado de `cartas/`). Si falta alguno, la app sigue funcionando con lo que tenga.

## Publicar un paso a mano

Agrégalo a la lista `pasos` de `es.json` (o de `en.json` o `pt.json`):

```json
{
  "version": 1,
  "pasos": [
    {
      "id": "r-agradecer-maestro",
      "tipo": "vida",
      "voz": "todas",
      "nivel": 1,
      "temas": ["relaciones"],
      "md": "05-15",
      "texto": "Escríbele hoy a alguien que te enseñó algo importante y dile qué fue.",
      "porque": "Casi nadie sabe lo que dejó en otros."
    }
  ]
}
```

| Campo | Obligatorio | Qué hace |
|---|---|---|
| `id` | Sí | Único y que no cambie nunca. Si repites el id de un paso de la app, el tuyo lo reemplaza. |
| `tipo` | Sí | `vida` (una acción en el mundo), `escritura` (una pregunta; la respuesta se guarda en el Diario) o `practica` (abre una parte de la app; necesita `abrir`). |
| `texto` | Sí | Una o dos frases, en segunda persona. Una sola acción que se haga en minutos o sea una sola decisión. |
| `voz` | No | `todas` (sin vocabulario religioso), `cristiano`, `budista` o `universal`. Por defecto, `todas`. |
| `nivel` | No | 1 (Chispa), 2 (Presencia) o 3 (Luz). Sube con la vela de la persona, nunca con días seguidos. |
| `temas` | No | `calma`, `confianza`, `animo`, `fe`, `relaciones`, `cuerpo`, `proposito`. Llega con más probabilidad a quien cultiva esos temas. |
| `porque` | No | Una línea que explica por qué sirve. Sin promesas de salud. |
| `abrir` | Solo práctica | `ritual:manana`, `ritual:nucleo`, `ritual:noche`, `ahora`, `ancla`, `salmos`, `afirmaciones`, `manifestacion`, `meditacion`, `historias`, `lobueno`, `journal`, `vision`, `arquitecto`, `sonido`, `constructor`, `cartas`. |
| `fecha` / `fechas` / `md` | No | `AAAA-MM-DD`, una lista de fechas, o `MM-DD` (se repite cada año). Ese día llega ese paso. |

## Reglas

- **Sin tracking forzoso:** nada de rachas, retos de X días ni culpa.
- **No se ponen palabras en boca de Dios.**
- **Nada de promesas de salud** (calmar ansiedad, dormir mejor…).
- **Concreto y verificable:** al final del día la persona sabe si lo hizo.

Revisa que el archivo sea JSON válido antes de subirlo (por ejemplo, en jsonlint.com). Si tiene un error, la app lo ignora y sigue con los pasos que trae.
