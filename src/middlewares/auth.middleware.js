const { verify } = require("../utils/jwt.js");

exports.authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Token:", token); // Check if token is present

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
    console.log("Decoded Token:", decoded); // Check the decoded token

    switch (decoded.role) {
      case "admin":
        req.admin = decoded;
        req.userId = decoded.id;
        break;
      case "student":
        req.student = decoded;
        req.userId = decoded.id;
        break;
      case "teacher":
        req.teacher = decoded;
        req.userId = decoded.id;
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

    console.log("User assigned:", req.userId); // Check which user is assigned
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging
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
