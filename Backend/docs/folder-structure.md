Backend/
├── docs/
│   ├── routes.md
│   ├── schema.mmd
│   └── api.http
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   │
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   ├── logger.js
│   │   └── cloudinary.js
│   │
│   ├── common/
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── helpers/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── lib/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── security.middleware.js
│   │   ├── request-id.middleware.js
│   │   ├── logger.middleware.js
│   │   ├── error.middleware.js
│   │   └── not-found.middleware.js
│   │
│   ├── features/
│   │
│   │   ├── auth/
│   │   │   ├── auth.dto.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.mapper.js
│   │
│   │   ├── dashboard/
│   │   │
│   │   ├── employees/
│   │   │
│   │   ├── departments/
│   │   │
│   │   ├── categories/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── allocations/
│   │   │
│   │   ├── transfers/
│   │   │
│   │   ├── bookings/
│   │   │
│   │   ├── maintenance/
│   │   │
│   │   ├── audits/
│   │   │
│   │   ├── notifications/
│   │   │
│   │   ├── uploads/
│   │   │
│   │   └── reports/
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   └── jobs/
│       ├── overdueReturns.job.js
│       └── notification.job.js
│
├── .env
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── docker-entrypoint.sh
├── package.json
└── server.js