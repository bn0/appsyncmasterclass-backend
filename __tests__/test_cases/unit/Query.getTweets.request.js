const path = require("path");
const chance = require("chance").Chance();

const given = require("../../steps/given");
const when = require("../../steps/when");

describe("Query.getTweets.request template", () => {
  it("Should error if limit is over 25", () => {
    const templatePath = path.resolve(
      __dirname,
      "../../../mapping-templates/Query.getTweets.request.vtl"
    );

    const username = chance.guid();
    const resultLimit = 25;

    const context = given.an_appsync_context(
      { username },
      { userId: username, limit: resultLimit + 1, nextToken: null }
    );
    expect(() =>
      when.we_invoke_an_appsync_template(templatePath, context)
    ).toThrowError("Maximum limit is 25");
  });
});
