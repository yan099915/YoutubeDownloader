const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
require("dotenv").config();

module.exports = {
  download: async (url, id) => {
    try {
      const videoID = url.toString().split("=");
      let info = await ytdl.getInfo(videoID[1]);
      let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      const filename = info.videoDetails.title.toString().split("|");
      const videoname = filename[0]
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/, "")
        .trim();
      const folder = "./downloaded/" + id + "/";
      const json = `./downloaded/${id}/${videoname}.json`;
      const m4a = `./downloaded/${id}/${videoname}.m4a`;

      // make directory for downloaded assets
      const directory = await fs.mkdir(
        folder,
        { recursive: true },
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      // save downloaded file information to json file
      const jsonfile = await fs.writeFile(
        path.resolve(json),
        JSON.stringify(info.videoDetails),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      // save m4a file to folder
      const download = await ytdl(url).pipe(fs.createWriteStream(m4a));
      const DOMAIN = process.env.domain;
      const data = { url: url, m4a: m4a, json: json };
      return data;
    } catch (error) {
      return error;
    }
  },

  list: async (location, json) => {
    const jsonfile = await fs.writeFile(
      path.resolve(location),
      JSON.stringify(json),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  },

  getdata: async (id) => {
    console.log(listdata, videoUrl);

    const check = await listdata.find(function (listdata, index) {
      if (listdata.url == videoUrl) {
        return true;
      }
    });
  },
};
