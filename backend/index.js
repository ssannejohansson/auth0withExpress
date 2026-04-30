// backend/index.js
import express from "express";
import { authMiddleware } from "./middleware/auth.js";
import pkg from "express-openid-connect";
import cors from "cors";

const { requiresAuth } = pkg;
const app = express();
app.use(authMiddleware);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect("http://localhost:5173/profile");
  } else {
    res.redirect("http://localhost:5173");
  }
});

app.get("/profile", requiresAuth(), (req, res) => {
  try {
    res.json(req.oidc.user);
  } catch (error) {
    console.log(error);
  }
});

// Protected route
// app.get("/secure-data", verifyToken, (req, res) => {
//   res.json({
//     message: "This is protected data",
//     user: req.user, // Decoded token info
//   });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
