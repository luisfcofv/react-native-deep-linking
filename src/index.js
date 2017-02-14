import { Linking } from 'react-native';

const schemes = [];
const routes = [];

const evaluateRegex = (expression, path, query) => {
  const regexString = expression.replace(query, '(.*)');
  const regex = new RegExp(regexString, 'g');
  const match = regex.exec(path);

  if (match) {
    const regexPath = match[0];
    const regexQuery = match[1];
    if (regexPath === path && regexQuery && !regexQuery.includes('/')) {
      const id = query.replace(':', '');
      return { path, [id]: match[1] };
    }
  }

  return false;
};

const evaluateRouteWithPath = (expression, path) => {
  // "/path/:id/other"
  const match = /.*\/(:.*)\/.*/g.exec(expression);

  if (match && match[1]) {
    return evaluateRegex(expression, path, match[1]);
  }

  return false;
};

const evaluateRoute = (expression, path) => {
  // "/path/:id"
  const index = expression.lastIndexOf(':');
  const query = expression.substring(index);

  if (!query.includes('/')) {
    return evaluateRegex(expression, path, query);
  }

  return false;
};

const evaluateExpression = (expression, path, scheme) => {
  if (expression === path) {
    return { scheme, path };
  }

  try {
    const match = expression.exec(path);
    if (match && match[1]) {
      return { scheme, path, match };
    }
  } catch (e) {
    // Error, expression is not regex
  }

  if (typeof expression === 'string' && expression.includes(':')) {
     // "/path/:id" || "/path/:id/*"
     console.log(expression);
    return evaluateRoute(expression, path) || evaluateRouteWithPath(expression, path);
  }

  return false;
};

const evaluateUrl = (url) => {
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

const addScheme = (scheme) => {
  schemes.push(scheme);
};

const handleUrl = ({ url }) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      evaluateUrl(url);
    }
  });
};

const DeepLinking = { handleUrl, addRoute, addScheme, evaluateUrl };
export default DeepLinking;