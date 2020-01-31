const chai = require("chai");
const fs = require('fs');
const { 
  omit, 
  constructEdges, 
  exportJSON, 
  separatePoint 
} = require('../utils');
const {
  GRAPH_NAME,
  NODES_DOCUMENT_NAME,
  EDGES_DOCUMENT_NAME
} = require('../config');

const { expect, assert } = chai;

describe('utils/omit - removes a key from given object', () => {
  it('throws when given empty object', () => {
    assert.throws(() => omit({}), Error, "Omit function expects not empty object!");
  });
  it('throws when given a non-object', () => {
    assert.throws(() => omit({}), Error);
  });
  it('returns object without given key', () => {
    const obj = {
      key1: 'test1',
      omitKey: 'gonna be deleted',
    };
    const omitKey = 'omitKey';
    const actual = omit(obj, omitKey);
    expect(actual).to.not.have.key(omitKey);
  });
});

describe('utils/exportJSON - exports given JSON to given path', () => {
  it('should write file to given path', done => {
    const path = 'test/test.json';
    const json = {
      mocha: 'chai',
    };
    exportJSON(json, path).then(val => {
      expect(val).to.true;
      const readFile = fs.readFileSync(path);
      expect(JSON.parse(readFile)).to.eql((json));
      done()
    }).catch(err => {
      console.error(err);
    });
  })
});

describe('utils/constructEdges - given a navigation object it must construct an edge array', () => {
  const dummyData = require('./testpoint.json').navigation;
  const dummyId = require('./testpoint.json').id;
  it('should throw an error when navigation is not an object', () => {
    assert.throws(() => constructEdges("123"), Error, `"navigation" parameter must be an object.`);
    assert.throws(() => constructEdges(123), Error, `"navigation" parameter must be an object.`);
  });
  it('should throw an error when navigation object does not have segments property', () => {
    const obj = {
      randomKey: 1
    };
    assert.throws(() => constructEdges(obj), Error);
  });
  it('should throw an error when pointId is empty/null/undefined', () => {
    assert.throws(() => constructEdges(dummyData), Error);
  });
  it('should return edges array when given correct argumenst', () => {
    const expected = [{
      _from: `${NODES_DOCUMENT_NAME}/${dummyId}`,
      _to: `${NODES_DOCUMENT_NAME}/${dummyData.segments[0].id}`,
      weight: dummyData.segments[0].weight,
      mapWeight: dummyData.segments[0].mapWeight,
    }]
    const actual = constructEdges(dummyData, dummyId);
    expect(actual).to.eql(expected);
  });
});

describe('utils/separatePoint - given a point it should return node object and edges array', () => {
  it('should throw when point does not contain navigation property', () => {
    const dummy = (require('./testpoint.json'), 'navigation');
    assert.throws(() => separatePoint(dummy), Error);
  });
  it('should throw when point is not an object', () => {
    const dummy = 123;
    assert.throws(() => separatePoint(dummy), Error);
  });
  it('should have an empty edges array when navigation.segments is empty', () => {
    const dummy = require('./testpoint.json');
    dummy.navigation.segments = [];
    expect(separatePoint(dummy).edges).to.be.empty;
  });
  it('should return node with "properties" property', () => {
    const dummy = require('./testpoint.json');
    expect(separatePoint(dummy).node).to.contain.keys('properties');
  });
})