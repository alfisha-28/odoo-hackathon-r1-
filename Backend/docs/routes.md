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

## Phase 3A — Implemented ✅

### Allocations (`/api/allocations`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/allocations` | Bearer JWT | any | List allocations (Employees only see their own/their dept's) |
| POST | `/api/allocations` | Bearer JWT | ASSET_MANAGER, ADMIN | Allocate asset to employee/department (checks double allocation) |
| POST | `/api/allocations/:id/return` | Bearer JWT | ASSET_MANAGER, ADMIN | Record asset return and update checkInCondition |

### Transfers (`/api/transfers`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/transfers` | Bearer JWT | any | List transfer requests (Employees only see their own) |
| POST | `/api/transfers` | Bearer JWT | any | Raise transfer request for active allocation |
| PATCH | `/api/transfers/:id` | Bearer JWT | ASSET_MANAGER, DEPT_HEAD, ADMIN | Approve/reject transfer (auto-reallocates on approve) |

---

## Phase 3B — Not yet implemented

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
