# Members' Reputation Bot

This Telegram bot is designed to track and enhance chat members' reputation when other participants express gratitude or respect. The bot automatically responds to specific words and phrases, increasing the reputation of the member being replied to. \
This bot is built using **Next.js**, **NestJS** and **Prisma**.
It utilizes a database for storing and managing member reputations.

## Main Features

1. **Welcoming New Members:** Upon a new member joining the chat, the bot greets them.
2. **Reputation Tracking:** The bot keeps track of how often other members thank or express respect to a member using specific words or phrases.
3. **Reputation Removal:** If a member leaves the chat, their reputation is removed.
4. **Sending Reputation Messages:** When a member's reputation increases, the bot sends a message informing the member of their current reputation status.
5. **Link to Statistics Website:** Within the reputation message, a link is provided to a website where one can view the reputation statistics of all members.

## How to Use

1. Add the bot to your Telegram chat.
2. Whenever you want to thank or show respect to a member, simply reply to their message with one of the gratitude or respect words, and that member's reputation will automatically increase.
3. To view overall reputation statistics, click on the link provided in the reputation message.
