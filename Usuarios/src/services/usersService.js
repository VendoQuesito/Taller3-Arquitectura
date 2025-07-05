const { mariadb } = require("../database/prisma");
const bcrypt = require("bcryptjs");

const allowedRoles = ["Administrador", "Cliente"];

const getUsers = async (call, callback) => {
  const users = await mariadb.users.findMany({
    where: { deletedAt: null },
  });
  callback(null, { users });
};

const createUser = async (call, callback) => {
  const { name, lastName, email, password, confirmPassword, rol, requesterRole } = call.request;

  if (!name || !email || !password || !confirmPassword || !rol) {
    return callback({ code: 3, message: "Faltan campos" });
  }

  if (password !== confirmPassword) {
    return callback({ code: 3, message: "Las contraseñas no coinciden" });
  }

  if (!allowedRoles.includes(rol)) {
    return callback({ code: 3, message: "Rol no valido" });
  }

  if (rol === "Administrador" && requesterRole !== "Administrador") {
    return callback({ code: 7, message: "No autorizado" });
  }

  const existing = await mariadb.users.findUnique({ where: { email } });
  if (existing) {
    return callback({ code: 6, message: "El correo ya esta en uso" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await mariadb.users.create({
    data: { name, lastName, email, password: hashedPassword, rol },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      rol: true,
      createdAt: true,
    },
  });

  callback(null, newUser);
};

const getUserById = async (call, callback) => {
  const { id, requesterId, requesterRole } = call.request;

  if (requesterId !== id && requesterRole !== "Administrador") {
    return callback({ code: 7, message: "No autorizado" });
  }

  const user = await mariadb.users.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      rol: true,
      createdAt: true,
    },
  });

  if (!user) return callback({ code: 5, message: "Usuario no encontrado" });

  callback(null, user);
};

const updateUser = async (call, callback) => {
  const { id, requesterId, name, lastName, email } = call.request;

  if (id !== requesterId) {
    return callback({ code: 7, message: "No autorizado" });
  }

  if (!name && !lastName && !email) {
    return callback({ code: 3, message: "Debe proporcionar al menos uno" });
  }

  const updated = await mariadb.users.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(lastName && { lastName }),
      ...(email && { email }),
    },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      rol: true,
      createdAt: true,
    },
  });

  callback(null, updated);
};

const deleteUser = async (call, callback) => {
  const { id, requesterRole } = call.request;

  if (requesterRole !== "Administrador") {
    return callback({ code: 7, message: "No autorizado" });
  }

  const user = await mariadb.users.findUnique({ where: { id } });
  if (!user) return callback({ code: 5, message: "Usuario no encontrado" });

  await mariadb.users.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  callback(null, { message: "Usuario eliminado correctamente" });
};

const UserService = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};

module.exports = UserService;