"use client";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useState, useEffect } from "react";
const projects = {
  status: "success",
  items: [
    {
      title:
        "Exploring the link between time perspective and life satisfaction in adulthood",
      snippet:
        "Humans can relate to the passage of time differently, experiencing a multitude of thoughts and emotions about their past, present and future.",
      publisher: "Medical Xpress",
      timestamp: "1723030201000",
      newsUrl:
        "https://medicalxpress.com/news/2024-08-exploring-link-perspective-life-satisfaction.html",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNU5SVFpqZVVWWGQzUkhkR05ZVFJERUF4aW1CU2dLTWdhbGRJek5xUWM=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNU5SVFpqZVVWWGQzUkhkR05ZVFJERUF4aW1CU2dLTWdhbGRJek5xUWM",
      },
      hasSubnews: false,
    },
    {
      title:
        "Alzheimer's Breakthrough as Parkinson's Drug Surprise Teases New Treatment",
      snippet:
        "Scientists have identified a potential new target for treating Alzheimer's disease that works by restoring the brain's own \"self-cleanup\" process.",
      publisher: "Newsweek",
      timestamp: "1722967201000",
      newsUrl:
        "https://www.newsweek.com/alzheimers-breakthrough-parkinsons-drug-treatment-1935163",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iMkNnNXplbTkyYURSdWN6SjBiazlwVFJEZ0F4aUFCU2dLTWdzQmdvb0l1YVJFUzFxd1RB=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iMkNnNXplbTkyYURSdWN6SjBiazlwVFJEZ0F4aUFCU2dLTWdzQmdvb0l1YVJFUzFxd1RB",
      },
      hasSubnews: false,
    },
    {
      title:
        "A Denver pediatrician helped make some of the biggest pandemic vaccine decisions. Here’s what he thinks now.",
      snippet:
        "When Dr. Matthew Daley began his term on a previously little-known advisory committee with the U.S. Centers for Disease Control and Prevention, ...",
      publisher: "The Colorado Sun",
      timestamp: "1723023300000",
      newsUrl:
        "https://coloradosun.com/2024/08/07/matthew-daley-acip-covid-vaccine/",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iL0NnNUxkWFpJUzBwUGRqRkplWEkwVFJEREF4aW5CU2dLTWdrWlFwYjFyR2VhaGdJ=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iL0NnNUxkWFpJUzBwUGRqRkplWEkwVFJEREF4aW5CU2dLTWdrWlFwYjFyR2VhaGdJ",
      },
      hasSubnews: false,
    },
    {
      title:
        "Valter Longo longevity diet reversed his high cholesterol, blood sugar",
      snippet:
        "Valter Longo ate like an American when he moved from Italy to the US. Within 8 years, his health markers were looking rough. Tweaks to his diet made a ...",
      publisher: "Business Insider",
      timestamp: "1723061040000",
      newsUrl:
        "https://www.businessinsider.com/valter-longo-longevity-diet-reversed-his-high-cholesterol-blood-sugar-2024-8",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iL0NnNWlNSE5MUW1GSk5uaFJRVVJrVFJEZ0F4aUFCU2dLTWdrTllaSzNJT214andF=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iL0NnNWlNSE5MUW1GSk5uaFJRVVJrVFJEZ0F4aUFCU2dLTWdrTllaSzNJT214andF",
      },
      hasSubnews: false,
    },
    {
      title:
        "'My hair looks younger': Shoppers say this $9 hair growth oil is 'liquid gold'",
      snippet:
        "Finding more and more hair fallout in your brush or shower drain? Suffering from the plague of split ends? Just want to make your hair softer, stronger and ...",
      publisher: "Yahoo Life",
      timestamp: "1723066274000",
      newsUrl:
        "https://www.yahoo.com/lifestyle/my-hair-looks-younger-shoppers-say-this-9-hair-growth-oil-is-liquid-gold-213114530.html",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNXBRM0k1TkdoQk5WZzVWVGRLVFJESUF4aWhCU2dLTWdZZGNZNFF2UVU=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNXBRM0k1TkdoQk5WZzVWVGRLVFJESUF4aWhCU2dLTWdZZGNZNFF2UVU",
      },
      hasSubnews: false,
    },
    {
      title: "Treat or Train? Orexin Helps Brain Decide",
      snippet:
        "Researchers have identified orexin, a brain chemical, as crucial in deciding between exercising and indulging in treats.",
      publisher: "Neuroscience News",
      timestamp: "1722979690000",
      newsUrl:
        "https://neurosciencenews.com/orexin-diet-exercise-decision-27525/",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNUhTVGhRVm1SdGRYRXhXbXRKVFJERUF4aW5CU2dLTWdZQllJaHJMUWM=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNUhTVGhRVm1SdGRYRXhXbXRKVFJERUF4aW5CU2dLTWdZQllJaHJMUWM",
      },
      hasSubnews: false,
    },
    {
      title:
        "Top oncologist reveals the science-backed daily meal plan that can help prevent colon cancer",
      snippet:
        "Dietitians and oncologists in the US have revealed their science-backed meal plans shown to reduce the risk of colorectal cancer. These include foods high ...",
      publisher: "Daily Mail",
      timestamp: "1723042413000",
      newsUrl:
        "https://www.dailymail.co.uk/health/article-13715171/daily-meal-plan-colon-cancer-prevention-oncologists-advice.html",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNXFVWGszV2xSb2RFMWZORGd0VFJDZkF4ampCU2dLTWdZTkFJcnVsQVU=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNXFVWGszV2xSb2RFMWZORGd0VFJDZkF4ampCU2dLTWdZTkFJcnVsQVU",
      },
      hasSubnews: false,
    },
    {
      title:
        "Bread with sprouted grains offers 'enhanced nutritional profile,' may be healthier way to enjoy carbs",
      snippet:
        "Are sprouted grains nutritionally better for you? Food experts shared the benefits, potential drawbacks and more for this trendy and potential bread ...",
      publisher: "Fox News",
      timestamp: "1722937800000",
      newsUrl:
        "https://www.foxnews.com/food-drink/bread-sprouted-grains-enhanced-nutritional-profile-healthier-way-enjoy-carbs",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNVRka3RMZGpKbU9UVnFOVUZxVFJDZkF4ampCU2dLTWdZQllJYld0QU0=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNVRka3RMZGpKbU9UVnFOVUZxVFJDZkF4ampCU2dLTWdZQllJYld0QU0",
      },
      hasSubnews: false,
    },
    {
      title: "11 Medication Mistakes You May Be Making",
      snippet:
        "Research shows that as many as half of all patients don't follow medication instructions properly. Check out 11 common medication errors to avoid.",
      publisher: "AARP",
      timestamp: "1722978460000",
      newsUrl:
        "https://www.aarp.org/health/drugs-supplements/info-2024/medication-errors.html",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNVVhbFZwUkdWNGRsODRXaTFyVFJDcUFSaW9BaWdCTWdZcFpZak9LUVk=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNVVhbFZwUkdWNGRsODRXaTFyVFJDcUFSaW9BaWdCTWdZcFpZak9LUVk",
      },
      hasSubnews: false,
    },
    {
      title:
        "The #1 Reason Why You May Be Gaining Weight Despite Working Out & Eating Healthier",
      snippet:
        "Discover the number one reason why starting a new fitness routine and eating healthier may cause you to gain weight.",
      publisher: "EatingWell",
      timestamp: "1722972668000",
      newsUrl:
        "https://www.eatingwell.com/reason-for-gain-weight-from-exercise-and-healthy-eating-8691199",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iL0NnNWhhRVZTYkRad2NFeFNTRGxmVFJESEF4aWlCU2dLTWdrTkVwZ3lsYXFwcFFJ=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iL0NnNWhhRVZTYkRad2NFeFNTRGxmVFJESEF4aWlCU2dLTWdrTkVwZ3lsYXFwcFFJ",
      },
      hasSubnews: false,
    },
    {
      title:
        "Dr. Roach: Citrus bergamot significantly lowers cholesterol level",
      snippet:
        "Dear Dr. Roach: Please look into citrus bergamot. It is a beneficial supplement that lowers cholesterol very efficiently and effectively.",
      publisher: "Detroit News",
      timestamp: "1723003396000",
      newsUrl:
        "https://www.detroitnews.com/story/life/advice/2024/08/07/dr-roach-citrus-bergamot-significantly-lowers-cholesterol-level/74689380007/",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNXVRemR5TURoZlUwMXFMVXhGVFJDQUJSamZBeWdLTWdZcFJaQ3RvUWc=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNXVRemR5TURoZlUwMXFMVXhGVFJDQUJSamZBeWdLTWdZcFJaQ3RvUWc",
      },
      hasSubnews: false,
    },
    {
      title: "Sensory Neurons Play Role in Cancer Development",
      snippet:
        "Recent research highlights the role of sensory nerves in promoting breast cancer metastasis.",
      publisher: "Neuroscience News",
      timestamp: "1723062827000",
      newsUrl: "https://neurosciencenews.com/sensory-neurons-cancer-27528/",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNTBaMlJ0ZGw5V2IzcFdlbkJxVFJERUF4aW5CU2dLTWdaTmdKQ1hNQWM=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNTBaMlJ0ZGw5V2IzcFdlbkJxVFJERUF4aW5CU2dLTWdaTmdKQ1hNQWM",
      },
      hasSubnews: false,
    },
    {
      title: "You need to focus on your pelvic health. A doctor explains why",
      snippet:
        "We often don't think about pelvic health until something goes wrong, like pain during intercourse. Our expert explains how to spot the signs of pelvic ...",
      publisher: "CNN",
      timestamp: "1723039680000",
      newsUrl:
        "https://www.cnn.com/2024/08/07/health/pelvic-health-wellness/index.html",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNTZhV3B6ZVVKNVNXNU9jV3B6VFJDZkF4amlCU2dLTWdZSkJZd010Z1k=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNTZhV3B6ZVVKNVNXNU9jV3B6VFJDZkF4amlCU2dLTWdZSkJZd010Z1k",
      },
      hasSubnews: false,
    },
    {
      title:
        "Researchers cast doubt over benefits of new Alzheimer’s therapies",
      snippet:
        "Scientists from Cambridge University have cast doubt on the efficacy and long-term benefits of two new drugs for Alzheimer's disease, ...",
      publisher: "POLITICO Europe",
      timestamp: "1722965940000",
      newsUrl:
        "https://www.politico.eu/article/dementia-research-medicine-health-alzheimers-cambridge-lecanemab-drugs-pharmacy/",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iI0NnNW5ZMHcxTXpKV2NFZFBWVVZyVFJEVEF4aVFCU2dLTWdB=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iI0NnNW5ZMHcxTXpKV2NFZFBWVVZyVFJEVEF4aVFCU2dLTWdB",
      },
      hasSubnews: false,
    },
    {
      title: "Scientists Discover New Type of Deadly Fungus",
      snippet:
        "Scientists in Singapore say they've discovered a sixth major clade of Candida auris, an emerging and often drug-resistant fungal threat.",
      publisher: "Gizmodo",
      timestamp: "1723058164000",
      newsUrl:
        "https://gizmodo.com/scientists-discover-new-type-of-deadly-fungus-2000484248",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNUtTbE54WW5ZNFVUQkJTMmMyVFJERUF4aW1CU2dLTWdhVlk0NXVNUVk=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNUtTbE54WW5ZNFVUQkJTMmMyVFJERUF4aW1CU2dLTWdhVlk0NXVNUVk",
      },
      hasSubnews: false,
    },
    {
      title:
        "University of Utah math professor publishes model to explain cancer development",
      snippet:
        "A University of Utah professor is bringing mathematics into even more real-world applications, taking steps toward explaining cancer.",
      publisher: "KSL.com",
      timestamp: "1722946979000",
      newsUrl:
        "https://www.ksl.com/article/51087737/university-of-utah-math-professor-publishes-model-to-explain-cancer-development",
      images: {
        thumbnail:
          "https://news.google.com/api/attachments/CC8iK0NnNW9ZbTlqVG04MVRHNXNTMGxzVFJDZkF4ampCU2dLTWdZRlNJTmw0Z0k=-w280-h168-p-df-rw",
        thumbnailProxied:
          "https://i.zedtranslate.com/newsimage/CC8iK0NnNW9ZbTlqVG04MVRHNXNTMGxzVFJDZkF4ampCU2dLTWdZRlNJTmw0Z0k",
      },
      hasSubnews: false,
    },
  ],
};
import { type HealthNews } from "@/components/News/News";
import { Button } from "@/components/ui/button";
import { ScrollToTop, Loading } from "@/components/index";
import { useToast } from "@/components/ui/use-toast";
const twoDays = 2 * 24 * 60 * 60;

