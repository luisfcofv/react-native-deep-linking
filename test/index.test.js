import DeepLinking, { evaluateUrl } from '../src';

describe('DeepLinking', () => {
  const articleRoute = {
    expression: 'domain://article',
    callback: () => {},
  };

  const musicRoute = {
    expression: 'domain://music',
    callback: () => {},
  };
  
  afterEach(() => {
    DeepLinking.resetRoutes();
  });

  test('addRoute', () => {
    expect(DeepLinking.routes).toEqual([]);

    DeepLinking.addRoute(articleRoute.expression, articleRoute.callback);
    expect(DeepLinking.routes).toEqual([articleRoute]);

    DeepLinking.addRoute(musicRoute.expression, musicRoute.callback);
    expect(DeepLinking.routes).toEqual([articleRoute, musicRoute]);
  });

  test('removeRoute', () => {
    expect(DeepLinking.routes).toEqual([]);

    DeepLinking.addRoute(articleRoute.expression, articleRoute.callback);
    DeepLinking.addRoute(musicRoute.expression, musicRoute.callback);
    expect(DeepLinking.routes).toEqual([articleRoute, musicRoute]);

    DeepLinking.removeRoute(articleRoute.expression);
    expect(DeepLinking.routes).toEqual([musicRoute]);
  });

  test('resetRoutes', () => {
    expect(DeepLinking.routes).toEqual([]);

    DeepLinking.addRoute(articleRoute.expression, articleRoute.callback);
    DeepLinking.addRoute(musicRoute.expression, musicRoute.callback);
    expect(DeepLinking.routes).toEqual([articleRoute, musicRoute]);

    DeepLinking.resetRoutes();
    expect(DeepLinking.routes).toEqual([]);
  });
});

describe('Routes', () => {
  DeepLinking.addScheme('domain://');

  afterEach(() => {
    DeepLinking.resetRoutes();
  });

  test('domain://music', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/music', result => {
      const { path, scheme } = result;
      expect(path).toEqual('/music');
      expect(scheme).toEqual('domain://');
      urlEvaluated = true;
    });

    evaluateUrl('domain://music');
    expect(urlEvaluated).toEqual(true);
  });

  test('domain://music/:id', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/music/:id', result => {
      const { path, scheme, id } = result;
      expect(path).toEqual('/music/123');
      expect(scheme).toEqual('domain://');
      expect(id).toEqual('123');
      urlEvaluated = true;
    });

    evaluateUrl('domain://music/123');
    expect(urlEvaluated).toEqual(true);
  });

  test('domain://music/:name/', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/music/:name/', result => {
      const { path, scheme, name } = result;
      expect(path).toEqual('/music/abcd/');
      expect(scheme).toEqual('domain://');
      expect(name).toEqual('abcd');
      urlEvaluated = true;
    });

    evaluateUrl('domain://music/abcd/');
    expect(urlEvaluated).toEqual(true);
  });

  test('domain://music/:name/details/:id', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/music/:name/details/:id', result => {
      const { path, scheme, name, id } = result;
      expect(path).toEqual('/music/test/details/12');
      expect(scheme).toEqual('domain://');
      expect(name).toEqual('test');
      expect(id).toEqual('12');
      urlEvaluated = true;
    });

    evaluateUrl('domain://music/test/details/12');
    expect(urlEvaluated).toEqual(true);
  });

  test('domain://:id', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/:id', result => {
      const { path, scheme, id } = result;
      expect(path).toEqual('/100');
      expect(scheme).toEqual('domain://');
      expect(id).toEqual('100');
      urlEvaluated = true;
    });

    evaluateUrl('domain://100');
    expect(urlEvaluated).toEqual(true);
  });

  test('domain://:id1/:id2/:id3/:id4', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/:id1/:id2/:id3/:id4', result => {
      const { path, scheme, id1, id2, id3, id4 } = result;
      expect(path).toEqual('/1/2/3/4');
      expect(scheme).toEqual('domain://');
      expect(id1).toEqual('1');
      expect(id2).toEqual('2');
      expect(id3).toEqual('3');
      expect(id4).toEqual('4');
      urlEvaluated = true;
    });

    evaluateUrl('domain://1/2/3/4');
    expect(urlEvaluated).toEqual(true);
  });

  test('regex domain://music/(.*)\/details/', () => {
    let urlEvaluated = false;
    const regex = /\/music\/(.*)\/details/g;
    DeepLinking.addRoute(regex, result => {
      const { path, scheme, match } = result;
      expect(path).toEqual('/music/123/details');
      expect(scheme).toEqual('domain://');
      expect(match).toBeTruthy();
      expect(match[1]).toEqual('123');
      urlEvaluated = true;
    });

    evaluateUrl('domain://music/123/details');
    expect(urlEvaluated).toEqual(true);
  });
});
