import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const USER = "NexzaDev";
const HEADERS = {
   Accept: "application/vnd.github+json",
   "User-Agent": "nexza-portfolio-live-data-sync",
   ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
};

const request = async (url, options = {}) => {
   const response = await fetch(url, {
      ...options,
      headers: { ...HEADERS, ...options.headers },
      signal: AbortSignal.timeout(20_000),
   });
   if (!response.ok)
      throw new Error(`GitHub API request failed (${response.status})`);
   return response.json();
};

const day = (date) => date.toISOString().slice(0, 10);
const today = new Date();
const from = new Date(today);
from.setUTCFullYear(from.getUTCFullYear() - 1);

const query = `query($from: DateTime!, $to: DateTime!) {
  user(login: "${USER}") {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
      pullRequestContributions(first: 100) { totalCount }
    }
  }
}`;
const result = await request("https://api.github.com/graphql", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
      query,
      variables: { from: from.toISOString(), to: today.toISOString() },
   }),
});
if (result.errors?.length || !result.data?.user) {
   throw new Error("GitHub contributions query returned no user data");
}

const collection = result.data.user.contributionsCollection;
const days = collection.contributionCalendar.weeks
   .flatMap((week) => week.contributionDays)
   .map(({ date, contributionCount }) => ({
      date,
      count: contributionCount,
   }))
   .sort((a, b) => a.date.localeCompare(b.date));
let streak = 0;
let longestStreak = 0;
for (const entry of days) {
   streak = entry.count > 0 ? streak + 1 : 0;
   longestStreak = Math.max(longestStreak, streak);
}

const achievementsPath = resolve(ROOT, "data/achievements.json");
const achievements = JSON.parse(await readFile(achievementsPath, "utf8"));
achievements.coding_platform_stats = {
   github: {
      username: USER,
      url: `https://github.com/${USER}`,
      contributions: days.reduce((sum, entry) => sum + entry.count, 0),
      pull_requests: collection.pullRequestContributions.totalCount,
      longest_streak: longestStreak,
      fetched: day(today),
   },
};
await writeFile(achievementsPath, `${JSON.stringify(achievements, null, 3)}\n`);
await writeFile(
   resolve(ROOT, "data/github-contributions.json"),
   `${JSON.stringify(days, null, 3)}\n`,
);

const events = await request(
   `https://api.github.com/users/${USER}/events/public?per_page=100`,
);
const news = events
   .filter((event) =>
      ["ReleaseEvent", "PushEvent", "PullRequestEvent"].includes(event.type),
   )
   .map((event) => ({
      date: event.created_at.slice(0, 10),
      type: event.type === "ReleaseEvent" ? "launch" : "oss",
      text:
         event.type === "ReleaseEvent"
            ? "Published a public GitHub release."
            : event.type === "PullRequestEvent"
              ? "Updated public work through a GitHub pull request."
              : "Pushed updates to a public GitHub repository.",
      link: `https://github.com/${event.repo.name}`,
   }))
   .filter(
      (item, index, list) =>
         list.findIndex(
            (other) =>
               other.date === item.date &&
               other.text === item.text &&
               other.link === item.link,
         ) === index,
   )
   .slice(0, 20);
await writeFile(
   resolve(ROOT, "data/news.json"),
   `${JSON.stringify(news, null, 3)}\n`,
);
console.log(
   `Synced GitHub contributions and ${news.length} public activity items for ${USER}.`,
);
