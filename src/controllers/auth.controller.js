export function register(req, res, next) {
  res.json({ message: "Register Controller", body: req.body });
}

export const login = (req, res, next) => {
  res.json({ message: "Login Controller", body: req.body });
};

export const getMe = (req, res, next) => {
  res.json({ message: "Get Me Controller" });
};
