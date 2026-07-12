# FlowSync API Route Specification
This document outlines the compact RESTful API route structure for the **FlowSync** backend. To optimize for the hackathon timeline, the API is consolidated into **29 clean endpoints** while maintaining full role-based access control (RBAC).

---

## 1. Authentication (3 Routes)

### `POST /api/auth/signup`
*   **Description**: Registers a new employee account.
*   **Access**: Public (Default role is always `EMPLOYEE`).
*   **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@company.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response (201)**: `{ "id": "emp_uuid", "name": "Jane Doe", "email": "jane@company.com", "role": "EMPLOYEE" }`

### `POST /api/auth/login`
*   **Description**: Authenticates employee credentials.
*   **Access**: Public.
*   **Request Body**:
    ```json
    {
      "email": "jane@company.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response (200)**: `{ "token": "jwt_token_here", "employee": { "id": "emp_uuid", "name": "Jane Doe", "roles": ["EMPLOYEE"] } }`

### `POST /api/auth/logout`
*   **Description**: Invalidates the current session/token.
*   **Access**: Authenticated.
*   **Response (200)**: `{ "message": "Logged out successfully" }`

---

## 2. Organization & Department Setup (4 Routes)

### `GET /api/departments`
*   **Description**: Retrieves the organizational departments tree/list.
*   **Access**: Authenticated.
*   **Response (200)**: Array of departments (with `parentId`, `head`, and child departments list).

### `POST /api/departments`
*   **Description**: Creates a new department or updates an existing one (upsert style).
*   **Access**: Admin.
*   **Request Body**:
    ```json
    {
      "id": "dept_uuid", // Optional, present for update
      "name": "Engineering",
      "parentId": "parent_dept_uuid", // Optional
      "headId": "employee_uuid", // Optional
      "status": "ACTIVE" // "ACTIVE" | "INACTIVE"
    }
    ```
*   **Response (200/201)**: Created/Updated department object.

### `GET /api/categories`
*   **Description**: Retrieves all asset categories.
*   **Access**: Authenticated.
*   **Response (200)**: Array of categories, including `customFields` schemas.

### `POST /api/categories`
*   **Description**: Creates a new asset category or updates an existing one.
*   **Access**: Admin.
*   **Request Body**:
    ```json
    {
      "id": "category_uuid", // Optional, present for update
      "name": "Electronics",
      "description": "Laptops, monitors, keyfobs",
      "customFields": { "warrantyPeriodMonths": 24 } // Optional
    }
    ```
*   **Response (200/201)**: Created/Updated category object.

---

## 3. Employee Directory & RBAC (2 Routes)

### `GET /api/employees`
*   **Description**: Lists employees with department details. Filterable by name/email/role.
*   **Access**: Authenticated.
*   **Query Params**: `?search=Jane&role=EMPLOYEE`
*   **Response (200)**: Array of employee directory cards.

### `PATCH /api/employees/:id`
*   **Description**: Updates employee metadata, promotes roles, or toggles active status.
*   **Access**: Admin.
*   **Request Body**:
    ```json
    {
      "roles": ["ASSET_MANAGER"], // Promote/Demote
      "status": "ACTIVE" // "ACTIVE" | "INACTIVE"
    }
    ```
*   **Response (200)**: Updated employee object.

---

## 4. Asset Management (4 Routes)

### `GET /api/assets`
*   **Description**: Search and filter all organization assets.
*   **Access**: Authenticated.
*   **Query Params**: `?search=AF-001&status=AVAILABLE&categoryId=cat_uuid`
*   **Response (200)**: Paginated array of assets.

### `GET /api/assets/:id`
*   **Description**: Retrieves single asset details, including photos, full allocation history, and maintenance requests history.
*   **Access**: Authenticated.
*   **Response (200)**: Detailed asset payload.

### `POST /api/assets`
*   **Description**: Registers a new asset in the system.
*   **Access**: Asset Manager.
*   **Request Body**:
    ```json
    {
      "name": "MacBook Pro 16",
      "categoryId": "cat_uuid",
      "serialNumber": "C02XYZ123",
      "acquisitionDate": "2026-07-12T00:00:00Z",
      "acquisitionCost": 2499.00,
      "condition": "NEW",
      "location": "HQ - Floor 3",
      "isBookable": false
    }
    ```
*   **Response (201)**: Created asset with auto-generated `assetTag` (e.g. `AF-0001`).

### `PATCH /api/assets/:id`
*   **Description**: Modifies asset details, condition, location, or manually updates status.
*   **Access**: Asset Manager.
*   **Request Body**: `{ "condition": "GOOD", "location": "HQ - Floor 5", "status": "AVAILABLE" }`
*   **Response (200)**: Updated asset object.

---

## 5. Asset Allocation & Transfers (4 Routes)

### `POST /api/allocations`
*   **Description**: Allocates an asset to an employee or a department. Prevents allocation if the asset's current status is not `AVAILABLE`.
*   **Access**: Asset Manager.
*   **Request Body**:
    ```json
    {
      "assetId": "asset_uuid",
      "allocatedToEmpId": "emp_uuid", // Nullable if assigning to dept
      "allocatedToDeptId": null, // Nullable if assigning to employee
      "expectedReturnDate": "2026-12-31T23:59:59Z" // Optional
    }
    ```
*   **Response (201)**: Allocation object (flips asset status to `ALLOCATED`).

### `POST /api/allocations/:id/return`
*   **Description**: Records the return of an allocated asset.
*   **Access**: Asset Manager.
*   **Request Body**:
    ```json
    {
      "checkInCondition": "FAIR",
      "checkInNotes": "Minor scratches on outer shell."
    }
    ```
*   **Response (200)**: Completed allocation object (flips asset status back to `AVAILABLE`).

### `GET /api/transfers`
*   **Description**: Lists pending and history of custody transfer requests.
*   **Access**: Authenticated (Employees see their own; Asset Managers/Dept Heads see all pending for approval).
*   **Response (200)**: Array of transfer requests.

### `POST /api/transfers`
*   **Description**: Requests an asset custody transfer from one employee/department to another.
*   **Access**: Authenticated (Holder or requesting user).
*   **Request Body**:
    ```json
    {
      "assetId": "asset_uuid",
      "requestedToEmpId": "receiver_emp_uuid",
      "reason": "Team project change"
    }
    ```
*   **Response (210)**: Transfer request object (`REQUESTED` status).

---

## 6. Shared Resource Bookings (3 Routes)

### `GET /api/bookings`
*   **Description**: Lists bookings for calendar visualization. Filterable by asset/resource.
*   **Access**: Authenticated.
*   **Query Params**: `?assetId=asset_uuid&start=2026-07-01&end=2026-07-31`
*   **Response (200)**: Array of active and historical bookings.

### `POST /api/bookings`
*   **Description**: Books a shared resource (where `isBookable = true`). Validates overlap conflicts.
*   **Access**: Authenticated.
*   **Request Body**:
    ```json
    {
      "assetId": "asset_uuid",
      "startTime": "2026-07-12T10:00:00Z",
      "endTime": "2026-07-12T11:00:00Z",
      "purpose": "Sprint Planning Meeting"
    }
    ```
*   **Response (201)**: Confirmed booking. Errors out with `409 Conflict` if target slot overlaps with an existing booking.

### `PATCH /api/bookings/:id`
*   **Description**: Cancels or reschedules a booking.
*   **Access**: Authenticated (Owner of booking, Dept Head, or Asset Manager).
*   **Request Body**: `{ "status": "CANCELLED" }` or `{ "startTime": "...", "endTime": "..." }`
*   **Response (200)**: Updated booking object.

---

## 7. Maintenance Management (3 Routes)

### `GET /api/maintenance`
*   **Description**: Retrieves maintenance requests. Filterable by status and priority.
*   **Access**: Authenticated.
*   **Response (200)**: Array of maintenance requests.

### `POST /api/maintenance`
*   **Description**: Raises a maintenance request for a broken or faulty asset.
*   **Access**: Authenticated (Employee holding asset, or Asset Manager).
*   **Request Body**:
    ```json
    {
      "assetId": "asset_uuid",
      "issueDescription": "Screen flickering and line down the center",
      "priority": "HIGH",
      "photoUrl": "https://bucket.com/photo.jpg" // Optional
    }
    ```
*   **Response (201)**: Created maintenance request (`PENDING` status).

### `PATCH /api/maintenance/:id`
*   **Description**: Handles the complete approval, assignment, and resolution flow.
*   **Access**: Asset Manager / Assigned Technician.
*   **Request Body** (Variable by action):
    *   *Approve/Reject (Asset Manager)*: `{ "status": "APPROVED" | "REJECTED", "rejectionReason": "..." }` (Flips asset status to `UNDER_MAINTENANCE` if approved).
    *   *Assign Technician (Asset Manager)*: `{ "status": "TECHNICIAN_ASSIGNED", "technicianId": "emp_uuid" }`
    *   *Resolve (Technician)*: `{ "status": "RESOLVED", "resolutionNotes": "Replaced monitor back panel ribbon cable." }` (Flips asset status back to `AVAILABLE`).
*   **Response (200)**: Updated maintenance request.

---

## 8. Asset Audits (3 Routes)

### `GET /api/audits`
*   **Description**: Lists all audit cycles.
*   **Access**: Asset Manager / Auditor.
*   **Response (200)**: Array of audit cycles.

### `POST /api/audits`
*   **Description**: Starts a new scheduled audit cycle for a specific department or location.
*   **Access**: Asset Manager.
*   **Request Body**:
    ```json
    {
      "name": "Q3 2026 Office Hardware Audit",
      "scopeDepartmentId": "dept_uuid", // Optional
      "scopeLocation": "HQ Floor 3", // Optional
      "startDate": "2026-07-15T00:00:00Z",
      "endDate": "2026-07-20T23:59:59Z",
      "auditorIds": ["emp_uuid_1", "emp_uuid_2"]
    }
    ```
*   **Response (201)**: Created audit cycle object with associated items populated automatically.

### `PATCH /api/audits/:id`
*   **Description**: Conducts audit verifications per asset, or closes out/locks the audit cycle.
*   **Access**: Assigned Auditor / Asset Manager.
*   **Request Body** (Variable by action):
    *   *Verify Asset (Auditor)*: `{ "action": "VERIFY", "assetId": "asset_uuid", "result": "VERIFIED" | "MISSING" | "DAMAGED", "notes": "..." }`
    *   *Close Audit (Asset Manager)*: `{ "action": "CLOSE" }` (Locks the cycle, generates discrepancies, updates asset statuses).
*   **Response (200)**: Updated audit cycle or verification item.

---

## 9. Dashboard, Analytics & Notifications (3 Routes)

### `GET /api/dashboard/kpis`
*   **Description**: Retrieves core operational statistics for the home screen snapshot.
*   **Access**: Authenticated.
*   **Response (200)**:
    ```json
    {
      "assetsAvailable": 45,
      "assetsAllocated": 120,
      "maintenanceToday": 3,
      "activeBookings": 8,
      "pendingTransfers": 2,
      "overdueReturns": 5
    }
    ```

### `GET /api/dashboard/analytics`
*   **Description**: Aggregates utilization heatmaps, category frequency, and maintenance reports.
*   **Access**: Asset Manager / Admin.
*   **Response (200)**: Aggregated JSON reporting data.

### `GET /api/notifications`
*   **Description**: Retrieves logged-in user notifications and handles reading them.
*   **Access**: Authenticated.
*   **Query Params**: `?unreadOnly=true`
*   **Request Body (PATCH)**: `{ "markAsReadIds": ["notif_uuid_1", "notif_uuid_2"] }` (Send PATCH to mark read)
*   **Response (200)**: Array of notifications.
