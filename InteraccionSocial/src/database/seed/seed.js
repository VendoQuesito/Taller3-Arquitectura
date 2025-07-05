const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Interaction = require("../model/interactionModel");
const Video = require("../model/videosModel");

const VIDEOS_DB_URI = "mongodb://admin:root@localhost:27017";
const INTERACTIONS_DB_URI = "mongodb://admin:root@localhost:27019";

async function getVideosFromSeparateDB() {
  const videoConnection = await mongoose.createConnection(VIDEOS_DB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  const VideoModel = videoConnection.model("Video", new mongoose.Schema({
    title: String,
    description: String,
    genre: String,
    available: Boolean,
    likes: Number,
  }));

  const videos = await VideoModel.find();
  await videoConnection.close();
  return videos;
}

async function seedInteractions() {
  const videos = await getVideosFromSeparateDB();

  if (!videos.length) {
    console.error("No hay videos para asociar interacciones.");
    process.exit(1);
  }

  await mongoose.connect(INTERACTIONS_DB_URI);

  const interactions = [];

  for (const video of videos) {
    const numLikes = faker.number.int({ min: 50, max: 100 });
    const numComments = faker.number.int({ min: 20, max: 50 });

    const likes = Array.from({ length: numLikes }, () => faker.string.uuid());

    const comments = Array.from({ length: numComments }, () => ({
      userId: faker.string.uuid(),
      comment: faker.lorem.sentence(),
      date: faker.date.recent({ days: 60 }),
    }));

    interactions.push({
      videoId: video._id.toString(),
      likes,
      comments,
    });
  }

  await Interaction.deleteMany();
  await Interaction.insertMany(interactions);

  console.log("Seeding de interacciones completado");
  process.exit();
}

seedInteractions().catch((err) => {
  console.error("Error al hacer seed de interacciones:", err);
  process.exit(1);
});
