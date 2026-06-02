# Testing evidence and results - curl


## Admin Module

### Admin login

**Request**:

```bash
curl -X POST http://localhost:8000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@madar.com","password":"admin123"}'
```

**Expected Result**:

*Response: JWT token + user object*

**Actual Result**:

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
<img width="1121" height="477" alt="image" src="https://github.com/user-attachments/assets/9e5de3fd-0325-46c9-bb04-e9a5db11d87f" />
<img width="1905" height="673" alt="image" src="https://github.com/user-attachments/assets/abe2302c-c925-43fd-81d9-646f90efaa7c" />


### Result: Passed

### Admin Retrieve all users

**Request**:

```bash
curl -X GET http://localhost:8000/api/admin/users \
-H "Authorization: Bearer TOKEN"
```

**Expected Result**:

*Response: Returns list of users*

**Actual Result**:

```bash
[
  {
    "created_at": "2026-05-15 13:53:11",
    "email": "admin@madar.com",
    "id": "6979e03d-5065-11f1-b9fe-0e0100257403",
    "name": "Admin",
    "role": "admin",
    "status": "active"
  },
  {
    "created_at": "2026-05-09 12:27:17",
    "email": "ghaida@test.com",
    "id": "7f1a14d3-7bae-48c7-a771-9a67f9f55563",
    "name": "Ghaida",
    "role": "user",
    "status": "active"
  }
]
```

<img width="1074" height="603" alt="image" src="https://github.com/user-attachments/assets/73e325f9-cf96-44c5-af7a-65b6bb861abf" />
<img width="1911" height="530" alt="image" src="https://github.com/user-attachments/assets/61262931-8678-4c86-9a91-b5043ab8ae92" />


### Result: Passed


### Admin Get All Jobs

**Request**:

```bash
curl -X GET http://localhost:8000/api/admin/jobs \
-H "Authorization: Bearer TOKEN"
```

**Expected Result**:

*Response: list of jobs*

**Actual Result**:

<img width="1903" height="622" alt="image" src="https://github.com/user-attachments/assets/72bb2dfe-f9e2-4ec4-ba1c-84f9db95d9a2" />


### Result: Passed


### Admin Add Job

**Request**:

```bash
curl -X POST http://localhost:8000/api/admin/jobs \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "id": "job_id",
  "icon": "icon.png",
  "title_ar": "title",
  "title_en": "title",
  "description_primary": "Primary description",
  "description_secondary": "Secondary description",
  "skills": ["", ""]
}'
```

**Expected Result**:

*Response: Job created + ID*

**Actual Result**:

```bash
{
  "id": "Financial_Analyst",
  "message": "Job created"
}
```

<img width="1137" height="484" alt="image" src="https://github.com/user-attachments/assets/36e1a511-1989-4bac-b4c8-ce5114d39be9" />
<img width="1912" height="702" alt="image" src="https://github.com/user-attachments/assets/e678deeb-b598-40ac-9e23-14b2c2b13abd" />


### Result: Passed


### Admin Delete Job 

**Request**:

```bash
curl -X DELETE http://localhost:8000/api/admin/jobs/job_id \
-H "Authorization: Bearer TOKEN"
```

**Expected Result**:

*Response: Job deleted*

**Actual Result**:

```bash
{
  "message": "Job deleted"
}
```

<img width="1395" height="184" alt="image" src="https://github.com/user-attachments/assets/3998c524-f4e6-4040-bb77-02152305da6a" />



### Result: Passed


### Admin Get All Simulations

**Request**:

```bash
curl -X GET http://localhost:8000/api/admin/simulations \
-H "Authorization: Bearer TOKEN"
```

**Expected Result**:

*Response: list of simulations*

**Actual Result**:

<img width="1093" height="924" alt="image" src="https://github.com/user-attachments/assets/83177c05-43c3-45b5-bfd9-1509df34dd30" />



### Result: Passed

### Unauthorized Access

**Request**:

```bash
curl -X GET http://localhost:8000/api/admin/users
```

**Expected Result**:

*Response: Unauthorized*

**Actual Result**:

```bash
{
  "error": "Unauthorized"
}
```

<img width="1696" height="263" alt="image" src="https://github.com/user-attachments/assets/878fc087-deec-4621-b00f-7a4dd5d8ecda" />


### Result: Passed


## User Module

### User Signup

**Request**:

```bash
curl -X POST http://localhost:8000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "12345678"
}'
```

**Expected Result**:

*Response: token + user object*

**Actual Result**:

```bash
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "a12b34c5-d678-11f1-b9fe-0e0100257403",
    "name": "Test User",
    "email": "testuser@example.com",
    "initials": "TU"
  }
}
```

