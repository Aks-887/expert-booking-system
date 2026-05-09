require("dotenv").config();
const mongoose = require("mongoose");
const Expert = require("./models/Expert");
const TimeSlot = require("./models/TimeSlot");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/expert-booking";

/* ==============================
   DATA ARRAYS
============================== */

const categories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Data Science",
  "Cloud Architecture",
];

const firstNames = [
  "John","Sarah","Mike","Emma","David","Lisa","James","Anna",
  "Robert","Maria","William","Jennifer","Richard","Patricia",
  "Thomas","Linda","Charles","Barbara","Christopher","Elizabeth"
];

const lastNames = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller",
  "Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez",
  "Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin"
];

const bios = [
  "Passionate developer with 10+ years of experience.",
  "Full-stack specialist focusing on scalable systems.",
  "UI/UX expert designing intuitive interfaces.",
  "Data scientist solving complex business problems.",
  "Cloud architect optimizing enterprise infrastructure.",
];

/* ==============================
   DB CONNECTION
============================== */

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
}

/* ==============================
   RANDOM HELPERS
============================== */

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRating() {
  return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1));
}

function randomHourlyRate() {
  return Math.floor(Math.random() * 150) + 30;
}

function formatTime(hour, minute = 0) {
  const h = hour.toString().padStart(2, "0");
  const m = minute.toString().padStart(2, "0");
  return `${h}:${m}`;
}

/* ==============================
   TIME SLOT GENERATOR
============================== */

function generateTimeSlots(expertId, days = 90) {
  const slots = [];
  const workingHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    // Skip Sunday
    if (date.getDay() === 0) continue;

    // 4–8 slots per day
    const slotCount = Math.floor(Math.random() * 5) + 4;

    for (let j = 0; j < slotCount; j++) {
      const hour = workingHours[j % workingHours.length];

      slots.push({
        expertId: expertId,
        date: date,
        startTime: formatTime(hour),
        endTime: formatTime(hour + 1),
        isBooked: Math.random() < 0.3, // 30% booked
      });
    }
  }

  return slots;
}

/* ==============================
   MAIN SEED FUNCTION
============================== */

async function seedDatabase() {
  try {
    await connectDB();

    console.log("🧹 Clearing old data...");
    await Expert.deleteMany({});
    await TimeSlot.deleteMany({});

    console.log("👨‍💻 Creating experts...");

    const experts = [];

    for (let i = 0; i < 200; i++) {
      const first = randomItem(firstNames);
      const last = randomItem(lastNames);

      experts.push({
        name: `${first} ${last}`,
        category: randomItem(categories),
        experience: Math.floor(Math.random() * 20) + 1,
        rating: randomRating(),
        bio: randomItem(bios),
        hourlyRate: randomHourlyRate(),
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${first}${last}${i}`,
        isActive: true,
      });
    }

    const savedExperts = await Expert.insertMany(experts);
    console.log(`✅ Created ${savedExperts.length} Experts`);

    console.log("⏰ Creating time slots...");

    let totalSlots = 0;

    for (const expert of savedExperts) {
      const slots = generateTimeSlots(expert._id, 90);

      if (slots.length > 0) {
        await TimeSlot.insertMany(slots);
        totalSlots += slots.length;
      }
    }

    console.log(`✅ Created ${totalSlots} Time Slots`);

    console.log("\n🎉 SEED COMPLETED SUCCESSFULLY");
    console.log(`Experts: ${savedExperts.length}`);
    console.log(`TimeSlots: ${totalSlots}\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();