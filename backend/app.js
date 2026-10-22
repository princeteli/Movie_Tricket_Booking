const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Admin Schema ─────────────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // stored as SHA-256 hash
});

const Admin = mongoose.model("Admin", adminSchema);

const hashPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

// POST /admin/login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const admin = await Admin.findOne({ username: username.trim() });
  if (!admin || admin.password !== hashPassword(password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  return res.status(200).json({ message: "Login successful", username: admin.username });
});

// POST /admin/setup — creates default admin if none exists (run once)
app.post("/admin/setup", async (req, res) => {
  const count = await Admin.countDocuments();
  if (count > 0) {
    return res.status(400).json({ message: "Admin already exists" });
  }
  await Admin.create({
    username: "admin",
    password: hashPassword("admin@123"),
  });
  return res.status(201).json({ message: "Default admin created (admin / admin@123)" });
});

const movieSchema = new mongoose.Schema(
  {
    movie_image: { type: String, default: "" },
    movie_name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    total_tickets: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform(_document, movie) {
        movie.id = movie._id.toString();
        delete movie._id;
        delete movie.__v;
        return movie;
      },
    },
  },
);

const Movie = mongoose.model("Movie", movieSchema);

const isValidMovieId = (id) => mongoose.isValidObjectId(id);

const validateMovieInput = (body) => {
  const { movie_image, movie_name, description, price, total_tickets } = body;
  const parsedPrice = Number(price);
  const parsedTickets = Number(total_tickets);

  if (!movie_name || !String(movie_name).trim()) {
    return { error: "Movie name is required" };
  }

  if (price === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return { error: "Price must be a non-negative number" };
  }

  if (
    total_tickets === "" ||
    !Number.isInteger(parsedTickets) ||
    parsedTickets < 0
  ) {
    return { error: "Total tickets must be a non-negative whole number" };
  }

  return {
    movie: {
      movie_image: movie_image || "",
      movie_name: String(movie_name).trim(),
      description: description || "",
      price: parsedPrice,
      total_tickets: parsedTickets,
    },
  };
};

app.post("/add-movie", async (req, res) => {
  const { error, movie } = validateMovieInput(req.body);
  if (error) return res.status(400).json({ message: error });

  const createdMovie = await Movie.create(movie);
  return res.status(201).json({
    message: "Movie added successfully",
    movie: createdMovie,
  });
});

app.get("/movies", async (_req, res) => {
  const movies = await Movie.find().sort({ _id: -1 });
  return res.status(200).json(movies);
});

app.put("/update-movie/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidMovieId(id)) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  const { error, movie } = validateMovieInput(req.body);
  if (error) return res.status(400).json({ message: error });

  const updatedMovie = await Movie.findByIdAndUpdate(id, movie, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.json({ message: "Movie updated successfully", movie: updatedMovie });
});

app.delete("/delete-movie/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidMovieId(id)) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  const deletedMovie = await Movie.findByIdAndDelete(id);
  if (!deletedMovie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.json({ message: "Movie deleted successfully" });
});

app.post("/book-ticket/:id", async (req, res) => {
  const { id } = req.params;
  const quantity = Number(req.body.quantity);

  if (!isValidMovieId(id)) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Quantity must be a positive whole number" });
  }

  const movie = await Movie.findOneAndUpdate(
    { _id: id, total_tickets: { $gte: quantity } },
    { $inc: { total_tickets: -quantity } },
    { new: true },
  );

  if (movie) {
    return res.json({ message: "Booking successful", movie });
  }

  const exists = await Movie.exists({ _id: id });
  if (!exists) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.status(400).json({ message: "Not enough tickets available" });
});

app.use((err, _req, res, _next) => {
  console.error("Request failed:", err);
  return res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Set it in backend/.env.");
  }

  if (/\s|<|>/.test(mongoUri)) {
    throw new Error(
      "MONGODB_URI is invalid. Replace placeholders with your Atlas cluster URI and URL-encode special characters; do not include whitespace.",
    );
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Unable to start backend:", error.message);
  process.exit(1);
});
