const path = require("path");
const chance = require("chance").Chance();

const given = require("../../steps/given");
const when = require("../../steps/when");

describe("TimelinePage.tweets.request template", () => {
  it("Should return empty array if source.tweets is empty", () => {
    const templatePath = path.resolve(
      __dirname,
      "../../../mapping-templates/TimelinePage.tweets.request.vtl"
    );

    const username = chance.guid();

    const context = given.an_appsync_context(
      { username },
      {},
      {},
      { tweets: [] }
    );
    const result = when.we_invoke_an_appsync_template(templatePath, context);

    expect(result).toEqual([]);
  });

  it("Should convert timeline tweets to BatchGetItem keys", () => {
    const templatePath = path.resolve(
      __dirname,
      "../../../mapping-templates/TimelinePage.tweets.request.vtl"
    );

    const username = chance.guid();
    const tweetId = chance.guid();
    const tweets = [
      {
        userId: username,
        tweetId,
      },
    ];

    const context = given.an_appsync_context({ username }, {}, {}, { tweets });
    const result = when.we_invoke_an_appsync_template(templatePath, context);

    expect(result).toEqual({
      version: "2018-05-29",
      operation: "BatchGetItem",
      tables: {
        "appsync-masterclass-backend-dev-TweetsTable-358VLE3XQP1F": {
          keys: [
            {
              id: {
                S: tweetId,
              },
            },
          ],
          consistentRead: false,
        },
      },
    });
  });
});
