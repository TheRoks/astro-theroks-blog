---
publishDate: 2023-03-12T00:00:00Z
title: "Use Cloudflare to share localhost for free"
description: "Set up a tunnel locally. Follow this step-by-step guide to get your first tunnel up and running using the CLI."
excerpt: "Set up a tunnel locally. Follow this step-by-step guide to get your first tunnel up and running using the CLI."
category: Development
tags:
  - Development
  - Cloudflare
---

From time to time you'll want to share your locally running app with some folks before it's ready to ship.

* Free to use
* HTTPS support
* Won't expose your IP

## Prerequisites

Before you start [add a website to Cloudflare](https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/).

## Download and install cloudflared

When on a Mac running the following command

```bash
brew install cloudflare/cloudflare/cloudflared
```

When on Windows download the executable [here](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe) 64bit.

## Quick setup with random URL

```bash
cloudflared tunnel --url http://localhost:3000
```

Check the terminal for the public URL. This be an URL like: `https://voluntary-canal-amend-collins.trycloudflare.com`

## Use custom domain name

In some cases you want the tunnel to have a stable URL. Therefore Cloudflare offers the option to couple your domain name on which the funnel gets registered.

### Authenticate with Cloudflare

Now we can create our first tunnel by running the following command.

```bash
cloudflared tunnel login
```

This will open a browser window and prompt you to log in to your Cloudflare account. After logging in to your account, select your hostname.

### Create a tunnel and give it a name

```bash
cloudflared tunnel create mycoolapp
```

Confirm that the tunnel has been successfully created by running:

```bash
cloudflared tunnel list
```

### Start routing traffic

Now assign a CNAME record that points traffic to your tunnel subdomain.

```bash
cloudflared tunnel route dns mycoolapp demo.yourdomain.me
```

### Run the tunnel

Run the tunnel to proxy incoming traffic from the tunnel to any number of services running locally on your origin.

```bash
cloudflared tunnel --url <http://localhost:3000> run mycoolapp
```

### Check the tunnel

```bash
cloudflared tunnel info
```
