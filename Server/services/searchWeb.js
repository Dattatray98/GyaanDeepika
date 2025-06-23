const axios = require('axios');

const BING_API_KEY = process.env.BING_SEARCH_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;


async function searchWithBing(question) {
  if (!BING_API_KEY) {
    console.warn("⚠️ No Bing API key provided. Skipping Bing search.");
    return null;
  }

  try {
    const response = await axios.get("https://api.bing.microsoft.com/v7.0/search", {
      headers: {
        "Ocp-Apim-Subscription-Key": BING_API_KEY,
      },
      params: {
        q: question,
        count: 3,
      },
    });

    const webPages = response.data.webPages?.value || [];
    return webPages.map(item => ({
      title: item.name,
      snippet: item.snippet,
      url: item.url,
    }));
  } catch (error) {
    console.warn("❌ Bing search failed:", error.message);
    return null;
  }
}


async function searchWithGoogle(question) {
  if (!SERP_API_KEY) {
    console.warn("⚠️ No SerpAPI key provided. Cannot perform Google search.");
    return [];
  }

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: question,
        engine: "google",
        api_key: SERP_API_KEY,
      },
    });

    const results = response.data.organic_results || [];
    return results.slice(0, 3).map(item => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
    }));
  } catch (error) {
    console.error("❌ Google search failed:", error.message);
    return [];
  }
}


async function searchWeb(question) {
  let results = await searchWithBing(question);
  if (results && results.length > 0) return results;

  console.warn("⚠️ Falling back to Google search...");
  results = await searchWithGoogle(question);
  return results;
}

module.exports = searchWeb;
