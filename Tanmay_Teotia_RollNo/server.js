const express = require('express');
const app = express();

// middleware to parse incoming json data
app.use(express.json());

const PORT = 3000;

// initial student records in memory
let students = [
  {
    id: 201,
    rollNumber: 'CSE2401',
    name: 'Aarav Sharma',
    branch: 'CSE',
    semester: 3,
    email: 'aarav@example.com'
  },
  {
    id: 202,
    rollNumber: 'ECE2402',
    name: 'Diya Verma',
    branch: 'ECE',
    semester: 3,
    email: 'diya@example.com'
  },
  {
    id: 203,
    rollNumber: 'CSE2403',
    name: 'Kabir Singh',
    branch: 'CSE',
    semester: 3,
    email: 'kabir@example.com'
  }
];

// validation function for POST and PUT requests
function validateStudent(data) {
  if (!data.rollNumber || typeof data.rollNumber !== 'string' || data.rollNumber.trim() === '') {
    return 'rollNumber is required and must be a non-empty string';
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    return 'name is required and must be a non-empty string';
  }

  if (!data.branch || typeof data.branch !== 'string' || data.branch.trim() === '') {
    return 'branch is required and must be a non-empty string';
  }

  if (data.semester === undefined || typeof data.semester !== 'number' || data.semester < 1 || data.semester > 8) {
    return 'semester is required and must be a number between 1 and 8';
  }

  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
    return 'email is required and must be a non-empty string';
  }

  if (!data.email.includes('@') || !data.email.includes('.')) {
    return 'email must be a valid format (must contain @ and a dot)';
  }

  return null;
}

// 1. GET all students
app.get('/api/students', (req, res) => {
  res.status(200).json(students);
});

// 2. POST create student
app.post('/api/students', (req, res) => {
  const error = validateStudent(req.body);
  if (error) {
    return res.status(400).json({ error: error });
  }

  // check duplicate roll number
  const duplicate = students.find(
    (s) => s.rollNumber.toLowerCase() === req.body.rollNumber.trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(400).json({ error: 'rollNumber already exists. Each student must have a unique rollNumber.' });
  }

  // generate unique id (max id + 1)
  const maxId = students.length > 0 ? Math.max(...students.map((s) => s.id)) : 200;
  const newId = maxId + 1;

  const newStudent = {
    id: newId,
    rollNumber: req.body.rollNumber.trim(),
    name: req.body.name.trim(),
    branch: req.body.branch.trim(),
    semester: req.body.semester,
    email: req.body.email.trim()
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// 3. GET filter by branch
// Note: kept before /:id route so "filter" is not parsed as an id parameter
app.get('/api/students/filter', (req, res) => {
  const branch = req.query.branch;

  if (!branch || branch.trim() === '') {
    return res.status(400).json({ error: 'branch query parameter is required. Example: /api/students/filter?branch=CSE' });
  }

  const filtered = students.filter(
    (s) => s.branch.toLowerCase() === branch.trim().toLowerCase()
  );

  res.status(200).json(filtered);
});

// 4. GET student by id
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found with id ' + req.params.id });
  }

  res.status(200).json(student);
});

// 5. PUT update student by id
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Student not found with id ' + req.params.id });
  }

  const error = validateStudent(req.body);
  if (error) {
    return res.status(400).json({ error: error });
  }

  // check duplicate roll number on other students
  const duplicate = students.find(
    (s) => s.rollNumber.toLowerCase() === req.body.rollNumber.trim().toLowerCase() && s.id !== id
  );
  if (duplicate) {
    return res.status(400).json({ error: 'rollNumber already exists on another student. Each rollNumber must be unique.' });
  }

  // update student without modifying original id
  students[index] = {
    id: id,
    rollNumber: req.body.rollNumber.trim(),
    name: req.body.name.trim(),
    branch: req.body.branch.trim(),
    semester: req.body.semester,
    email: req.body.email.trim()
  };

  res.status(200).json(students[index]);
});

// 6. DELETE student by id
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Student not found with id ' + req.params.id });
  }

  const deleted = students.splice(index, 1);
  res.status(200).json({ message: 'Student with id ' + id + ' deleted successfully', student: deleted[0] });
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
