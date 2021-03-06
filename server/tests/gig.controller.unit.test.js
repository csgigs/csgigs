global.fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", global.fetch);

const gigController = require("../controllers/gig.controller");
const mockRes = require("jest-mock-express").response;

const GigsMock = require("../models/gig.model");

const app = {
  locals: { apiAuth: {} }
};

const createMongoSaveMock = user_admins => {
  jest.spyOn(GigsMock.prototype, "save").mockImplementationOnce(() =>
    Promise.resolve({
      _id: "1",
      name: "test",
      user_admins
    })
  );
};

const createMongoFindByIdAndUpdateMock = () => {
  jest
    .spyOn(GigsMock, "findByIdAndUpdate")
    .mockImplementationOnce(() => Promise.resolve());
};

const createMongoFindByIdAndRemoveMock = _id => {
  jest
    .spyOn(GigsMock, "findByIdAndRemove")
    .mockImplementationOnce(() => Promise.resolve({ _id }));
};

const createMongoSaveResolveWith = result => {
  jest
    .spyOn(GigsMock.prototype, "save")
    .mockImplementationOnce(() => Promise.resolve(result));
};

const createMongoSaveRejectWith = result => {
  jest
    .spyOn(GigsMock.prototype, "save")
    .mockImplementationOnce(() => Promise.reject(result));
};

const createGroupResponse = () => {
  return {
    group: {
      _id: "NtR6RQ7NvzA9ejecX",
      name: "testing",
      t: "p",
      usernames: ["tester"],
      msgs: 0,
      u: {
        _id: "aobEdbYhXfu5hkeqG",
        username: "tester"
      },
      ts: "2016-12-09T16:53:06.761Z",
      ro: false,
      sysMes: true,
      _updatedAt: "2016-12-09T16:53:06.761Z"
    },
    success: true
  };
};

const createRequest = (user_admins, owner = { _id: "owner1" }) => {
  return {
    app,
    headers: {},
    body: {
      name: "testgig",
      user_admins: user_admins || [],
      owner: owner,
      points_budget: 500,
      createdBy: { _id: "1234", name: "testAuthor" }
    }
  };
};

const createRequestWithBody = body => {
  return {
    app,
    headers: {},
    body
  };
};

const createUsers = names => {
  return names.map((name, i) => {
    return { _id: `id${++i}`, name };
  });
};

describe("Gig Controller", () => {
  let res;
  beforeEach(() => {
    res = mockRes();
    global.fetch.resetMocks();
    jest.clearAllMocks();
  });

  describe("create gig: failure", () => {
    it("should return an error if unable to create a gig", async () => {
      createMongoSaveResolveWith(null);
      await gigController.create_gig(createRequest(["bob"]), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "Error encountered while creating gig: testgig"
      });
    });

    it("should return an error if the gig already exists", async () => {
      createMongoSaveRejectWith({
        error: {
          driver: true,
          name: "MongoError",
          index: 0,
          code: 11000,
          errmsg:
            'E11000 duplicate key error collection: csgigs-admin.gigs index: name_1 dup key: { : "RowanTest1" }'
        }
      });
      await gigController.create_gig(createRequest(["bob"]), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "The gig testgig already exists. Please try another name."
      });
    });

    it("should return an error if unable create a rc group", async () => {
      createMongoSaveMock(createUsers(["bob"]));
      createMongoFindByIdAndRemoveMock("1");

      global.fetch.mockResponse(JSON.stringify({ success: false }));

      await gigController.create_gig(createRequest(["bob"]), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "Unable to create group test in RC"
      });
    });

    it("should return an error if there were no admins specified", async () => {
      createMongoSaveMock(createUsers(["bob", "frank", "jill"]));

      global.fetch.mockResponse(JSON.stringify({ success: true }));

      await gigController.create_gig(createRequest(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "No admin specified for testgig"
      });
    });

    it("should return an error if there were no owner specified", async () => {
      createMongoSaveMock(createUsers(["bob", "frank", "jill"]));

      global.fetch.mockResponse(JSON.stringify({ success: true }));

      await gigController.create_gig(createRequest(["admin1"], null), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "No owner specified for testgig"
      });
    });

    it("should return an error if unable add a user as an owner of a group", async () => {
      const user_admins = createUsers(["bob", "frank", "jill"]);
      createMongoSaveMock(user_admins);

      global.fetch.mockResponseOnce(JSON.stringify(createGroupResponse()));

      // for each user
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      global.fetch.mockResponseOnce(JSON.stringify({ success: false }));
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));

      await gigController.create_gig(createRequest(user_admins), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "Unable to add user frank as an owner of group testgig"
      });
    });

    it("should return an error if adding the channel ID to the gig in mongo", async () => {
      const user_admins = createUsers(["bob"]);
      createMongoSaveMock(user_admins);

      jest
        .spyOn(GigsMock, "findByIdAndUpdate")
        .mockImplementationOnce(() => Promise.reject("Could not find it"));

      // RC API create group
      global.fetch.mockResponseOnce(JSON.stringify(createGroupResponse()));
      // RC API add users as group owners
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));

      await gigController.create_gig(createRequest(user_admins), res, x =>
        Promise.resolve(x)
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "Could not find it"
      });
    });

    it("should return error message if publish broadcast messsage fails", async () => {
      jest
        .spyOn(GigsMock, "findByIdAndUpdate")
        .mockImplementationOnce(() => Promise.resolve());

      const user_admins = createUsers(["bob"]);
      createMongoSaveMock(user_admins);
      // RC API create group
      global.fetch.mockResponseOnce(JSON.stringify(createGroupResponse()));
      // RC API make user as group owner
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      // RC API to post message
      global.fetch.mockResponseOnce(JSON.stringify({ success: false }));

      await gigController.create_gig(createRequest(user_admins), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "Unable to publish broadcast message for test"
      });
    });
  });

  describe("create gig: success", () => {
    it("should successfully create gigs", async () => {
      createMongoFindByIdAndUpdateMock();

      const user_admins = createUsers(["bob"]);
      createMongoSaveMock(user_admins);
      // RC API create group
      global.fetch.mockResponseOnce(JSON.stringify(createGroupResponse()));
      // RC API make user as group owner
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      // RC API to post message
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));

      await gigController.create_gig(createRequest(user_admins), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        gig: { _id: "1", name: "test" }
      });
    });

    xit("created gig should be returned with expected properties", async () => {
      const user_admins = createUsers(["bob"]);
      const body = {
        name: "ポケモンサファリ＠台南",
        points_budget: 100,
        status: "NOT STARTED",
        user_admins
      };

      createMongoFindByIdAndUpdateMock();
      createMongoSaveResolveWith({ name: body.name, user_admins });
      // RC API create group
      global.fetch.mockResponseOnce(JSON.stringify(createGroupResponse()));
      // RC API make user as group owner
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      // RC API to post message
      global.fetch.mockResponseOnce(JSON.stringify({ success: true }));
      // const request = test_util.createHttpMockRequest(body, {}, "POST");

      // const response = httpMocks.createResponse();

      await gigController.create_gig(createRequestWithBody(body), res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        gig: { _id: "1", name: "ポケモンサファリ＠台南", user_admins }
      });
      // expect(responseData.gig.name).toBe("ポケモンサファリ＠台南");
      // expect(responseData.gig.user_admins.length).toBe(0);
      // expect(responseData.gig.user_participants.length).toBe(0);
      // expect(responseData.gig.user_attendees.length).toBe(0);
    });
  });
});
