const { verify } = require("../utils/jwt.js");

exports.authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: {
        uz: "Token yo'q",
        ru: "Отсутствует токен",
        en: "Token not found",
      },
    });
  }
  try {
    const decoded = verify(token);
    req.userId = decoded.id;
    switch (decoded.role) {
      case "admin":
        req.admin = decoded;
        break;
      case "student":
        req.student = decoded;
        break;
      case "teacher":
        req.teacher = decoded;
        break;
      default:
        return res.status(403).json({
          status: "error",
          message: {
            uz: "Ruxsat yo'q",
            ru: "Доступ запрещен",
            en: "Access denied",
          },
        });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: {
        uz: "Noto'g'ri token",
        ru: "Неверный токен",
        en: "Invalid token",
      },
    });
  }
};
