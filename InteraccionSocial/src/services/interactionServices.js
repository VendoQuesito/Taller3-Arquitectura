const Interaction = require('../database/model/interactionModel');

async function ensureAuth(userId) {
  if (!userId) {
    throw new Error("Usuario no autenticado");
  }
}

exports.InteractionService = {
  GiveLike: async (call, callback) => {
    try {
      const { videoId, userId } = call.request;
      await ensureAuth(userId);

      const interaction = await Interaction.findOneAndUpdate(
        { videoId },
        { $push: { likes: userId } },
        { upsert: true, new: true }
      );

      callback(null, { message: "Like agregado correctamente" });
    } catch (error) {
      callback(null, { message: `Error: ${error.message}` });
    }
  },

  LeaveComment: async (call, callback) => {
    try {
      const { videoId, userId, comment } = call.request;
      await ensureAuth(userId);

      const interaction = await Interaction.findOneAndUpdate(
        { videoId },
        { $push: { comments: { userId, comment } } },
        { upsert: true, new: true }
      );

      callback(null, { message: "Comentario agregado correctamente" });
    } catch (error) {
      callback(null, { message: `Error: ${error.message}` });
    }
  },

  GetInteractions: async (call, callback) => {
    try {
      const { videoId, userId } = call.request;
      await ensureAuth(userId);

      const interaction = await Interaction.findOne({ videoId });

      const likes = interaction?.likes || [];
      const comments = interaction?.comments.map(c => ({
        userId: c.userId,
        comment: c.comment,
        date: c.date.toISOString()
      })) || [];

      callback(null, { likes, comments });
    } catch (error) {
      callback(null, { likes: [], comments: [] });
    }
  }
};
