const schemes = [];
const routes = [];

const fetchQueries = (expression) => {
  const regex = /:([^/]*)/g;
  const queries = [];

  let match = regex.exec(expression);
  while (match) {
    if (match && match[0] && match[1]) {
      queries.push(match[0]);
    }

    match = regex.exec(expression);
  }

  return queries;
};

const execRegex = (queries, expression, path) => {
  let regexExpression = expression;
  queries.forEach((query) => {
    regexExpression = regexExpression.replace(query, '(.*)');
  });

  const queryRegex = new RegExp(regexExpression, 'g');
  const match = queryRegex.exec(path);

  if (match && !match[1].includes('/')) {
    let results = { path: match[0] };
    queries.forEach((query, index) => {
      const id = query.substring(1);
      results = { [id]: match[index + 1], ...results };
    });

    return results;
  }

  return false;
};

const evaluateExpression = (expression, path, scheme) => {
  if (expression === path) {
    return { scheme, path };
  }

  try {
    const regex = expression;
    const match = regex.exec(path);
    regex.lastIndex = 0;
    if (match) {
      return { scheme, path, match };
    }
  } catch (e) {
    // Error, expression is not regex
  }

  if (typeof expression === 'string' && expression.includes(':')) {
    const queries = fetchQueries(expression);
    if (queries.length) {
      return execRegex(queries, expression, path);
    }
  }

  return false;
};

const evaluateUrl = (url) => {
  let solved = false;
  schemes.forEach((scheme) => {
    if (url.startsWith(scheme)) {
      const path = url.substring(scheme.length - 1);
      routes.forEach((route) => {
        const result = evaluateExpression(route.expression, path, scheme);
        if (result) {
          solved = true;
          route.callback({ scheme, ...result });
        }
      });
    }
  });

  return solved;
};

const addRoute = (expression, callback) => {
  routes.push({ expression, callback });
};

const removeRoute = (expression) => {
  const index = routes.findIndex(route => route.expression === expression);
  routes.splice(index, 1);
};

const resetRoutes = () => {
  routes.splice(0, routes.length);
};

const addScheme = (scheme) => {
  schemes.push(scheme);
};

const DeepLinking = {
  addRoute,
  addScheme,
  evaluateUrl,
  removeRoute,
  resetRoutes,
  routes,
};

export default DeepLinking;
