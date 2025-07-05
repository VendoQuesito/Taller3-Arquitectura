const {mariadb} = require("../../../database/prisma");
const bcrypt = require("bcryptjs");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");

const getUsers = catchAsync(async (req, res, next) => {
    const users = await mariadb.users.findMany();
    res.status(200).json(users);
  });
  const createUser = catchAsync(async (req, res, next) => {
    const { name, lastName, email, password, confirmPassword, rol } = req.body;
  
    if (!name || !email || !password || !confirmPassword || !rol) {
      return next(new AppError("Faltan campos", 400));
    }
  
    if (password !== confirmPassword) {
      return next(new AppError("Las contraseñas no coinciden", 400));
    }
  
    const allowedRoles = ["Administrador", "Cliente"];
    if (!allowedRoles.includes(rol)) {
      return next(new AppError("Rol no valido", 400));
    }
  
    if (rol === "Administrador") {
      if (!req.user || req.user.rol !== "Administrador") {
        return next(new AppError("No autorizado", 403));
      }
    }
    const existingUser = await mariadb.users.findUnique({
      where: { email },
    });
  
    if (existingUser) {
      return next(new AppError("El correo ya esta en uso", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await mariadb.users.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
        rol,
      }
    });
    res.status(201).json(newUser);
  });

const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!req.user) {
    return next(new AppError("Debe iniciar sesion", 401));
  }

  const requestedId = id;

  if (req.user.id !== requestedId && req.user.rol !== "Administrador") {
    return next(new AppError("No autorizado", 403));
  }

  const user = await mariadb.users.findUnique({
    where: { id: requestedId },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      rol: true,
      createdAt: true,
    },
  });

  if (!user) {
    return next(new AppError("Usuario no encontrado", 404));
  }
  res.status(200).json(user);
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const requestedId = id;

  if (!req.user) {
    return next(new AppError("Debe iniciar sesion", 401));
  }

  if (req.user.id !== requestedId) {
    return next(new AppError("No autorizado", 403));
  }

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError("No se puede modificar la contraseña", 400)
    );
  }

  const { name, lastName, email } = req.body;

  if (!name && !lastName && !email) {
    return next(new AppError("Debe proporcionar al menos uno", 400));
  }

  const updatedUser = await mariadb.users.update({
    where: { id: requestedId },
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

  res.status(200).json(updatedUser);
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const requestedId = id;
  
    if (!req.user) {
      return next(new AppError("Debe iniciar sesion", 401));
    }
  
    if (req.user.rol !== "Administrador") {
      return next(new AppError("No autorizado", 403));
    }
  
    const user = await mariadb.users.findUnique({
      where: { id: requestedId },
    });
  
    if (!user) {
      return next(new AppError("Usuario no encontrado", 404));
    }
  
    await mariadb.users.update({
      where: { id: requestedId },
      data: { deletedAt: new Date() },
    });
  
    res.status(204).send();
  });
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};