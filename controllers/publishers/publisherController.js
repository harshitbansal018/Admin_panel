const bcrypt = require("bcrypt");
const publisherModel = require("../../model/publishers/publisherModel");

const publisherController = {

// 🔐 Show Login Page
getLogin: (req, res) => {
res.render("publishers/login", { error: null, success: null });
},

// 🔐 Handle Login
postLogin: async (req, res) => {
try {
let { email, password } = req.body;


  // 🔹 Trim & normalize
  email = email?.trim().toLowerCase();
  password = password?.trim();

  // 🔹 Validation
  if (!email || !password) {
    return res.render("publishers/login", {
      error: "All fields are required",
      success: null,
    });
  }

  const publisher = await publisherModel.findByEmail(email);

  if (!publisher) {
    return res.render("publishers/login", {
      error: "Publisher not found",
      success: null,
    });
  }

  const isMatch = await bcrypt.compare(password, publisher.password);

  if (!isMatch) {
    return res.render("publishers/login", {
      error: "Invalid password",
      success: null,
    });
  }

  // ✅ Store session (clean & minimal)
  req.session.user = {
    id: publisher.id,
    username: publisher.username,
    role: "publisher",
  };

  return res.redirect("/publisher/dashboard");

} catch (err) {
  console.error("Login Error:", err);
  return res.render("publishers/login", {
    error: "Login failed. Try again.",
    success: null,
  });
}

},

// 📝 Show Signup Page
getSignup: (req, res) => {
res.render("publishers/signup", { error: null, success: null });
},

// 📝 Handle Signup
postSignup: async (req, res) => {
try {
let { username, email, password } = req.body;


  // 🔹 Trim & normalize
  username = username?.trim();
  email = email?.trim().toLowerCase();
  password = password?.trim();

  // 🔹 Validation
  if (!username || !email || !password) {
    return res.render("publishers/signup", {
      error: "All fields are required",
      success: null,
    });
  }

  // 🔹 Check existing email
  const existingPublisher = await publisherModel.findByEmail(email);

  if (existingPublisher) {
    return res.render("publishers/signup", {
      error: "Email already exists",
      success: null,
    });
  }

  // 🔐 Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Save publisher
  await publisherModel.createPublisher(username, email, hashedPassword);

  return res.render("publishers/login", {
    error: null,
    success: "Signup successful! Please login.",
  });

} catch (err) {
  console.error("Signup Error:", err);
  return res.render("publishers/signup", {
    error: "Signup failed. Try again.",
    success: null,
  });
}


},

// 🚪 Logout
logout: (req, res) => {
req.session.destroy((err) => {
if (err) {
console.error("Logout Error:", err);
return res.redirect("/publisher/login");
}


  res.clearCookie("connect.sid");
  return res.redirect("/publisher/login");
});


}

};

module.exports = publisherController;
