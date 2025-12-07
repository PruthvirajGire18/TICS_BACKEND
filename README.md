# TICS Backend API

Node.js/Express backend for TICS website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secret
   - Email credentials (optional, for notifications)
   - Admin credentials

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact/admin` - Get all contact messages (protected)

### Careers
- `GET /api/careers/jobs` - Get all active job listings
- `POST /api/careers/apply` - Submit job application (with resume upload)
- `GET /api/careers/applications` - Get all job applications (protected)

### Services
- `POST /api/services/proposal` - Request service proposal

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/contacts` - Get contact messages (protected)
- `GET /api/admin/applications` - Get job applications (protected)
- `GET /api/admin/resume/:filename` - Download resume (protected)

## Authentication

Admin routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## File Uploads

Resume uploads are stored in `server/uploads/` directory.
Supported formats: PDF, DOC, DOCX
Max file size: 5MB

