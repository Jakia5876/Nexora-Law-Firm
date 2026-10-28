# Nexora Law Platform API & Actions Reference

## Public Endpoints
- `POST /api/intake`: Case intake form submission (Zod validated).
- Payload: `client_name`, `email`, `phone`, `case_type`, `message`

### Example Request
```json
{
  "client_name": "Demo Client",
  "email": "client@example.com",
  "phone": "+1-800-555-0100",
  "case_type": "Corporate & Commercial Litigation",
  "message": "Seeking corporate litigation advisory."
}
```

### Responses
- `200 OK`: Intake inquiry submitted successfully.
- `400 Bad Request`: Validation failure on input fields.
- `429 Too Many Requests`: Rate limiter exceeded.

---

## Protected Admin Routes
- `GET /api/admin/cases`: List and filter firm cases (Admin/Staff only).
- `POST /api/admin/cases`: Create case docket (Admin/Staff only).
- `PATCH /api/admin/cases`: Update status and notes for cases (Admin/Staff only).

### Headers
- `Cookie`: Authenticated admin session cookie (`nexora_admin_session`) or Authorization token.

### Query Parameters for `GET /api/admin/cases`
- `page`: Page index (default: `1`)
- `limit`: Records per page (default: `20`, max: `100`)

### Payload for `PATCH /api/admin/cases`
```json
{
  "case_id": 1,
  "status": "in_progress",
  "under_section": "Sec. 12(a) Commercial Arbitration Act"
}
```

---

## Server Actions Reference

### Public Server Actions
- `submitIntakeAction(formData: FormData)`: Validates and persists public consultation requests into `contacts` table.

### Administrative Server Actions (`app/actions/cases.ts`, `app/actions/admin.ts`)
- `adminLoginAction(formData: FormData)`: Authenticates administrator using timing-safe password verification and issues HTTP-only session JWT.
- `adminLogoutAction()`: Clears administrative session cookie.
- `createCaseAction(formData: FormData)`: Gated docket creation with Zod schema verification.
- `updateCaseStatusAction(formData: FormData)`: Updates case status and revalidates `/cases` and `/admin`.
- `deleteCaseAction(formData: FormData)`: Deletes specified docket entry and triggers cache revalidation.
- `uploadCaseDocumentAction(formData: FormData)`: Attaches client vault document record with metadata.
