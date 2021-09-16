require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const application = require("../services/downloader");

module.exports = {
  // USER LOGIN
  main: async (req, res) => {
    const { id, url, limit } = req.query;
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        "/usr/src/app/node_modules/puppeteer/.local-chromium/linux-901912/chrome-linux/chrome",
    });
    // const browser = await puppeteer.launch({
    //   headless: true,
    // });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url);
    await page.evaluate((_) => {
      window.scrollBy(1, window.innerHeight);
    });

    let listdata = [];

    let downloaded = 0;
    let videos = await page.$$("#items #dismissible");
    const location = `./data/${id}/list.json`;

    // find and check list.json
    try {
      if (fs.existsSync(location)) {
        //file exists
        listdata = JSON.parse(fs.readFileSync(location).toString());
        console.log(listdata);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      for (i = 1; i <= videos.length; i++) {
        let boolean = false;
        const videoUrl = await page.$$eval(
          `#items ytd-grid-video-renderer:nth-child(${i}) #dismissible #details #meta #video-title`,
          (nodes) => nodes.map((n) => n.href)
        );

        // if (listdata.length > 0) {
        //   console.log("checking");
        //   const checking = await listdata.find(function (listdata, index) {
        //     if (listdata.url == videoUrl) {
        //       boolean = true;
        //     }
        //   });
        // }

        if (listdata.length > 10) {
          console.log("checking");
          for (j = 0; j < listdata.length; j++) {
            if (listdata[j].url == videoUrl) {
              console.log(j, listdata[j].url);
              boolean = true;
            }
          }
        }
        // console.log(videoUrl.toString());
        console.log(i);

        if (boolean == false) {
          const downloadFile = await application.download(
            videoUrl.toString(),
            id
          );
          downloaded += 1;
          await listdata.push(downloadFile);
          console.log("Downloaded files from : " + videoUrl.toString());
          console.log("files downloaded " + downloaded);
        }

        // auto save downloaded file list every 10 videos
        if (i % 10 == 0) {
          const savelist = await application.list(location, listdata);
        }

        //checking videos qty
        for (j = 0; j < 5; j++) {
          if (i == videos.length - 1) {
            console.log("checking length");

            page.evaluate((_) => {
              window.scrollBy(0, window.innerHeight);
            });
            await page.waitForTimeout(5000);
            videos = await page.$$("#items #dismissible");
          }
        }
        // Boolean(download == limit);
        if (downloaded >= limit) {
          const savelist = await application.list(location, listdata);
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(listdata);
    res.status(201).send({ message: `Downloaded files: ${downloaded}` });
  },

  data: async (req, res) => {
    const id = req.query.id;
    const location = `./data/${id}/list.json`;
    try {
      if (fs.existsSync(location)) {
        //file exists
        res.status(200).download(location);
      } else {
        res.status(400).send({ message: "File with that id is not exist" });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
