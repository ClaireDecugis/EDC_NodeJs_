const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.model");
const articlesService = require("../api/articles/articles.service");

describe("Tester API Articles", () => {
  let token;
  const USER_ID = "fakeUserId";
  const MOCK_ARTICLE_DATA = [
    {
      _id: "articleId1",
      title: "Article 1",
      content: "Contenu de l'article 1",
      createdBy: USER_ID,
    },
    {
      _id: "articleId2",
      title: "Article 2",
      content: "Contenu de l'article 2",
      createdBy: USER_ID,
    },
  ];

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    // Utilisation de Mockingoose pour simuler les opérations de la base de données
    mockingoose(Article).toReturn(MOCK_ARTICLE_DATA, "find");
    mockingoose(Article).toReturn({}, "save");
  });

  test("[Articles] Get All", async () => {
    const res = await request(app)
      .get("/api/articles")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(MOCK_ARTICLE_DATA.length);
  });

  test("[Articles] Create Article", async () => {
    const newArticleData = {
      title: "Nouvel article",
      content: "Contenu du nouvel article",
    };

    const res = await request(app)
      .post("/api/articles")
      .send(newArticleData)
      .set("x-access-token", token);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newArticleData.title);
    expect(res.body.content).toBe(newArticleData.content);
  });

  test("[Articles] Update Article", async () => {
    const articleToUpdateId = "articleId1";
    const updatedData = {
      title: "Article mis à jour",
      content: "Nouveau contenu de l'article",
    };

    const res = await request(app)
      .put(`/api/articles/${articleToUpdateId}`)
      .send(updatedData)
      .set("x-access-token", token);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(articleToUpdateId);
    expect(res.body.title).toBe(updatedData.title);
    expect(res.body.content).toBe(updatedData.content);
  });

  test("[Articles] Delete Article", async () => {
    const articleToDeleteId = "articleId1";

    const res = await request(app)
      .delete(`/api/articles/${articleToDeleteId}`)
      .set("x-access-token", token);

    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
