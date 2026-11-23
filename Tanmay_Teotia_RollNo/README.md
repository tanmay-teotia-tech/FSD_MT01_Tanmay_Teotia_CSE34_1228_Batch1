# Student Record Management API

Simple REST API built with Node.js and Express to manage student records in memory.

## Tech Stack
- Node.js
- Express.js

## Project Setup

1. Install dependencies:
```bash
npm install
```

2. Run the server:
```bash
node server.js
```

Server starts on `http://localhost:3000`.

## Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| GET | `/api/students` | Get all students | 200 |
| POST | `/api/students` | Add a new student | 201 / 400 |
| GET | `/api/students/filter?branch=CSE` | Filter students by branch | 200 / 400 |
| GET | `/api/students/:id` | Get student by ID | 200 / 404 |
| PUT | `/api/students/:id` | Update student by ID | 200 / 400 / 404 |
| DELETE | `/api/students/:id` | Delete student by ID | 200 / 404 |

*Note: The `/filter` route is placed above `/:id` so Express doesn't treat the word "filter" as an ID parameter.*

## Student Schema

- `id`: Number (auto-incremented)
- `rollNumber`: String (unique)
- `name`: String
- `branch`: String
- `semester`: Number (1 to 8)
- `email`: String (must contain `@` and `.`)

## Validation

- Fields cannot be empty.
- Semester must be between 1 and 8.
- Email must have `@` and `.`.
- Duplicate `rollNumber` is rejected with `400 Bad Request`.
- If `branch` query is missing on the filter route, returns `400 Bad Request`.

## Sample Data

```json
[
  { "id": 201, "rollNumber": "CSE2401", "name": "Aarav Sharma", "branch": "CSE", "semester": 3, "email": "aarav@example.com" },
  { "id": 202, "rollNumber": "ECE2402", "name": "Diya Verma", "branch": "ECE", "semester": 3, "email": "diya@example.com" },
  { "id": 203, "rollNumber": "CSE2403", "name": "Kabir Singh", "branch": "CSE", "semester": 3, "email": "kabir@example.com" }
]
```

## Testing Guide (Thunder Client / Postman)

1. **GET all students**
   - GET `http://localhost:3000/api/students`
   - Status: 200

2. **POST new student**
   - POST `http://localhost:3000/api/students`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "rollNumber": "IT2404",
       "name": "Meera Gupta",
       "branch": "IT",
       "semester": 3,
       "email": "meera@example.com"
     }
     ```
   - Status: 201

3. **GET filter by branch**
   - GET `http://localhost:3000/api/students/filter?branch=CSE`
   - Status: 200

4. **GET student by ID**
   - GET `http://localhost:3000/api/students/201`
   - Status: 200

5. **PUT update student**
   - PUT `http://localhost:3000/api/students/201`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "rollNumber": "CSE2401",
       "name": "Aarav Sharma",
       "branch": "CSE",
       "semester": 4,
       "email": "aarav@example.com"
     }
     ```
   - Status: 200

6. **DELETE student**
   - DELETE `http://localhost:3000/api/students/204`
   - Status: 200

7. **Error checks**
   - POST with existing rollNumber -> Status: 400
   - POST with empty body `{}` -> Status: 400
   - POST with semester 10 -> Status: 400
   - GET `/api/students/999` -> Status: 404
   - GET `/api/students/filter` without query -> Status: 400

## Viva Notes

- **Data storage:** Data is stored in a JavaScript array in memory (`students`), which resets when the server is restarted.
- **Middleware:** `express.json()` parses incoming JSON request bodies into `req.body`.
- **Route ordering:** `/api/students/filter` is defined before `/api/students/:id` so Express doesn't parse "filter" as `req.params.id`.
- **ID logic:** Handled using `Math.max(...students.map(s => s.id)) + 1` so IDs remain unique and increase automatically.
