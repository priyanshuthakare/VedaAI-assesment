# Backend API Endpoints

The Express backend exposes a RESTful API. All routes are prefixed with `/api`.

## 1. Create Assignment
Creates a new assignment, saves the configuration to MongoDB, and pushes a job to the BullMQ queue for AI generation.
- **URL:** `/api/assignments`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "topic": "World War II",
    "totalQuestions": 10,
    "marksPerQuestion": 5,
    "dueDate": "25-06-2025",
    "instructions": "Focus on the European theater.",
    "questionTypes": [
      { "type": "mcq", "count": 5, "marksEach": 2 }
    ]
  }
  ```
- **Response (200):** `{ "message": "Assignment created", "assignmentId": "60d5ecb..." }`

## 2. Get All Assignments
Fetches a list of all historical assignments created by the user.
- **URL:** `/api/assignments`
- **Method:** `GET`
- **Response (200):** `{ "assignments": [ ... ] }`

## 3. Get Assignment Status & Result
Fetches the current processing status of an assignment, and returns the generated `QuestionPaper` object if completed.
- **URL:** `/api/assignments/:id/result`
- **Method:** `GET`
- **Response (200):** 
  ```json
  {
    "status": "completed",
    "questionPaper": { ... } 
  }
  ```

## 4. Delete Assignment
Deletes an assignment and its associated result from the database.
- **URL:** `/api/assignments/:id`
- **Method:** `DELETE`
- **Response (200):** `{ "message": "Deleted successfully" }`

## 5. Download PDF
Triggers the server-side Puppeteer engine to generate and return a formatted PDF of the question paper.
- **URL:** `/api/assignments/:id/pdf`
- **Method:** `GET`
- **Response (200):** A binary stream of the PDF file (`application/pdf`).