<img width="1210" height="560" alt="image" src="https://github.com/user-attachments/assets/2e34f3f4-0ce1-42b8-b724-ace0f5f56c65" />


### Result: Passed


### User Login

**Request**:

```bash
curl -X POST http://localhost:8000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "password": "12345678"
}'
```

**Expected Result**:

*Response: token + user object*

**Actual Result**:

```bash
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "a12b34c5-d678-11f1-b9fe-0e0100257403",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "user",
    "initials": "TU"
  }
}
```

<img width="1301" height="578" alt="image" src="https://github.com/user-attachments/assets/cdf184ab-5148-44a4-941e-2f175df6a35c" />
<img width="1877" height="927" alt="image" src="https://github.com/user-attachments/assets/9157df2a-2402-472b-80e9-5fa347e66fc0" />


### Result: Passed

### Login with Invalid Credentials

**Request**:

```bash
curl -X POST http://localhost:8000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "wrong@example.com",
  "password": "wrongpass"
}'
```

**Expected Result**:

*Response: Unauthorized error message*

**Actual Result**:

```bash
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة"
  }
}
```

<img width="1537" height="407" alt="image" src="https://github.com/user-attachments/assets/bc17ecd2-87f3-4046-9efc-db0fad6064ce" />
<img width="1883" height="933" alt="image" src="https://github.com/user-attachments/assets/36a9e401-176b-4041-a7d6-03ffcb0eea28" />




### Result: Passed


### User Login

**Request**:

```bash
curl -X POST http://localhost:8000/api/auth/logout \
-H "Authorization: Bearer TOKEN"
```

**Expected Result**:

*Response: success message + Cookies cleared (JWT unset)*

**Actual Result**:

```bash
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

<img width="1907" height="625" alt="image" src="https://github.com/user-attachments/assets/52b08ba3-0589-41cc-b6ca-6df770dd27cd" />



### Result: Passed


## Jobs Module


### Get All Jobs

**Request**:

```bash
curl -X GET http://localhost:8000/api/jobs/
```

**Expected Result**:

*Response: list of all jobs with full job details*

**Actual Result**:

<img width="1883" height="947" alt="image" src="https://github.com/user-attachments/assets/a80e1ada-22a0-4d57-95db-3b0172e5b409" />



### Result: Passed


### Get Single Job (Valid ID)

**Request**:

```bash
curl -X GET http://localhost:8000/api/jobs/job_id
```

**Expected Result**:

*Response: job object matching given ID*

**Actual Result**:

<img width="1881" height="981" alt="image" src="https://github.com/user-attachments/assets/126ea124-b7b5-4e05-9a5c-e510ba3e36ee" />


### Result: Passed


### Get Single Job (Invalid ID)

**Request**:

```bash
curl -X GET http://localhost:8000/api/jobs/invalid_job_id
```

**Expected Result**:

*Response: Job not found error*

**Actual Result**:

```bash
{
  "error": "Job not found"
}
```

<img width="1147" height="171" alt="image" src="https://github.com/user-attachments/assets/a9dfd0cb-a05a-450a-a76c-e1f91e695bb1" />


### Result: Passed


## Tasks Module

### Get All Tasks for a Job

**Request**:

```bash
curl -X GET http://localhost:8000/api/jobs/software-engineer/tasks
```

**Expected Result**:

*Response: list of tasks for the given job*

**Actual Result**:

<img width="1889" height="535" alt="image" src="https://github.com/user-attachments/assets/f4953a5e-4f62-4dc6-ad4c-2a0414a90b45" />


### Result: Passed


### Get Single Task

**Request**:

```bash
curl -X GET http://localhost:8000/api/jobs/software-engineer/tasks/374
```

**Expected Result**:

*Response: single task object*

**Actual Result**:

<img width="1907" height="983" alt="image" src="https://github.com/user-attachments/assets/bf041245-25a0-4928-8b82-bd0c64b01e22" />



### Result: Passed


## Ai Module

### Generate Task

**Request**:

```bash
curl -X POST http://localhost:8000/api/ai/task \
-H "Content-Type: application/json" \
-d '{
  "job_id": "software-engineer",
  "task_id": "debug_code"
}'
```

**Expected Result**:

*Response: created task with id, title, description, content*

**Actual Result**:

```bash
{
  "id": 1,
  "title": "Build API",
  "description": "Create REST endpoints",
  "content": {
    "instructions": "Implement API",
    "estimated_time": "20-25 دقيقة"
  }
}
```

<img width="1872" height="306" alt="image" src="https://github.com/user-attachments/assets/8c21bf34-3214-4aba-933c-6eb5185c0088" />


### Result: Passed
