const app = require("./src/app");

app.listen(3000 | process.env.PORT, () => {
  console.log("server is running on port 3000");
});
