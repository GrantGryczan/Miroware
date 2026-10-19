"use strict";
const serverIndex = +process.argv[2];
console.log(`< Pipe ${serverIndex} >`);
const fs = require("fs");
const http = require("http");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const archiver = require("archiver");
const youKnow = require("./secret/youknow.js");
const axios = require("axios");

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const withTwoDigits = (value) => `0${value}`.slice(-2);

/** Formats a date for the `Last-Modified` header. */
const getLastModifiedString = (date) => {
  date = new Date(date);

  const weekday = weekdays[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const dateString = `${withTwoDigits(
    date.getUTCDate(),
  )} ${month} ${date.getUTCFullYear()}`;
  const timeString = `${withTwoDigits(date.getUTCHours())}:${withTwoDigits(
    date.getUTCMinutes(),
  )}:${withTwoDigits(date.getUTCSeconds())}`;

  return `${weekday}, ${dateString} ${timeString} GMT`;
};

(async () => {
  require("replthis")((v) => eval(v));
  const db = (
    await MongoClient.connect(youKnow.db, {
      useUnifiedTopology: true,
    })
  ).db("web");
  const users = db.collection("users");
  const items = db.collection("items");

  let b2Authorization;
  const AUTHORIZATION_PERIOD = 1000 * 60 * 60 * 24 * 7;
  const authorizeB2 = async () => {
    const { data } = await axios.get(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {
        auth: {
          username: youKnow.b2.auth.accessKeyId,
          password: youKnow.b2.auth.secretAccessKey,
        },
      },
    );

    const { data: data2 } = await axios.post(
      `${data.apiUrl}/b2api/v2/b2_get_download_authorization`,
      {
        bucketId: youKnow.b2.bucketID,
        fileNamePrefix: "",
        validDurationInSeconds: AUTHORIZATION_PERIOD / 1000,
      },
      {
        headers: {
          Authorization: data.authorizationToken,
        },
      },
    );

    b2Authorization = data2.authorizationToken;
  };
  await authorizeB2();
  setInterval(authorizeB2, AUTHORIZATION_PERIOD - 1000 * 60 * 10);
  const getB2 = (path) =>
    axios.get(`https://b2.filegarden.com/${path}`, {
      responseType: "stream",
      headers: {
        Authorization: b2Authorization,
      },
    });

  const app = express();
  app.disable("X-Powered-By");
  app.get("*", async (req, res) => {
    let path = req.path;
    if (path === "/") {
      res.redirect(302, "https://filegarden.com/");
      return;
    }
    if (path === "/robots.txt") {
      res.set("Content-Type", "text/plain").send(`User-agent: AddSearchBot
User-agent: AgentDataBot
User-agent: AgentTimes
User-agent: AI2Bot
User-agent: AI2Bot-DeepResearchEval
User-agent: Ai2Bot-Dolma
User-agent: aiHitBot
User-agent: AIWebIndex
User-agent: amazon-kendra
User-agent: amazon-QBusiness
User-agent: Amazonbot
User-agent: AmazonBuyForMe
User-agent: Amzn-SearchBot
User-agent: Amzn-User
User-agent: Andibot
User-agent: Anomura
User-agent: anthropic-ai
User-agent: ApifyBot
User-agent: ApifyWebsiteContentCrawler
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: Aranet-SearchBot
User-agent: atlassian-bot
User-agent: Awario
User-agent: AzureAI-SearchBot
User-agent: bedrockbot
User-agent: bigsur.ai
User-agent: BixelBot
User-agent: Bravebot
User-agent: Brightbot
User-agent: Brightbot 1.0
User-agent: BuddyBot
User-agent: Bytespider
User-agent: CCBot
User-agent: Channel3Bot
User-agent: ChatGLM-Spider
User-agent: ChatGPT Agent
User-agent: ChatGPT-User
User-agent: Claude-Code
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: Claude-Web
User-agent: ClaudeBot
User-agent: Cloudflare-AutoRAG
User-agent: CloudflareBrowserRenderingCrawler
User-agent: CloudVertexBot
User-agent: Code
User-agent: cohere-ai
User-agent: cohere-training-data-crawler
User-agent: Cotoyogi
User-agent: CragCrawler
User-agent: Crawl4AI
User-agent: Crawlspace
User-agent: Cursor
User-agent: Datenbank Crawler
User-agent: DeepSeekBot
User-agent: Devin
User-agent: Diffbot
User-agent: Diffbot-User
User-agent: DoubaoBot
User-agent: DuckAssistBot
User-agent: Echobot Bot
User-agent: EchoboxBot
User-agent: ERNIEBot
User-agent: ExaBot
User-agent: ExaSearchBot
User-agent: FacebookBot
User-agent: facebookexternalhit
User-agent: Factset_spyderbot
User-agent: FirecrawlAgent
User-agent: FriendlyCrawler
User-agent: GeistHaus-PageFetcher
User-agent: Gemini-Deep-Research
User-agent: Google-Agent
User-agent: Google-CloudVertexBot
User-agent: Google-Extended
User-agent: Google-Firebase
User-agent: Google-Gemini-CLI
User-agent: Google-NotebookLM
User-agent: GoogleAgent-Mariner
User-agent: GoogleAgent-URLContext
User-agent: GoogleOther
User-agent: GoogleOther-Image
User-agent: GoogleOther-Video
User-agent: GPTBot
User-agent: GrokAppAndroid
User-agent: GrokBot
User-agent: HenkBot
User-agent: Hunyuan
User-agent: iAskBot
User-agent: iaskspider
User-agent: iaskspider/2.0
User-agent: ICC-Crawler
User-agent: ImagesiftBot
User-agent: imageSpider
User-agent: img2dataset
User-agent: ISSCyberRiskCrawler
User-agent: kagi-fetcher
User-agent: Kangaroo Bot
User-agent: KeenableBot
User-agent: Kimi-Agent
User-agent: Kimi-SearchBot
User-agent: Kimi-User
User-agent: KimiBot
User-agent: KlaviyoAIBot
User-agent: KunatoCrawler
User-agent: laion-huggingface-processor
User-agent: LAIONDownloader
User-agent: LCC
User-agent: Lightpanda
User-agent: LinerBot
User-agent: Linguee Bot
User-agent: LinkupBot
User-agent: Manus-User
User-agent: meta-externalagent
User-agent: Meta-ExternalAgent
User-agent: meta-externalfetcher
User-agent: Meta-ExternalFetcher
User-agent: meta-webindexer
User-agent: MistralAI-Index
User-agent: MistralAI-Training
User-agent: MistralAI-User
User-agent: MistralAI-User/1.0
User-agent: MoonshotBot
User-agent: Mozilla-Tabstack
User-agent: MyCentralAIScraperBot
User-agent: NagetBot
User-agent: nbot
User-agent: netEstate Imprint Crawler
User-agent: newsai
User-agent: NotebookLM
User-agent: NovaAct
User-agent: OAI-AdsBot
User-agent: OAI-SearchBot
User-agent: omgili
User-agent: omgilibot
User-agent: OpenAI
User-agent: opencode
User-agent: Operator
User-agent: PanguBot
User-agent: Panscient
User-agent: panscient.com
User-agent: Perplexity-User
User-agent: PerplexityBot
User-agent: PetalBot
User-agent: PhindBot
User-agent: Poggio-Citations
User-agent: Poseidon Research Crawler
User-agent: qodercli
User-agent: QualifiedBot
User-agent: Querit-SearchBot
User-agent: QueritBot
User-agent: QuillBot
User-agent: quillbot.com
User-agent: QwenBot
User-agent: Reflectionbot
User-agent: SBIntuitionsBot
User-agent: Scrapy
User-agent: SemrushBot-OCOB
User-agent: SemrushBot-SWA
User-agent: Shap-User
User-agent: ShapBot
User-agent: Sidetrade indexer bot
User-agent: Spider
User-agent: TavilyBot
User-agent: Terra Cotta
User-agent: TerraCotta
User-agent: Thinkbot
User-agent: TikTokSpider
User-agent: Timpibot
User-agent: TongyiBot
User-agent: Trae
User-agent: TwinAgent
User-agent: UseAI
User-agent: VelenPublicWebCrawler
User-agent: WARDBot
User-agent: Webzio-Extended
User-agent: webzio-extended
User-agent: wpbot
User-agent: WRTNBot
User-agent: xAI-Grok
User-agent: YaK
User-agent: YandexAdditional
User-agent: YandexAdditionalBot
User-agent: YiBot
User-agent: YiyanBot
User-agent: YouBot
User-agent: ZanistaBot
Disallow: /
`);
      return;
    }
    res
      .set("Access-Control-Allow-Origin", "*")
      .set(
        "Content-Security-Policy",
        "default-src file.garden linkh.at data: mediastream: blob: 'unsafe-inline' 'unsafe-eval'",
      )
      .set("Cache-Control", "no-transform");
    if (req.hostname === "pipe.miroware.io") {
      const referrer = req.get("Referer");
      if (referrer) {
        console.log(referrer, req.url);
      }
      let url = req.url.slice(1);
      url = url.replace(/^[0-9a-f]{24}/, (hex) =>
        Buffer.from(hex, "hex").toString("base64url"),
      );
      res.redirect(301, `https://file.garden/${url}`);
      return;
    }

    path = path.slice(1);
    try {
      path = decodeURIComponent(path);
    } catch (err) {
      res.header("Content-Type", "text/plain").status(400).send(err.message);
      return;
    }
    const slashIndex = path.indexOf("/");
    const pathRoot = path.slice(0, slashIndex);
    let userQuery;
    if (pathRoot.startsWith("@")) {
      userQuery = {
        tag: pathRoot.slice(1),
      };
    } else {
      try {
        if (slashIndex === -1) {
          throw 404;
        }
        userQuery = {
          _id: new ObjectId(Buffer.from(pathRoot, "base64url")),
        };
      } catch {
        res.sendStatus(404);
        return;
      }
    }

    userQuery.shadowBanned = { $exists: false };
    const user = await users.findOne(userQuery);

    if (!user) {
      res.sendStatus(404);
      return;
    }

    path = path.slice(slashIndex + 1);

    if (
      path.startsWith(`${user.pipe.find((item) => item.id === "trash").path}/`)
    ) {
      res.sendStatus(404);
      return;
    }

    const item =
      user.pipe.find((item) => item.path === path) ||
      (await items.findOne({
        userID: user._id,
        path,
      }));

    if (!item || item.privacy === 2) {
      res.sendStatus(404);
      return;
    }

    const userIDString = user._id.toString("base64url");
    if (item.type === "/") {
      res.set("Content-Type", "application/zip");
      const archive = archiver("zip");
      archive.on("error", (error) => {
        throw error;
      });
      archive.pipe(res);
      const sliceStart = path.length + 1; // Change `path.length` to `path.lastIndexOf('/')` to put the folder inside of the ZIP instead of having the ZIP be the folder itself.
      const promises = [];
      const scan = (parent) => {
        for (const item of user.pipe) {
          if (item.parent === parent && item.privacy === 0) {
            if (item.type === "/") {
              scan(item.id);
            } else {
              promises.push(
                getB2(`/${userIDString}/${item.id}`).then(({ data }) => {
                  archive.append(data, {
                    name: item.path.slice(sliceStart),
                  });
                }),
              );
            }
          }
        }
      };
      scan(item.id);
      Promise.all(promises).then(() => {
        archive.finalize();
      });
    } else {
      getB2(`${userIDString}/${item.id}`)
        .then((response) => {
          res.set("Content-Type", item.type);
          res.set("Content-Length", response.headers["content-length"]);
          res.set("Last-Modified", getLastModifiedString(item.date));
          response.data.pipe(res);
        })
        .catch((error) => {
          console.error(error);
          res.status(error.response?.status || 500).send(error.message);
        });
    }
  });
  http.createServer(app).listen(8200 + serverIndex);
})();
setTimeout(
  () => {
    process.exit();
  },
  (8 + Math.random()) * 1000 * 60 * 60,
);
fs.watch(__filename, () => {
  process.exit();
});
