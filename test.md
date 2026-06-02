# Testing evidence and results - curl


## Admin Module

### Admin login
Request:

```bash
curl -X POST http://localhost:8000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@madar.com","password":"admin123"}'
```

Expected Result:

*Response: JWT token + user object

Actual Result:

```bash
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "admin@madar.com",
    "id": "6979e03d-5065-11f1-b9fe-0e0100257403",
    "name": "Admin",
    "role": "admin"
  }
}
```

Result: Passed