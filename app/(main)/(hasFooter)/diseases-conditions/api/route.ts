// import puppeteer from "puppeteer";
// const allLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

// type Disease = {
//   name: string;
//   url: string | null;
//   seeMore: {
//     text: string | null | undefined;
//     url: string | null | undefined;
//   };
// };

export async function GET(request: Request) {
  // let data;
  // const training = async () => {
  //   const browser = await puppeteer.launch({ headless: false });
  //   const page = await browser.newPage();
  //   await page.goto("https://www.mayoclinic.org/diseases-conditions", { timeout: 60000 });

  //   const diseaseNames: { [key: string]: Disease[] } = {};

  //   for (const letter of allLetters) {
  //     await page.goto(
  //       `https://www.mayoclinic.org/diseases-conditions/index?letter=${letter}`
  //     );
  //     const diseases = (await page.$$(`.cmp-result-letters + ul li`)).filter(
  //       (_, idx) => idx < 30
  //     );

  //     const diseaseArr: Disease[] = [];
  //     await Promise.all(
  //       diseases.map(async (disease) => {
  //         const diseaseName = await disease.evaluate((el: Element) => {
  //           return (
  //             el.querySelector<HTMLElement>(".cmp-result-name a")
  //               ?.textContent ||
  //             el.querySelector<HTMLElement>(".cmp-results-with-primary-name p")
  //               ?.textContent ||
  //             "N/A"
  //           );
  //         });

  //         const diseaseUrl = await disease.evaluate((el: Element) => {
  //           return (
  //             el.querySelector<HTMLAnchorElement>(".cmp-result-name a")?.href ||
  //             "N/A"
  //           );
  //         });

  //         const seeMore = await disease.evaluate((el: Element) => {
  //           const seeMoreElement = el.querySelector<HTMLElement>(
  //             ".cmp-results-with-primary-name__see"
  //           );

  //           return {
  //             text: seeMoreElement ? seeMoreElement?.textContent : "N/A",
  //             url: seeMoreElement
  //               ? seeMoreElement.querySelector<HTMLAnchorElement>("a")?.href
  //               : "N/A",
  //           };
  //         });

  //         const diseaseObj: Disease = {
  //           name: diseaseName || "N/A",
  //           url: diseaseUrl,
  //           seeMore,
  //         };
  //         diseaseArr.push(diseaseObj);


  //       })
  //     );
  //     diseaseNames[letter] = diseaseArr;
  //   }

  //   data = diseaseNames;

  //   await browser.close();
  // };
  // await training();
  return new Response("Hello World");
}
