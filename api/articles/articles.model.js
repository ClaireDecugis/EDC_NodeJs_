const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
});

module.exports = model("Articles", articleSchema);
