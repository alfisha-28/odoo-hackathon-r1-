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

## Phase 3B — Implemented ✅

### Bookings (`/api/bookings`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/bookings` | Bearer JWT | any | List bookings |
| POST | `/api/bookings` | Bearer JWT | any | Book a shared resource (checks overlap logic) |
| PATCH | `/api/bookings/:id` | Bearer JWT | ASSET_MANAGER, ADMIN, OWNER | Cancel/reschedule booking |

### Maintenance (`/api/maintenance`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/maintenance` | Bearer JWT | any | List maintenance requests |
| POST | `/api/maintenance` | Bearer JWT | any | Raise maintenance request |
| PATCH | `/api/maintenance/:id` | Bearer JWT | ASSET_MANAGER, ADMIN, TECHNICIAN | Approve/assign/resolve state machine |

---

## Phase 4 — Implemented ✅

### Audits (`/api/audits`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/audits` | Bearer JWT | ASSET_MANAGER, ADMIN, AUDITOR | List audit cycles |
| POST | `/api/audits` | Bearer JWT | ASSET_MANAGER, ADMIN | Create cycle & assignments, auto-populate items |
| PATCH | `/api/audits/:id` | Bearer JWT | ASSET_MANAGER, ADMIN, AUDITOR | Verify item or Close cycle |

### Dashboard & Reports (`/api/dashboard`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/dashboard/kpis` | Bearer JWT | any | Global counts & recent activity for main dashboard |
| GET | `/api/dashboard/analytics`| Bearer JWT | ASSET_MANAGER, ADMIN | Heavy aggregations (utilization, frequency, top assets) |

### Notifications (`/api/notifications`)
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/notifications` | Bearer JWT | any | List current user's notifications |
| PATCH | `/api/notifications` | Bearer JWT | any | Bulk mark notifications as read |
