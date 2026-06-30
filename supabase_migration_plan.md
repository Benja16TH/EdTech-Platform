# Supabase Migration Plan — EdTech Platform

> Fase v2.0.1 — Foundation setup. Conexión preparada, servicios listos,
> migración de datos aún no iniciada.

---

## 1. Estado actual

| Componente | Estado |
|---|---|
| Cliente Supabase (`src/lib/supabaseClient.ts`) | Creado, usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` |
| Variables de entorno (`.env.example`) | Creado |
| Servicios (`src/services/`) | Preparados con comentarios, aún usan datos mock |
| Esquema SQL (`supabase/migrations/20260530221003_001_initial_schema.sql`) | Listo (8 tablas principales) |
| Esquema documentado (`database_schema_plan.md`) | Creado en v1.16 |

---

## 2. Conexión creada

Archivo: `src/lib/supabaseClient.ts`

- Exporta `supabase` (cliente inicializado o `null` si no hay env vars).
- Exporta `isSupabaseConfigured()` para consultar si hay conexión disponible.
- Muestra un warning en consola si las variables de entorno no están configuradas.
- La app sigue funcionando con datos mock mientras no se configuren las env vars.

### Para conectar un proyecto Supabase real:

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ejecutar la migración inicial desde `supabase/migrations/20260530221003_001_initial_schema.sql` en el SQL Editor de Supabase.
3. Copiar `.env.example` a `.env` en la raíz del proyecto.
4. Completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` desde Project Settings > API.
5. Opcional: configurar Supabase Auth para login real (reemplazar Login.tsx actual).

---

## 3. Servicios preparados

Todos los servicios en `src/services/` mantienen su lógica actual con datos mock,
pero incluyen un comentario indicando que están preparados para migrar a Supabase.

| Servicio | Fuente de datos actual | Tabla Supabase futura |
|---|---|---|
| `userService.ts` | `mockUsers` + `mockCollaborators` | `users` |
| `courseService.ts` | `mockCourses` | `courses` |
| `enrollmentService.ts` | `mockEnrollments` + `mockAssignments` | `course_assignments` + `lesson_progress` |
| `certificateService.ts` | `mockCertificates` | (pendiente de crear en Supabase) |
| `activityService.ts` | arreglo en memoria | `activity_logs` |

---

## 4. Entidades a migrar (orden recomendado)

La migración debe realizarse **una entidad a la vez**, verificando que todo
siga funcionando después de cada paso.

### Fase 1 — Autenticación y Usuarios
1. Configurar **Supabase Auth** (reemplazar login mock).
2. Migrar `users` → mantener sincronía con `auth.users`.
3. Actualizar `userService.ts` para leer/escribir desde Supabase.

### Fase 2 — Cursos, Módulos y Lecciones
4. Migrar `courses` → tabla `courses`.
5. Migrar `modules` y `lessons` → tablas `modules` y `lessons`.
6. Actualizar `courseService.ts`.

### Fase 3 — Asignaciones y Progreso
7. Migrar asignaciones → tabla `course_assignments`.
8. Migrar progreso de lecciones → tabla `lesson_progress`.
9. Actualizar `enrollmentService.ts`.

### Fase 4 — Evaluaciones
10. Migrar evaluaciones finales y preguntas.
11. Migrar intentos de evaluación → tabla `assessment_attempts`.
12. Actualizar componentes `FinalAssessmentManagement`, `TakeFinalAssessment`.

### Fase 5 — Certificados y Actividad
13. Migrar certificados.
14. Migrar logs de actividad.
15. Actualizar `certificateService.ts` y `activityService.ts`.

### Fase 6 — Notificaciones y Soporte
16. Migrar notificaciones.
17. Migrar tickets de soporte.
18. Actualizar componentes `NotificationCenter`, `TechnicalSupport`, `AdminSupportPanel`.

---

## 5. Pasos técnicos por servicio

Cada servicio sigue este patrón de migración:

```typescript
// Antes (mock):
import { mockData } from '../data/mockData';
let data = [...mockData];
export function getItems(): Promise<Item[]> {
  return Promise.resolve([...data]);
}

// Después (Supabase):
import { supabase } from '../lib/supabaseClient';
export async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase.from('items').select('*');
  if (error) throw error;
  return data as Item[];
}
```

---

## 6. Verificación

Antes y después de cada fase de migración:

- `npm run build` — compila sin errores.
- `npm run lint` — sin errores de linting.
- `npm run typecheck` — tipos correctos.
- Prueba manual en navegador: login, cursos, módulos, evaluaciones, certificados.

---

## 7. Posibles siguientes pasos

1. Crear un proyecto Supabase real y ejecutar la migración SQL.
2. Configurar autenticación con Supabase Auth (`signInWithPassword`).
3. Migrar usuarios primero (Fase 1).
4. Agregar Row Level Security (RLS) policies para cada tabla.
5. Configurar environment variables en el deploy (Vercel, Netlify, etc.).
6. Eliminar datos mock gradualmente a medida que se migra cada entidad.
