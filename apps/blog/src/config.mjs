import defaultImage from "./assets/images/default.png";

const CONFIG = {
  name: "TheRoks",

  origin: "https://theroks.com",
  basePathname: "/",
  trailingSlash: false,

  title: "TheRoks — Thoughts on Development",
  description: "🚀 Stefan Roks - Web Developer",
  defaultImage: defaultImage,

  defaultTheme: "system", // Values: "system" | "light" | "dark" | "light:only" | "dark:only"

  language: "en",
  textDirection: "ltr",

  dateFormatter: new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }),

  googleAnalyticsId: "G-MMLR0S2YX3",
  googleSiteVerificationId: "orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M",

  blog: {
    disabled: false,
    postsPerPage: 4,

    list: {
      pathname: "blog", // blog main path, you can change this to "articles" (/articles)
      noindex: true,
      disabled: false,
    },

    post: {
      permalink: "/%slug%", // Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: "category", // set empty to change from /category/some-category to /some-category
      noindex: true,
      disabled: true,
    },

    tag: {
      pathname: "tag", // set empty to change from /tag/some-tag to /some-tag
      noindex: true,
      disabled: false,
    },
  },
};

export const SITE = { ...CONFIG, blog: undefined };
export const BLOG = CONFIG.blog;
export const DATE_FORMATTER = CONFIG.dateFormatter;
