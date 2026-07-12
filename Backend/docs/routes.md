# AssetFlow API Routes

## Phase 1 — Implemented

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

## Phase 2 — Not yet implemented
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- Assets CRUD (`/api/assets`)
- Allocations (`/api/allocations`)
- Transfer requests (`/api/transfers`)

## Phase 3 — Not yet implemented
- Bookings (`/api/bookings`)
- Maintenance requests (`/api/maintenance`)

## Phase 4 — Not yet implemented
- Audit cycles & assignments (`/api/audits`)
- Notifications (`/api/notifications`)
- Reports (`/api/reports`)
- Dashboard stats (`/api/dashboard`)
- File uploads (`/api/uploads`)
