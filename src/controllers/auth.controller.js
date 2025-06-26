import prisma from "../config/prisma.config.js";
import { createUser, getUserBy } from "../services/user.service.js";
import checkIdentity from "../utils/check-identity.util.js";
import createError from "../utils/create-error.util.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export async function register(req, res, next) {
//   try {
//     const { identity, firstName, lastName, password, confirmPassword } =
//       req.body;
//     if (
//       !(
//         identity.trim() &&
//         firstName.trim() &&
//         lastName.trim() &&
//         password.trim() &&
//         confirmPassword.trim()
//       )
//     ) {
//       createError(400, "Please fill all data");
//     }
//     if (password !== confirmPassword) {
//       createError(400, "Password is not matching");
//     }
//     const identityKey = checkIdentity(identity);

//     const foundUser = await prisma.user.findUnique({
//       where: { [identityKey]: identity },
//     });
//     if (foundUser) {
//       createError(409, `ALready have this users: ${identity}`);
//     }

//     const newUser = {
//       [identityKey]: identity,
//       password: await bcrypt.hash(password, 10),
//       firstName,
//       lastName,
//     };

//     const result = await prisma.user.create({ data: newUser });

//     res.json({ message: "Register Controller", result: result });
//   } catch (error) {
//     next(error);
//   }
// }

export async function registerYup(req, res, next) {
  console.log(req.body);
  try {
    const { email, mobile, firstName, lastName, password } = req.body;
    const identityKey = email ? "email" : "mobile";
    if (email) {
      // let foundUserEmail = await prisma.user.findUnique({ where: { email } });
      const foundUserEmail = await getUserBy(identityKey, email);
      if (foundUserEmail) createError(409, `Email: ${email} already been used`);
    }
    if (mobile) {
      // let foundUserEmail = await prisma.user.findUnique({ where: { mobile } });
      const foundUserMobile = await getUserBy(identityKey, mobile);
      if (foundUserMobile)
        createError(409, `Email: ${mobile} already been used`);
    }
    const newUser = {
      email,
      mobile,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
    };
    // const result = await prisma.user.create({ data: newUser });
    const result = await createUser(newUser);
    res.json({ message: "Register successful", result });
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  const { identity, password, email, mobile } = req.body;
  const identityKey = email ? "email" : "mobile";

  // const foundUser = await prisma.user.findUnique({
  //   where:  { [identityKey]: identity } ,
  // });
  const foundUser = await getUserBy(identityKey, identity);
  if (!foundUser) {
    createError(401, "Invalid Login");
  }
  let passwordIsOk = await bcrypt.compare(password, foundUser.password);
  if (!passwordIsOk) {
    createError(401, "Invalid Login");
  }
  const payload = { id: foundUser.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d",
  });

  const { password: pw, createAt, updateAt, ...userData } = foundUser;
 
  res.json({ message: "Login successful", token, user: userData });
};

export const getMe = async (req, res, next) => {
  res.json({ user: req.user});
};
