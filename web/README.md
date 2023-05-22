# Kanbad Web

React, Next.js, and TypeScript front-end that includes:

- Creating new workspaces and storing their UUIDs in local storage
- Creating & removing boards
- Creating, editing, and removing cards
- Reordering boards in a workspace
- Reordering cards or moving between boards

Board and card Drag & Drop is implemented using the base HTML5 drag events API,
rather than any React-specific d&d library, primarily because implementing from scratch
(1) is a better learning opportunity, and (2) offers more opportunity for customizing
events and the types of draggable elements & behavior on drop.

## Getting Started

With the [API](../api/README.md) running and `node` (v18 LTS) installed:

```bash
$ cd <project-root>/web

# Install dependencies
$ npm i

# Create the `.env.local` file to communicate with back-end API.
#
# NOTE: This MUST BE `127.0.0.1` instead of `locahost`; otherwise
# `node-fetch` will not work properly in `getServerSideProps` calls.
$ echo 'NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api' > .env.local

# Run the development server
$ npm run dev
```

Now visit [http://localhost:3000](http://localhost:3000) in your browser of choice (preferably Firefox) to behold the most basic of kanban apps, and feel free to file [issues or suggestions](https://github.com/kevlarr/kanbad/issues)!
