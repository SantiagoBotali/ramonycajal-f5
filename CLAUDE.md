# CLAUDE.md

## Role

Senior full-stack engineer focused on web and mobile applications.
Prioritize usability, simplicity, maintainability, and fast iteration.

## Engineering Priorities

- Mobile-first UX, clean layouts, minimal friction
- Clean architecture, reusable components, strong typing
- Avoid unnecessary complexity and overengineering
- Readable code, performance when relevant

## Preferred Stack

Next.js 15 · TypeScript · Tailwind CSS · React 19 · Framer Motion

---

## Project: Ramón y Cajal F5

App de gestión de partidos y rankings de Fútbol 5 para el grupo "Ramón y Cajal".
Completamente client-side (sin backend, sin API routes, sin base de datos).

### Tech Stack
- **Framework:** Next.js 15.3 (App Router, React 19)
- **Styling:** Tailwind CSS con tema oscuro personalizado
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Storage:** Browser `localStorage` únicamente

### Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home — Top 5 ranking + stats resumen |
| `/ranking` | Ranking completo con filtro RYC |
| `/historial` | Historial de partidos — expandible, editar, eliminar |
| `/nuevo-partido` | Wizard 3 pasos para crear partido |
| `/editar-partido/[id]` | Mismo wizard pre-cargado para editar partido |
| `/jugadores` | Grilla de jugadores |
| `/jugadores/[id]` | Perfil individual con stats dinámicas |

### Estructura de archivos clave

```
src/
├── app/
│   ├── page.tsx                    # Home (rankings dinámicos)
│   ├── ranking/page.tsx            # Ranking general
│   ├── historial/page.tsx          # Historial + delete
│   ├── nuevo-partido/page.tsx      # Crear partido (wizard)
│   ├── editar-partido/[id]/page.tsx # Editar partido (wizard)
│   └── jugadores/[id]/page.tsx     # Perfil jugador
├── components/
│   ├── MatchCard.tsx               # Card expandible con edit/delete
│   ├── RankingCard.tsx             # Fila de ranking
│   ├── PlayerAvatar.tsx            # Avatar con ring RYC
│   ├── PlayerPicker.tsx            # Selector de jugadores (wizard)
│   ├── SoccerField.tsx             # Visualización táctica
│   └── ui/FloatingNav.tsx          # Nav bar inferior
└── lib/
    ├── types.ts                    # Interfaces: Player, Match, PlayerStats, MatchTeam
    ├── data.ts                     # PLAYERS, MATCHES estáticos + funciones de stats
    ├── storage.ts                  # localStorage CRUD
    └── utils.ts                    # cn() helper
```

### Tipos principales (`src/lib/types.ts`)

```ts
interface PlayerStats { pj; pg; pe; pp; tasa; puntos; indice }
interface Player { id; name; isRYC; stats: PlayerStats }
interface MatchTeam { name; players: string[]; score }
interface Match { id; date; team1; team2; isUserCreated? }
```

### Storage (`src/lib/storage.ts`)

Clave localStorage: `"ryc-matches"` · Flag de seed: `"ryc-seeded-v1"`

| Función | Descripción |
|---------|-------------|
| `initializeMatches(staticMatches)` | Seed único de MATCHES estáticos a localStorage |
| `loadStoredMatches()` | Lee todos los partidos de localStorage |
| `saveMatch(match)` | Agrega partido nuevo al inicio |
| `updateMatch(match)` | Reemplaza partido existente por id |
| `deleteMatch(id)` | Elimina partido por id |
| `generateId()` | `user-{timestamp}-{random}` |

**Importante:** `initializeMatches` es idempotente (chequea el flag). Llamar en `useEffect` de cada página que use partidos.

### Stats dinámicas (`src/lib/data.ts`)

Los stats **NO están hardcodeados** — se calculan dinámicamente desde los partidos:

```ts
// Recalcula stats de un jugador desde todos los partidos
calculatePlayerStats(allMatches: Match[], playerName: string): PlayerStats

// Devuelve todos los jugadores con stats calculadas y ordenados por índice
getRankedPlayersFromMatches(allMatches: Match[]): Player[]
```

Fórmulas:
- `tasa = pg / pj * 100`
- `puntos = pg * 3 + pe * 1`
- `indice = puntos * tasa / 100` ← criterio principal de ranking

`getRankedPlayers()` existe pero está deprecado (devuelve stats hardcodeadas estáticas).

### Patrón estándar para páginas con rankings

Todas las páginas que muestran rankings o stats de jugadores siguen este patrón:

```tsx
"use client";
const [allMatches, setAllMatches] = useState<Match[]>([]);
useEffect(() => {
  initializeMatches(MATCHES);
  setAllMatches(loadStoredMatches());
}, []);
const ranked = useMemo(() => getRankedPlayersFromMatches(allMatches), [allMatches]);
```

### Jugadores (`src/lib/data.ts`)

- 25 jugadores estáticos en `PLAYERS[]` — base inmutable (id, name, isRYC, stats iniciales ignoradas)
- 16 miembros RYC definidos en `RYC_SLUGS` (Set de slugs)
- Lookups: `PLAYERS_BY_ID` (Map por id), `PLAYERS_BY_NAME` (Map por name)
- `nameToSlug(name)` — normaliza a kebab-case sin tildes
- `getPlayerImage(nameOrSlug)` — retorna `/jugadores/{slug}.png` o `DefaultImage.png`
- `isRYCPlayer(nameOrSlug)` — boolean

### Partidos estáticos (`src/lib/data.ts`)

7 partidos en `MATCHES[]` (ids: `match-1` a `match-7`, todos de 2026).
Se seedean a localStorage en el primer uso via `initializeMatches`.
Algunos tienen >5 jugadores por equipo (dato histórico, el wizard normaliza a 5).

### Design system (Tailwind)

```
bg           #080c14    fondo principal
surface      #0f1626    cards
surface-2    #161e30    inputs, hover
border       #1e293b    bordes
primary      #10b981    verde — victorias, RYC badge, acciones crear
accent       #3b82f6    azul — highlights secundarios, acciones editar
gold         #f59e0b    oro — #1 ranking
text-primary #f8fafc    texto principal
text-secondary #94a3b8  texto secundario
field        #1a472a    campo de fútbol
```

### MatchCard — edit/delete

`MatchCard` acepta prop `onDelete?: (id: string) => void`.
Botones visibles al expandir la card. Delete tiene confirmación inline.
Edit navega a `/editar-partido/[id]` (Link de Next.js).

### Wizard de partido (nuevo y editar)

3 pasos: `"select"` → `"details"` → `"confirm"`
- **select:** `PlayerPicker` — 5 jugadores por equipo exacto
- **details:** nombres de equipo, marcador (number inputs), fecha (DD/MM/YYYY)
- **confirm:** resumen + guardar

Editar pre-carga datos del partido desde localStorage. Usa `updateMatch` en lugar de `saveMatch`.

---

## Behavior

1. Leer solo los archivos necesarios para la tarea — no explorar el repo desde cero
2. Preferir la solución más simple y robusta
3. Optimizar para mobile
4. No agregar features no pedidas, no overengineer
5. Retornar implementaciones completas con explicaciones concisas
