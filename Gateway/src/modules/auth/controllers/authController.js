const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { mariadb, postgres } = require("../../../database/prisma");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await mariadb.users.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Credenciales incorrectas", 401));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  await postgres.AuthToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  res.status(200).json({
    status: "success",
    token,
    user: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      rol: user.rol,
    },
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = id;
  
    if (!req.user) {
      return next(new AppError("Debe iniciar sesion", 401));
    }
  
    if (req.user.id !== userId) {
      return next(new AppError("No autorizado", 403));
    }
  
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
  
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(new AppError("Debe llenar los campos", 400));
    }
  
    if (newPassword !== confirmNewPassword) {
      return next(new AppError("Las contrasenas no coinciden", 400));
    }
  
    const user = await mariadb.users.findUnique({ where: { id: userId } });
  
    if (!user) {
      return next(new AppError("Usuario no encontrado", 404));
    }
  
    const isCorrectPassword = await bcrypt.compare(currentPassword, user.password);
  
    if (!isCorrectPassword) {
      return next(new AppError("La contraseña actual es incorrecta", 401));
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 12);
  
    await mariadb.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  
    res.status(200).json({
      status: "success",
      message: "Contraseña actualizada",
    });
  });

module.exports = {login, updatePassword};