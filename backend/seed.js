const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const movieSchema = new mongoose.Schema({
  movie_image: { type: String, default: "" },
  movie_name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  total_tickets: { type: Number, required: true, min: 0 },
});
const Movie = mongoose.model("Movie", movieSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model("Admin", adminSchema);

const hashPassword = (p) => crypto.createHash("sha256").update(p).digest("hex");

const demoMovies = [
  {
    movie_name: "Pushpa 2: The Rule",
    movie_image: "https://placehold.co/400x560/1a1a2e/FFD700?text=Pushpa+2%3A+The+Rule",
    description: "Pushpa Raj expands his smuggling empire while facing new threats and personal challenges in this action-packed sequel.",
    price: 250,
    total_tickets: 150,
  },
  {
    movie_name: "KGF: Chapter 2",
    movie_image: "https://placehold.co/400x560/0f0f1a/F5A623?text=KGF+Chapter+2",
    description: "Rocky takes control of the Kolar Gold Fields and establishes his empire, but powerful enemies seek to bring him down.",
    price: 200,
    total_tickets: 120,
  },
  {
    movie_name: "RRR",
    movie_image: "https://placehold.co/400x560/1a0a00/FF6B35?text=RRR",
    description: "A fictional tale about two legendary Indian freedom fighters and their journey before they started fighting for their country.",
    price: 180,
    total_tickets: 200,
  },
  {
    movie_name: "Jawan",
    movie_image: "https://placehold.co/400x560/001a0a/00C853?text=Jawan",
    description: "A high-octane action thriller where a man is driven by a personal vendetta to rectify the wrongs in society.",
    price: 220,
    total_tickets: 90,
  },
  {
    movie_name: "Animal",
    movie_image: "https://placehold.co/400x560/1a0000/FF1744?text=Animal",
    description: "The son of a wealthy industrialist becomes increasingly ruthless and violent in his efforts to protect his father.",
    price: 190,
    total_tickets: 75,
  },
  {
    movie_name: "Pathaan",
    movie_image: "https://placehold.co/400x560/00001a/2979FF?text=Pathaan",
    description: "An exiled spy returns to India to neutralize a deadly threat posed by a vengeful mercenary.",
    price: 210,
    total_tickets: 110,
  },
  {
    movie_name: "Kalki 2898-AD",
    movie_image: "https://placehold.co/400x560/0a001a/AA00FF?text=Kalki+2898-AD",
    description: "Set in a dystopian future, a warrior is destined to protect the future mother of Kalki, the final avatar of Vishnu.",
    price: 300,
    total_tickets: 60,
  },
  {
    movie_name: "Stree 2",
    movie_image: "https://placehold.co/400x560/1a001a/E040FB?text=Stree+2",
    description: "The town of Chanderi faces a new supernatural threat, and the gang must unite once more to battle the evil.",
    price: 170,
    total_tickets: 130,
  },
];

const seedDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ MONGODB_URI is missing in .env file");
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected!");

    // ── Seed Admin ────────────────────────────────────────────────────────
    const adminExists = await Admin.findOne({ username: "admin" });
    if (adminExists) {
      console.log("ℹ️  Admin user already exists — skipping.");
    } else {
      await Admin.create({ username: "admin", password: hashPassword("admin@123") });
      console.log("👤 Admin user created → username: admin | password: admin@123");
    }

    // ── Seed Movies ────────────────────────────────────────────────────────
    const existingCount = await Movie.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  Database already has ${existingCount} movies. Clearing and re-seeding...`);
      await Movie.deleteMany({});
    }

    // Insert demo movies
    const inserted = await Movie.insertMany(demoMovies);
    console.log(`\n🎬 Successfully seeded ${inserted.length} movies:\n`);
    inserted.forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.movie_name} — ₹${m.price} — ${m.total_tickets} tickets`);
    });

    console.log("\n✨ Seeding complete! Admin + Movies ready.\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();
