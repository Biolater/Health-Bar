"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export type Item = {
  title: string;
  snippet: string;
  publisher: string;
  timestamp: string;
  newsUrl: string;
  images: {
    thumbnail: string;
    thumbnailProxied: string;
  };
  hasSubnews?: boolean;
  subnews?: Item[];
};

export type HealthNews = {
  status: string;
  items: Item[];
};

const News = () => {
  const [healthNews, setHealthNews] = useState<HealthNews>({
    status: "",
    items: [
      {
        title: "Listeria outbreak turns deadly",
        snippet:
          "A deadly outbreak of Listeria has US health officials advising people who are pregnant, elderly or have compromised immune systems to avoid eating sliced ...",
        publisher: "69News WFMZ-TV",
        timestamp: "1721561280000",
        newsUrl:
          "https://www.wfmz.com/news/area/newjersey/listeria-outbreak-turns-deadly/article_617403f4-4754-11ef-b3b7-73a38a13c804.html",
        images: {
          thumbnail:
            "https://news.google.com/api/attachments/CC8iL0NnNTJlWEJwYzFadmJUZDBkRzlhVFJEbUFSaTJBeWdLTWdtZEpJQ3FYU0ZqWlFJ=-w280-h168-p-df-rw",
          thumbnailProxied:
            "https://i.zedtranslate.com/newsimage/CC8iL0NnNTJlWEJwYzFadmJUZDBkRzlhVFJEbUFSaTJBeWdLTWdtZEpJQ3FYU0ZqWlFJ",
        },
        hasSubnews: true,
        subnews: [
          {
            title:
              "Here’s what to do with deli meats as the CDC investigates a listeria outbreak across the U.S.",
            snippet:
              "An outbreak of listeria has U.S. health officials advising people who are pregnant, elderly or have compromised immune systems to avoid eating sliced deli ...",
            publisher: "The Associated Press",
            timestamp: "1721501220000",
            newsUrl:
              "https://apnews.com/article/listeria-outbreak-deli-meat-what-to-do-8d747960d6f7966138046047d00656ff",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNDNTRTE0TUdVd2RGcG5XbGhwVFJEVkFSakFBaWdLTWdhaGxKVE9OUWM=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNDNTRTE0TUdVd2RGcG5XbGhwVFJEVkFSakFBaWdLTWdhaGxKVE9OUWM",
            },
          },
          {
            title:
              "Mass. residents among those sick in deadly multi-state listeria outbreak",
            snippet:
              "Two Massachusetts residents are among those who have become sick as part of a deadly multi-state outbreak of listeria that has been linked to eating deli ...",
            publisher: "MassLive.com",
            timestamp: "1721567700000",
            newsUrl:
              "https://www.masslive.com/news/2024/07/mass-residents-among-those-sick-in-deadly-multi-state-listeria-outbreak.html",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNXZiM1Y2VjBwUGQzTXdTWGRKVFJERUF4aW1CU2dLTWdhbGxKVE9PUWM=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNXZiM1Y2VjBwUGQzTXdTWGRKVFJERUF4aW1CU2dLTWdhbGxKVE9PUWM",
            },
          },
          {
            title:
              "At Least 2 Dead in Listeria Outbreak Tied to Deli-Sliced Meat",
            snippet:
              "At least two people have died and more than two dozen others have been sickened in an outbreak of listeria that appears to be connected to meat sliced at ...",
            publisher: "The New York Times",
            timestamp: "1721498232000",
            newsUrl:
              "https://www.nytimes.com/2024/07/20/health/listeria-outbreak-deli-meats.html",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNWthWFU0VFdKRWVGSnJZemx5VFJDUUF4allCQ2dLTWdZUkFJcnJFQVk=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNWthWFU0VFdKRWVGSnJZemx5VFJDUUF4allCQ2dLTWdZUkFJcnJFQVk",
            },
          },
          {
            title:
              "Two deaths linked to nationwide listeria poisoning from over-the-counter deli meats; two illnesses reported in Missouri",
            snippet: "A listeria outbreak ...",
            publisher: "KY3",
            timestamp: "1721523660000",
            newsUrl:
              "https://www.ky3.com/2024/07/21/two-deaths-linked-nationwide-listeria-poisoning-over-the-counter-deli-meats-two-illnesses-reported-missouri/",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNU9TSHBSYlZoUVdHWnVibTlUVFJDZkF4ampCU2dLTWdZUmNJWVVQUVk=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNU9TSHBSYlZoUVdHWnVibTlUVFJDZkF4ampCU2dLTWdZUmNJWVVQUVk",
            },
          },
          {
            title: "Two Dead In Listeria Outbreak Linked To Deli Meats",
            snippet:
              "An outbreak of listeria related to deli meats has killed at least two people. The listeria outbreak started in late May and spread across at least a dozen ...",
            publisher: "The Weather Channel",
            timestamp: "1721574838000",
            newsUrl:
              "https://weather.com/health/video/listeria-outbreak-deli-meats",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iMkNnNHRWbXM1WkdFNVgzQjFkazExVFJDMEFSakFBaWdLTWdzTkFvUXJuYU9wd0xyaXlB=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iMkNnNHRWbXM1WkdFNVgzQjFkazExVFJDMEFSakFBaWdLTWdzTkFvUXJuYU9wd0xyaXlB",
            },
          },
          {
            title:
              "Two dead in multistate listeria outbreak linked with sliced deli meat, CDC says",
            snippet:
              "The US Centers for Disease Control and Prevention issued a warning Friday about a deadly multistate listeria outbreak connected to deli meat.",
            publisher: "CNN",
            timestamp: "1721425082000",
            newsUrl:
              "https://www.cnn.com/2024/07/19/health/deli-meat-listeria-outbreak/index.html",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iL0NnNWxNV2h5ZG5jeGJuTkhSM00wVFJDZkF4ampCU2dLTWdrQlFJYktvS1FtQ1FJ=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iL0NnNWxNV2h5ZG5jeGJuTkhSM00wVFJDZkF4ampCU2dLTWdrQlFJYktvS1FtQ1FJ",
            },
          },
        ],
      },
      {
        title: "Covid-19 variants causing trouble in Minnesota",
        snippet:
          "The Minnesota Department of Health says that hospitalization data indicates an uptick in covid cases in the state. The variants currently circulating are ...",
        publisher: "WDIO",
        timestamp: "1721515182000",
        newsUrl:
          "https://www.wdio.com/front-page/top-stories/covid-19-variants-causing-trouble-in-minnesota/",
        images: {
          thumbnail:
            "https://news.google.com/api/attachments/CC8iK0NnNDNaMmRqYW5kdFdWVnJkVzlXVFJDZkF4ampCU2dLTWdZQkFJaXFIQVk=-w280-h168-p-df-rw",
          thumbnailProxied:
            "https://i.zedtranslate.com/newsimage/CC8iK0NnNDNaMmRqYW5kdFdWVnJkVzlXVFJDZkF4ampCU2dLTWdZQkFJaXFIQVk",
        },
        hasSubnews: true,
        subnews: [
          {
            title: "What to Know About California’s Covid Surge",
            snippet:
              "There are only a few states where Covid is spreading more.",
            publisher: "The New York Times",
            timestamp: "1721307603000",
            newsUrl:
              "https://www.nytimes.com/2024/07/18/us/california-covid-surge.html",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iJ0NnNTJSR3BYYjJVMVF6RjFNVlJPVFJDcUJCaXFCQ2dLTWdNQllBUQ=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iJ0NnNTJSR3BYYjJVMVF6RjFNVlJPVFJDcUJCaXFCQ2dLTWdNQllBUQ",
            },
          },
          {
            title:
              "Caught by surprise: How covid summer is affecting the D.C. region",
            snippet:
              "An increase in covid cases in the D.C. region has upended summer plans yet again, catching residents by surprise and sending them scrambling for at-home ...",
            publisher: "The Washington Post",
            timestamp: "1721366724000",
            newsUrl:
              "https://www.washingtonpost.com/dc-md-va/2024/07/18/dmv-covid-summer/",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNUZZblpZVWpSa2RtNUZabU14VFJERUF4aW1CU2dLTWdhZGxvRHN1UVk=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNUZZblpZVWpSa2RtNUZabU14VFJERUF4aW1CU2dLTWdhZGxvRHN1UVk",
            },
          },
          {
            title:
              "Oregon one of seven states with ‘very high’ levels of COVID-19 in wastewater",
            snippet:
              "Oregon is one of seven states with “high levels” of COVID-19 detected in its wastewater, according to the Centers for Disease Control and Prevention.",
            publisher: "KOIN.com",
            timestamp: "1721228474000",
            newsUrl:
              "https://www.koin.com/news/health/oregon-one-of-seven-states-with-very-high-levels-of-covid-19-in-wastewater-07172024/",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNXBhWE14U25CYVJsUnhSbTAyVFJDZkF4ampCU2dLTWdZVlE1QUtKZ2c=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNXBhWE14U25CYVJsUnhSbTAyVFJDZkF4ampCU2dLTWdZVlE1QUtKZ2c",
            },
          },
          {
            title:
              "Why Covid is surging this summer — and what health experts say has changed",
            snippet:
              "President Biden's positive test for Covid-19 on Wednesday is a sign of a broader trend: Covid cases are on the rise this summer, gauged by rising wastewater ...",
            publisher: "STAT",
            timestamp: "1721339547000",
            newsUrl:
              "https://www.statnews.com/2024/07/18/latest-covid-spike-update-new-variants-fewer-novids/",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNWhVRUU0UTBodU5sODRibFI1VFJDcUJCaXFCQ2dLTWdZQkVJWm9wUVU=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNWhVRUU0UTBodU5sODRibFI1VFJDcUJCaXFCQ2dLTWdZQkVJWm9wUVU",
            },
          },
          {
            title:
              "Uptick in COVID-19 cases: What is public health saying about vaccines?",
            snippet:
              "A new COVID-19 variant is leading an increase in cases nationwide and President Joe Biden is among those who tested positive. Most of the cases being seen ...",
            publisher: "Deseret News",
            timestamp: "1721337218000",
            newsUrl:
              "https://www.deseret.com/lifestyle/2024/07/18/covid-cases-rise-new-variant-public-health/",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iJ0NnNUVVMjFuUkhWV01qRTFaV1Y0VFJDM0FSaVRBaWdCTWdNQmdBbw=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iJ0NnNUVVMjFuUkhWV01qRTFaV1Y0VFJDM0FSaVRBaWdCTWdNQmdBbw",
            },
          },
        ],
      },
      {
        title: "Sixth human case of bird flu reported in Colorado, CDC says",
        snippet:
          "A new human case of highly pathogenic H5N1 avian flu has been identified in Colorado, the US Centers for Disease Control and Prevention said Friday.",
        publisher: "CNN",
        timestamp: "1721431140000",
        newsUrl:
          "https://www.cnn.com/2024/07/19/health/bird-flu-colorado/index.html",
        images: {
          thumbnail:
            "https://news.google.com/api/attachments/CC8iK0NnNVVZVjlVVW5ZMVYxQkxPV1JGVFJDZkF4amlCU2dLTWdZSklJYkZrZ28=-w280-h168-p-df-rw",
          thumbnailProxied:
            "https://i.zedtranslate.com/newsimage/CC8iK0NnNVVZVjlVVW5ZMVYxQkxPV1JGVFJDZkF4amlCU2dLTWdZSklJYkZrZ28",
        },
        hasSubnews: true,
        subnews: [
          {
            title: "Bird Flu and Extreme Heat Are a Dangerous Combination",
            snippet:
              "A recent cluster of bird flu cases among poultry farm workers in Colorado is the latest example of an undeniable truth: Climate change is putting people at ...",
            publisher: "Bloomberg",
            timestamp: "1721476821000",
            newsUrl:
              "https://www.bloomberg.com/opinion/articles/2024-07-20/bird-flu-and-extreme-heat-are-a-dangerous-combination",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNVFXbTh0TjJSdlVFWnNWRTlNVFJERUF4aW5CU2dLTWdhaFVvcE9KUWM=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNVFXbTh0TjJSdlVFWnNWRTlNVFJERUF4aW5CU2dLTWdhaFVvcE9KUWM",
            },
          },
          {
            title:
              "H5N1 strikes another large layer farm in Colorado, dairy herd in Minnesota",
            snippet:
              "As Colorado continue its response to a highly pathogenic H5N1 avian flu outbreak at a massive egg-laying farm connected to five H5 illnesses in people ...",
            publisher: "University of Minnesota Twin Cities",
            timestamp: "1721420100000",
            newsUrl:
              "https://www.cidrap.umn.edu/avian-influenza-bird-flu/h5n1-strikes-another-large-layer-farm-colorado-dairy-herd-minnesota",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iNkNnNUhUbEJEV21GNk0ydDNXR3RTVFJESUFSajhBU2dCTWc0Qk1JUkxHS282dEZoc1RBYU9IZw=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iNkNnNUhUbEJEV21GNk0ydDNXR3RTVFJESUFSajhBU2dCTWc0Qk1JUkxHS282dEZoc1RBYU9IZw",
            },
          },
          {
            title:
              "Two more bird flu cases reported in Colorado, but elsewhere a study finds no asymptomatic infections",
            snippet:
              "U.S. health officials have announced two more bird flu cases among farmworkers. But here's some good news: A new study in Michigan suggests the virus is not ...",
            publisher: "The Associated Press",
            timestamp: "1721421240000",
            newsUrl:
              "https://apnews.com/article/bird-flu-cases-asymptomatic-cdc-colorado-2758cebffc125f954513a7ca6aeceb21",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iJ0NnNW1UblZ0YURRM056QTNRMGRHVFJEVkFSakFBaWdLTWdNVk5Bbw=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iJ0NnNW1UblZ0YURRM056QTNRMGRHVFJEVkFSakFBaWdLTWdNVk5Bbw",
            },
          },
          {
            title:
              "Chicken culling, disposal raise concern as bird flu spreads",
            snippet:
              "July 18 (Reuters) - The spread of bird flu among poultry and dairy farms has heightened some health experts' concerns that the process of killing and ...",
            publisher: "Reuters",
            timestamp: "1721297270000",
            newsUrl:
              "https://www.reuters.com/business/healthcare-pharmaceuticals/chicken-culling-disposal-raise-concern-bird-flu-spreads-2024-07-18/",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNXBNMU0yVlVzM1VVd3pjWGhxVFJEYUF4aUdCU2dLTWdZcE01Q09yUVk=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNXBNMU0yVlVzM1VVd3pjWGhxVFJEYUF4aUdCU2dLTWdZcE01Q09yUVk",
            },
          },
          {
            title:
              "Bird flu is widening its reach. Maps show US counties affected by outbreak.",
            snippet:
              "Four Colorado poultry farm employees are the latest confirmed cases of bird flu – also known as Avian influenza H5N1. The U.S. total stands at nine, ...",
            publisher: "USA TODAY",
            timestamp: "1721383979000",
            newsUrl:
              "https://www.usatoday.com/story/graphics/2024/07/19/bird-flu-map-us-counties-outbreak/74445661007/",
            images: {
              thumbnail:
                "https://news.google.com/api/attachments/CC8iK0NnNVlSa1J6UjFSNFpqSXdSbGRXVFJDUUF4aXNBaWdLTWdZQllvNkpNZ1k=-w280-h168-p-df-rw",
              thumbnailProxied:
                "https://i.zedtranslate.com/newsimage/CC8iK0NnNVlSa1J6UjFSNFpqSXdSbGRXVFJDUUF4aXNBaWdLTWdZQllvNkpNZ1k",
            },
          },
        ],
      },
    ],
  });
  const [newsLoading, setNewsLoading] = useState(true);
  const fetchHealthNews = async () => {
    const url = "https://google-news13.p.rapidapi.com/health?lr=en-US";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
        "x-rapidapi-host": "google-news13.p.rapidapi.com",
      },
    };
    try {
      const response = await fetch(url, options);
      const data: HealthNews = await response.json();
      data.items = data?.items?.slice(0, 10);
      if (data && data?.items?.length > 0) setHealthNews(data);
    } catch (err) {
      setNewsLoading(false);
      console.log(err);
    } finally {
      setNewsLoading(false);
    }
  };
  useEffect(() => {
    // fetchHealthNews()
    const timeout = setTimeout(() => {
      setNewsLoading(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <section id="news" className="px-4 py-8 relative">
      <div className="mx-auto flex flex-col items-center justify-center max-w-7xl">
        <h1 className="text-3xl md:text-5xl mb-8 md:mb-12 text-primary font-bold text-center">
          Health related news
        </h1>
        <div className="w-full flex justify-center px-10">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
          >
            <CarouselContent>
              {healthNews.items.map((newsItem, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardHeader className="p-0 max-w-full max-h-full">
                        {newsLoading ? (
                          <Skeleton className="rounded-ss-xl h-[200px] w-full rounded-se-xl rounded-es-none rounded-ee-none " />
                        ) : (
                          <Image
                            quality={100}
                            className="rounded-ss-xl rounded-se-xl w-full"
                            src={
                              newsItem?.images?.thumbnail ||
                              newsItem?.images?.thumbnailProxied
                            }
                            width={280}
                            height={200}
                            alt="news"
                          />
                        )}
                      </CardHeader>
                      <CardContent className="flex flex-col text-center gap-4 items-center justify-center p-6">
                        {newsLoading ? (
                          <>
                            <Skeleton className="w-full h-[28px]" />
                            <Skeleton className="w-full h-32" />
                            <Skeleton className="w-[110px] h-[36px]" />
                          </>
                        ) : (
                          <>
                            <CardTitle className="text-xl text-center">
                              {newsItem?.title}
                            </CardTitle>
                            <CardDescription>
                              {newsItem?.snippet}
                            </CardDescription>
                            <Link target="_blank" href={newsItem?.newsUrl}>
                              <Button className="text-white">Read more</Button>
                            </Link>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default News;
