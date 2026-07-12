# AssetFlow API Routes

## Phase 1 — Implemented ✅

### Auth (`/api/auth`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/api/auth/signup` | Public | — | Register a new employee (EMPLOYEE role) |
| POST | `/api/auth/login` | Public | — | Login, returns JWT token |
| POST | `/api/auth/logout` | Bearer JWT | any | Stateless logout (client must discard token) |

### Departments (`/api/departments`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/departments` | Bearer JWT | any | List all departments (flat with parentId) |
| POST | `/api/departments` | Bearer JWT | ADMIN | Create or update a department (upsert by `id`) |

### Categories (`/api/categories`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/categories` | Bearer JWT | any | List all asset categories with customFields |
| POST | `/api/categories` | Bearer JWT | ADMIN | Create or update a category (upsert by `id`) |

### Employees (`/api/employees`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/employees` | Bearer JWT | any | Paginated list; `?search=&role=&status=&page=&limit=` |
| PATCH | `/api/employees/:id` | Bearer JWT | ADMIN | Update roles, status, or password (manual reset) |

---

## Phase 2 — Implemented ✅

### Assets (`/api/assets`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/assets` | Bearer JWT | any | Paginated list; `?search=&status=&categoryId=&departmentId=&location=&page=&limit=` |
| GET | `/api/assets/:id` | Bearer JWT | any | Full asset detail with allocation/maintenance/status history |
| POST | `/api/assets` | Bearer JWT | ASSET_MANAGER, ADMIN | Register new asset; auto-generates assetTag |
| PATCH | `/api/assets/:id` | Bearer JWT | ASSET_MANAGER, ADMIN | Update name, condition, location, isBookable, or status (AVAILABLE/RESERVED/LOST/RETIRED/DISPOSED only) |

> **Note**: Direct status changes to `ALLOCATED` or `UNDER_MAINTENANCE` via PATCH are blocked — use the allocation/maintenance workflow (Phase 3).

---

## Phase 3 — Not yet implemented

### Allocations (`/api/allocations`)
- `POST /api/allocations` — Allocate asset to employee/department
- `POST /api/allocations/:id/return` — Record asset return

### Transfers (`/api/transfers`)
- `GET /api/transfers` — List transfer requests
- `POST /api/transfers` — Raise transfer request
- `PATCH /api/transfers/:id` — Approve/reject transfer

### Bookings (`/api/bookings`)
- `GET /api/bookings` — List bookings
- `POST /api/bookings` — Book a shared resource
- `PATCH /api/bookings/:id` — Cancel/reschedule booking

### Maintenance (`/api/maintenance`)
- `GET /api/maintenance` — List maintenance requests
- `POST /api/maintenance` — Raise maintenance request
- `PATCH /api/maintenance/:id` — Approve/assign/resolve

---

## Phase 4 — Not yet implemented

### Audits (`/api/audits`)
- `GET /api/audits` — List audit cycles
- `POST /api/audits` — Start audit cycle
- `PATCH /api/audits/:id` — Verify items / close cycle

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/kpis`
- `GET /api/dashboard/analytics`

### Notifications (`/api/notifications`)
- `GET /api/notifications`

### Reports & Uploads
- `GET /api/reports`
- `POST /api/uploads`
