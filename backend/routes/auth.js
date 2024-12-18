const router = require("express").Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const {  protect } = require("../middleware/authMiddleware");
// Login success route
router.get("/login/success", protect, async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: true, message: "User not authenticated" });
  }

  res.status(200).json({
    error: false,
    message: "Successfully Authenticated",
    user: req.user,
});
});


// Login failed route
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

// Google OAuth route
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// Google callback route
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/login/failed",
        session: true
    }),
    (req, res) => {
        if (!req.user) {
            return res.redirect(`${process.env.CLIENT_URL}?error=true&message=Authentication failed`);
        }

        try {
            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            // Redirect to client URL with token
            res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.CLIENT_URL}?error=true&message=Error generating token`);
        }
    }
);

// Logout route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;
