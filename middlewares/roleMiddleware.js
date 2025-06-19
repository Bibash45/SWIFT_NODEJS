const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Access Denied",
      });
    }
    next();
  };
};

export default roleCheck;
