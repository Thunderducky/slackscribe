# SlackScribe
## Record your links from slack in all publicly posted channels

### Local Setup
1. Make a .env file, follow the example of .env.example with your credentials
2. Run `node scripts/generateInitialiInvite.js`, you should now have made an invite that you can claim from the database.
Make sure you write down your invite code
3. Run `npm install` and `node server.js` and go to the `/claim` page, and claim your account using the invite code you generated
4. You can now use POST requests to /api/auth/login to retrieve your JWT which you can attach to any web requsts you make
for information

### Slack Setup
WIP


### Endpoints
#### /api/events
optional parameters - `start` and `stop` both are unix timestamps
these parameters can limit your search to events that happened between the two times
example `/api/events?start=1544632985961&stop=1544892185961`

Would search for slack events between
- Sat Dec 15 2018 10:43:05 GMT-0600
- Sat Dec 15 2018 10:43:05 GMT-0600

### Example Consumer Apps
[scribe-link-grabber](https://github.com/Thunderducky/scribe-link-grabber)

