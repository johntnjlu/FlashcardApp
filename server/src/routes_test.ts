
import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {grade, list, load, resetDecksForTesting, resetScoresForTesting, save, scorelist } from './routes';


describe('routes', function() {
  it('save', function() {
    // First branch, straight line code, error case
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    const req11 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: 1n, value: "some stuff"}});
      const res11 = httpMocks.createResponse();
      save(req11, res11);
  
      assert.strictEqual(res11._getStatusCode(), 400);
      assert.deepStrictEqual(res11._getData(), 'required argument "name" was missing');


    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "value" was missing');


    // Third branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "A", value: "some stuff"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {status: "200: good"});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "B", value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {status: "200: good"});

    // Called to clear all saved decks created in this test
    //    to not effect future tests
    resetDecksForTesting();
  });

  it('grade', function() {
    // First branch, straight line code, error case
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/grade', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    grade(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    const req11 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: true}});
    const res11 = httpMocks.createResponse();
    grade(req11, res11);
  
    assert.strictEqual(res11._getStatusCode(), 400);
    assert.deepStrictEqual(res11._getData(), 'required argument "name" was missing');

    const req12 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: 1n}});
    const res12 = httpMocks.createResponse();
    grade(req12, res12);

    assert.strictEqual(res12._getStatusCode(), 400);
    assert.deepStrictEqual(res12._getData(), 'required argument "name" was missing');


    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    grade(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "deckName" was missing');

    const req21 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: "A", deckName: true}});
    const res21 = httpMocks.createResponse();
    grade(req21, res21);
  
    assert.strictEqual(res21._getStatusCode(), 400);
    assert.deepStrictEqual(res21._getData(), 'required argument "deckName" was missing');

    const req22 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: "A", deckName: 1n}});
    const res22 = httpMocks.createResponse();
    grade(req22, res22);

    assert.strictEqual(res22._getStatusCode(), 400);
    assert.deepStrictEqual(res22._getData(), 'required argument "deckName" was missing');
    
    // Third branch, straight line code, error case
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: "A", deckName: "B"}});
    const res3 = httpMocks.createResponse();
    grade(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), 'required argument "value" was missing');

    const req31 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: "A", deckName: "B", value: "p"}});
    const res31 = httpMocks.createResponse();
    grade(req31, res31);
  
    assert.strictEqual(res31._getStatusCode(), 400);
    assert.deepStrictEqual(res31._getData(), 'required argument "value" was missing');

    const req32 = httpMocks.createRequest(
        {method: 'POST', url: '/api/grade', body: {name: "A", deckName: "B", value: false}});
    const res32 = httpMocks.createResponse();
    grade(req32, res32);

    assert.strictEqual(res32._getStatusCode(), 400);
    assert.deepStrictEqual(res32._getData(), 'required argument "value" was missing');

    // Fourth branch, straight line code

    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/grade',
        body: {name: "A", deckName: "B", value: 12}});
    const res4 = httpMocks.createResponse();
    grade(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {status: "200: good"});

    const req41 = httpMocks.createRequest({method: 'POST', url: '/api/grade',
        body: {name: "B", deckName: "C", value: 83}});
    const res41 = httpMocks.createResponse();
    grade(req41, res41);

    assert.strictEqual(res41._getStatusCode(), 200);
    assert.deepStrictEqual(res41._getData(), {status: "200: good"});

    // Called to clear all saved decks created in this test
    //    to not effect future tests
    resetScoresForTesting();
  });


  it('list', function() {
    // straight line code
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp1 = httpMocks.createResponse();
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "something else", value: "file valuafeafee"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq1, saveResp1);
    save(saveReq2, saveResp2);
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list'}); 
    const res1 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    list(req1, res1);
    const decks1: Map<string, unknown> = new Map<string, unknown>();
    decks1.set('key', 'file value');
    decks1.set('something else', 'file valuafeafee');
    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getData(), Array.from(decks1.keys()));
    resetDecksForTesting();

    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "L", value: "bozo"}});
    const saveResp3 = httpMocks.createResponse();
    const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "W", value: "mans"},  query: {}});
    const saveResp4 = httpMocks.createResponse();
    save(saveReq3, saveResp3);
    save(saveReq4, saveResp4);
    const req3 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/list'}); 
    const res3 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    list(req3, res3);
    const decks2: Map<string, unknown> = new Map<string, unknown>();
    decks2.set('L', 'bozo');
    decks2.set('W', 'mans');
    // check that the request was successful
    assert.strictEqual(res3._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res3._getData(), Array.from(decks2.keys()));
    resetDecksForTesting();
  });

  it('scorelist', function() {
    // straight line code
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/api/grade',
        body: {name: "key", deckName: "deck1", value: 12}});
    const saveResp1 = httpMocks.createResponse();
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/grade',
        body: {name: "something else", deckName: "deck2", value: 75}});
    const saveResp2 = httpMocks.createResponse();
    grade(saveReq1, saveResp1);
    grade(saveReq2, saveResp2);
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/scorelist'}); 
    const res1 = httpMocks.createResponse();

    scorelist(req1, res1);
    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getData(), ["key, deck1: 12", "something else, deck2: 75"]);

    resetScoresForTesting();

    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/grade',
        body: {name: "A", deckName: "B", value: 99}});
    const saveResp3 = httpMocks.createResponse();
    const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/grade',
        body: {name: "C", deckName: "D", value: 100}});
    const saveResp4 = httpMocks.createResponse();
    grade(saveReq3, saveResp3);
    grade(saveReq4, saveResp4);
    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/scorelist'}); 
    const res3 = httpMocks.createResponse();

    scorelist(req3, res3);
    // check that the request was successful
    assert.strictEqual(res3._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res3._getData(), ["A, B: 99", "C, D: 100"]);
  });
  


  it('load', function() {
    // First branch, error case 1
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);
    // Now we can actually (mock a) request to load the transcript
    const loadReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {}});
    const loadRes1 = httpMocks.createResponse();
    load(loadReq1, loadRes1);
    // Validate that both the status code and the output is as expected
    assert.strictEqual(loadRes1._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes1._getData(), 'required argument "deckName" was missing');
    resetDecksForTesting();
    
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "otherkey", value: "other file value"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);
    // Now we can actually (mock a) request to load the transcript
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {}});
    const loadRes2 = httpMocks.createResponse();
    load(loadReq2, loadRes2);
    // Validate that both the status code and the output is as expected
    assert.strictEqual(loadRes2._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes2._getData(),'required argument "deckName" was missing');
    resetDecksForTesting();


    // Second branch, error case 2
    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "file value"}});
    const saveResp3 = httpMocks.createResponse();
    save(saveReq3, saveResp3);

    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {deckName: "hi"}});
    const loadRes3 = httpMocks.createResponse();
    load(loadReq3, loadRes3);

    assert.strictEqual(loadRes3._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes3._getData(), 'no deck previously saved with that name');
    resetDecksForTesting();
    
    const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "key", value: "value"}});
    const saveResp4 = httpMocks.createResponse();
    save(saveReq4, saveResp4);

    const loadReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {deckName: "hello"}});
    const loadRes4 = httpMocks.createResponse();
    load(loadReq4, loadRes4);

    assert.strictEqual(loadRes4._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes4._getData(), 'no deck previously saved with that name');
    resetDecksForTesting();

        
    // Third branch
    const saveReq5 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "hi", value: "file value"}});
    const saveResp5 = httpMocks.createResponse();
    save(saveReq5, saveResp5);

    const loadReq5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {deckName: "hi"}});
    const loadRes5 = httpMocks.createResponse();
    load(loadReq5, loadRes5);

    assert.strictEqual(loadRes5._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes5._getData(), 'file value');
    resetDecksForTesting();
    
    const saveReq6 = httpMocks.createRequest({method: 'POST', url: '/api/save',
        body: {name: "hello", value: "success!"}});
    const saveResp6 = httpMocks.createResponse();
    save(saveReq6, saveResp6);

    const loadReq6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {deckName: "hello"}});
    const loadRes6 = httpMocks.createResponse();
    load(loadReq6, loadRes6);

    assert.strictEqual(loadRes6._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes6._getData(), 'success!');
    resetDecksForTesting();
  });

  // TODO: add tests for your routes
});


