// juste pour test
app.post("/api/auth/signup", (req, res) => {
  console.log("Requête reçue:", req.body);
  res.json({ message: "Route signup OK ✅" });
});
