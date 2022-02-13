const users = {};

// responds with json obj (GET)
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// responds without json obj (HEAD)
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addUser = (request, response, data) => {
  let responseJSON;
  // invalid data
  if (!data.name || !data.age) {
    responseJSON = {
      message: 'Name and age are both required.',
      id: 'addUserMissingParams',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  // update existing user
  if (users[data.name]) {
    users[data.name].age = data.age;
    return respondJSONMeta(request, response, 204);
  }
  // create new user
  users[data.name] = { name: data.name, age: data.age };
  responseJSON = {
    message: 'Created Successfully.',
  };
  return respondJSON(request, response, 201, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
};