const News = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<HealthNews | null>(null);
  const [newsCount, setNewsCount] = useState(10);
  const [displayLoadMoreButton, setDisplayLoadMoreButton] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true);
  const handleLoadMoreButton = () => {
    setLoading(true);
    setNewsCount((prevNewsCount) => prevNewsCount + 10);
  };
  const { toast } = useToast();
  useEffect(() => {
    const fetchNews = async () => {
      const url = "https://google-news13.p.rapidapi.com/health?lr=en-US";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
          "x-rapidapi-host": "google-news13.p.rapidapi.com",
        },
      };
      try {
        const response = await fetch(url, {
          ...options,
          cache: "force-cache",
          next: { revalidate: twoDays },
        });
        const data: HealthNews = await response.json();
        if (data && data.items?.length > newsCount) {
          data.items = data.items.slice(0, newsCount);
          setNews(data);
          setDisplayLoadMoreButton(true);
        } else {
          setNews(data);
          setDisplayLoadMoreButton(false);
        }
        if (!initialFetch) {
          toast({
            variant: "default",
            title: "News Loaded",
            description: "News has been loaded successfully",
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          setDisplayLoadMoreButton(false);
        } else {
          console.error("An unknown error occurred:", error);
          setDisplayLoadMoreButton(false);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [newsCount, initialFetch, toast]);
  useEffect(() => {
    setInitialFetch(false);
    return () => setInitialFetch(true);
  }, []);
  return (
    <main id="news" className="px-4 py-8 sm:px-16 md:px-32">
      {loading && <Loading />}
      <h1 className="text-3xl md:text-5xl mb-8 md:mb-12 text-primary font-bold text-center">
        News
      </h1>
      <HoverEffect items={news?.items || projects.items} />
      {displayLoadMoreButton && (
        <div className="w-full pt-4 flex items-center justify-center">
          <Button onClick={handleLoadMoreButton}>Load More</Button>
        </div>
      )}
      <ScrollToTop />
    </main>
  );
};

export default News;
