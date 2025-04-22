const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
});

// In-memory storage for tasks
let tasks = [];

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send all tasks to newly connected client
  socket.emit("sync:tasks", tasks);

  // Create a new task
  socket.on("task:create", (taskData) => {
    const newTask = {
      id: generateId(),
      ...taskData,
      createdAt: new Date().toISOString(),
      attachments: []
    };
    tasks.push(newTask);
    io.emit("task:created", newTask);
  });

  // Update an existing task
  socket.on("task:update", (updatedTask) => {
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      io.emit("task:updated", tasks[index]);
    }
  });

  // Move a task between columns
  socket.on("task:move", ({ taskId, newColumn }) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      task.column = newColumn;
      io.emit("task:moved", { taskId, newColumn });
    }
  });

  // Delete a task
  socket.on("task:delete", (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    io.emit("task:deleted", taskId);
  });

  // Handle file upload (simulated)
  socket.on("task:upload", ({ taskId, fileData }) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      const attachment = {
        id: generateId(),
        name: fileData.name,
        type: fileData.type,
        url: URL.createObjectURL(new Blob([fileData.data])),
        uploadedAt: new Date().toISOString()
      };
      task.attachments.push(attachment);
      io.emit("task:uploaded", { taskId, attachment });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
