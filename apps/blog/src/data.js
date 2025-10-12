import { getAsset } from "./utils/permalinks";

export const headerData = {
  links: [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Sitecore",
      href: "/tag/sitecore",
    },
    {
      text: "About me",
      href: "/about",
    },
  ],
  actions: [],
};

export const footerData = {
  links: [],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: "Twitter", icon: "tabler:brand-x", href: "https://x.com/theroks" },
    {
      ariaLabel: "StackOverflow",
      icon: "tabler:brand-stackoverflow",
      href: "https://stackoverflow.com/users/12258906/stefan-roks",
    },
    { ariaLabel: "LinkedIn", icon: "tabler:brand-linkedin", href: "https://www.linkedin.com/in/stefan-roks-82a3aa4/" },
    { ariaLabel: "RSS", icon: "tabler:rss", href: getAsset("/rss.xml") },
    { ariaLabel: "Github", icon: "tabler:brand-github", href: "https://github.com/theroks" },
  ],
  footNote: ``,
};
