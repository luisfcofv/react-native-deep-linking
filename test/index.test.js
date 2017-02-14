import DeepLinking from '../index';

describe('DeepLinking', () => {
  DeepLinking.addScheme('domain://');

  test('domain://music', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/music', result => {
      const { path, scheme } = result;
      expect(path).toEqual('/music');
      expect(scheme).toEqual('domain://');
      urlEvaluated = true;
    });

    DeepLinking.evaluateUrl('domain://music');
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

    DeepLinking.evaluateUrl('domain://music/123');
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

    DeepLinking.evaluateUrl('domain://music/abcd/');
    expect(urlEvaluated).toEqual(true);
  });

  test('domain://music/:id/details/long/path', () => {
    let urlEvaluated = false;
    DeepLinking.addRoute('/music/:id/details/long/path', result => {
      const { path, scheme, id } = result;
      expect(path).toEqual('/music/900/long/path');
      expect(scheme).toEqual('domain://');
      expect(id).toEqual('900');
      urlEvaluated = true;
    });

    DeepLinking.evaluateUrl('domain://music/900/details/long/path');
    expect(urlEvaluated).toEqual(true);
  });

  // test('domain://:id', () => {
  //   DeepLinking.addRoute('/:id', result => {
  //     const { path, scheme, query } = result;
  //     expect(path).toEqual('/100');
  //     expect(scheme).toEqual('mydomain://');
  //     expect(query).toEqual('100');
  //   });

  //   DeepLinking.evaluateUrl('mydomain://100');
  // });

  //  test('domain://:id/details', () => {
  //   DeepLinking.addRoute('/:id/details', result => {
  //     const { path, scheme, query } = result;
  //     expect(path).toEqual('/20/details');
  //     expect(scheme).toEqual('mydomain://');
  //     expect(query).toEqual('20');
  //   });

  //   DeepLinking.evaluateUrl('mydomain://20/details');
  // });

  // test('regex domain:\/\/music\/(.*)\/.*', () => {
  //   DeepLinking.addRoute('domain:\/\/music\/(.*)\/.*', result => {
  //     console.log(result);
  //   });
  //   DeepLinking.evaluateUrl('domain://music/123/details');
  // });
});
