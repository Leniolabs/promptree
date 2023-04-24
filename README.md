# Promptree

[Promptree](https://promptree.leniolabs.com?utm_source=promptree&utm_medium=banner&utm_campaign=leniolabs&utm_content=promptree_github) is a platform that combines ChatGPT conversations with git. It allows you to create a chat, branch any message you want, and create a conversation from there. You can then merge these branches and move messages from one branch to another. Also, you can merge and squash the messages of the difference into just one question and one answer.

#### Important notice

We use the OpenAI API, so this app requires every user to set up their own OpenAI API key. We do not store that API key in the database and we don't even send the API key to the backend of the app. All the requests to the OpenAI's endpoint are done by the frontend and the key is stored locally in the user's local storage.

## Getting Started

### Deployed Version

You can access the deployed version of Promptree at [promptree.leniolabs.com](https://promptree.leniolabs.com?utm_source=promptree&utm_medium=banner&utm_campaign=leniolabs&utm_content=promptree_github)

### Local Development

To run Promptree locally, follow these steps:

Clone this repository using `git clone https://github.com/Leniolabs/promptree.git`.
Install dependencies using `npm install`.
Start the development server using `npm run dev`.

## Database Configuration

In development, Promptree uses a remote database, which can be configured by setting the `DATABASE_URL` in the `.env` file. 
By default, we have the connection URL of a PostgreSQL database running on Docker. You can run it by using the command:

`docker-compose up`

or, if you are using a Mac with an M1 chip:

`docker-compose -f docker-compose.m1.yaml up` 

After the database is up and running you can push the migrations by running:

`npx prisma migrate dev`

## Tech Stack

Promptree is built with the following technologies:

- NextJS
- Prisma.io
- isomorphic-git
- memfs
- next-auth
- highlight.js
- gitgraph

`isomorphic-git` is used in conjunction with `memfs` to create a repository for every chat that you start. This repository will hold a file called `chat.json` where the JSON of the messages in the chat will be stored. Every combination of question + answer is a commit in this repository. Later, we serialize this `memfs` volume instance and save it into the database using Prisma.

`Highlight.js` is used to render the responses that OpenAI's chat API returns, formatting them in a similar way than ChatGPT does.

`gitgraph` is the library we use to calculate the Git tree.

## Contributing

We welcome contributions from the community. Any [new ideas](https://github.com/leniolabs/layoutit-grid/issues/new) on what should we implement or bug reports are welcome.

## License

Promptree is open-source software licensed under the `MIT license`(LICENSE).

## Creators
Promptree is crafted with love by [Leniolabs](https://www.leniolabs.com/services/team-augmentation/?utm_source=promptree&utm_medium=banner&utm_campaign=leniolabs&utm_content=promptree_github) and a growing community of contributors. We build digital experiences with your ideas. [Get in touch!](https://www.leniolabs.com/services/team-augmentation/?utm_source=promptree&utm_medium=banner&utm_campaign=leniolabs&utm_content=promptree_github)