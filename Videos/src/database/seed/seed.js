const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Video = require("../model/videosModel");

async function seedVideos() {
  await mongoose.connect(
    "mongodb://admin:root@localhost:27017/"
  );

  const videos = Array.from({ length: 420 }, () => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    genre: faker.helpers.arrayElement(["Acción", "Drama", "Comedia", "Terror", "Sci-Fi"]),
    available: faker.datatype.boolean({ probability: 0.95 }),
    likes: faker.number.int({ min: 0, max: 1000 }),
  }));

  const defaultVideo = {
    title: "Among us",
    description: "Among us de prueba",
    genre: "Comedia",
    available: true,
    likes: 0,
  };

  videos.push(defaultVideo);

  await Video.deleteMany();
  await Video.insertMany(videos);

  console.log("Seeding de videos completado");
  process.exit();
}

seedVideos().catch((err) => {
  console.error("Error al hacer seed de videos:", err);
  process.exit(1);
});
