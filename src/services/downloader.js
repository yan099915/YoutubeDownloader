const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

module.exports = {
  download: async (url, id) => {
    try {
      const videoID = url.toString().split("=");
      let info = await ytdl.getInfo(videoID[1]);
      let audioFormats = ytdl.filterFormats(info.formats, "audioonly");

      const videoname = videoID[1].trim();
      const folder = "./data/" + id;
      const json = `./data/${id}/${videoname}.json`;
      const m4a = `./data/${id}/${videoname}.m4a`;
      const url1 = `http://yt-downloader.deploy.cbs.co.id/${id}/${videoname}.m4a`;
      const url2 = `http://yt-downloader.deploy.cbs.co.id/${id}/${videoname}.json`;

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
      const data = { url: url, m4a: url1, json: url2 };
      return data;
    } catch (error) {
      console.log(error);
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
