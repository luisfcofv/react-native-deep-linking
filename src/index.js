import { Linking } from 'react-native';

const schemes = [];
let routes = [];

const fetchQueries = (expression) => {
  const regex = /:([^\/]*)/g;
  const queries = [];

  let match;
  while (match = regex.exec(expression)) {
    if (match && match[0] && match[1]) {
      queries.push(match[0]);
    }
  }

  return queries;
}

const execRegex = (queries, expression, path) => {
  let regexExpression = expression;
  queries.forEach((query) => {
    regexExpression = regexExpression.replace(query, '(.*)');
  });

  const queryRegex = new RegExp(regexExpression, 'g');
  const match = queryRegex.exec(path);

  if (match && !match[1].includes('/')) {
    let results = { path: match[0] }
    queries.forEach((query, index) => {
      const id = query.substring(1);
      results = { [id]: match[index + 1], ...results }
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
    const match = expression.exec(path);
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

export const evaluateUrl = (url) => {
  schemes.forEach((scheme) => {
    if (url.startsWith(scheme)) {
      const path = url.substring(scheme.length - 1);
      routes.forEach((route) => {
        const result = evaluateExpression(route.expression, path, scheme);
        if (result) {
          route.callback({ scheme, ...result });
        }
      });
    }
  });
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

const handleUrl = ({ url }) => {
  return Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      evaluateUrl(url); 
    }

    return Promise.resolve(supported);
  });
};

const DeepLinking = {
  addRoute,
  addScheme,
  handleUrl,
  removeRoute,
  resetRoutes,
  routes,
};

export default DeepLinking;