const Article = require("./articles.model");

class ArticleService {
  create(data) {
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
  getArticlesByUserId(userId) {
    return Article.find({ createdBy: userId })
      .populate("createdBy", "-password")
      .exec();
  }
}

module.exports = new ArticleService();
