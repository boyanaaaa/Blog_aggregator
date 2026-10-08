import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const items: RSSItem[] = [];
  const res = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!res.ok) {
    throw new Error("Please write the correct URL!");
  }

  const xmlString = await res.text();

  const parser = new XMLParser({
    processEntities: false,
  });

  const result = parser.parse(xmlString);

  const channel = result.rss.channel;
  let title = "";
  let link = "";
  let description = "";

  if (channel) {
    if (!channel.title || !channel.link || !channel.description) {
      throw new Error("Missing fields.");
    }

    title = channel.title;
    link = channel.link;
    description = channel.description;
  } else {
    throw new Error("No channel.");
  }

  let rawItems: any[] = [];

  if (Array.isArray(channel.item)) {
    rawItems = channel.item;
  } else if (channel.item) {
    rawItems = [channel.item];
  }

  for (const item of rawItems) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    items.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }
  const feed: RSSFeed = {
    channel: {
      title: title,
      link: link,
      description: description,
      item: items,
    },
  };
  return feed;
}
