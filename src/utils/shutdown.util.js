import prisma from "../config/prisma.config.js";

export default async function (signal) {
  console.log(`\nReceive ${signal}, shutting down`);
  try {
    await prisma.$disconnect();
    console.log("prisma disconnect");
  } catch (error) {
    console.log("error when disconnect", error);
  } finally{
    process.exit(0)
  }
}
