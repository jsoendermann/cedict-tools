/// <reference path="../node_modules/@types/jest/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />

describe('CedictTools', () => {
  const { Charset, CedictTools } = require('../CedictTools');

  beforeAll(() => {
    CedictTools.initialize();
  });

  it('should determine the charset of Chinese text', () => {
    expect(CedictTools.getCharset('哈罗你好嘛？')).toEqual('simplified');
    expect(CedictTools.getCharset('哈囉你好嗎？')).toEqual('traditional');
    expect(CedictTools.getCharset('')).toEqual('traditional');
    expect(CedictTools.getCharset('？')).toEqual('traditional');
    expect(CedictTools.getCharset('好孩子')).toEqual('traditional');
  });

  it('should get records for words', () => {
    expect(CedictTools.getRecordsForWord('只', 'simplified').length).toEqual(5);
    expect(CedictTools.getRecordsForWord('只', 'traditional').length).toEqual(1);
    expect(CedictTools.getRecordsForWord('小籠包', 'simplified')).toEqual(null);
    expect(CedictTools.getRecordsForWord('小笼包', 'traditional')).toEqual(null);
    expect(CedictTools.getRecordsForWord('小笼包', 'simplified')).toEqual([
      {
        "english": "/steamed dumpling/",
        "pinyin": "xiao3 long2 bao1",
        "simp": "小笼包",
        "trad": "小籠包",
      }
    ]);
  });

  it('should get records for word at index', () => {
    expect(CedictTools.getRecordsForWorddAtIndex('好，好', 1, 'simplified')).toEqual(null);
    expect(CedictTools.getRecordsForWorddAtIndex('好，好', 0, 'simplified')).toEqual([
      {
        "english": "/good/well/proper/good to/easy to/very/so/(suffix indicating completion or readiness)/(of two people) close/on intimate terms/",
        "pinyin": "hao3",
        "simp": "好",
        "trad": "好",
      },
      {
        "english": "/to be fond of/to have a tendency to/to be prone to/",
        "pinyin": "hao4",
        "simp": "好",
        "trad": "好",
      },
    ]);
    expect(CedictTools.getRecordsForWorddAtIndex('好，好', 0, 'traditional')).toEqual([
      {
        "english": "/good/well/proper/good to/easy to/very/so/(suffix indicating completion or readiness)/(of two people) close/on intimate terms/",
        "pinyin": "hao3",
        "simp": "好",
        "trad": "好",
      },
      {
        "english": "/to be fond of/to have a tendency to/to be prone to/",
        "pinyin": "hao4",
        "simp": "好",
        "trad": "好",
      },
    ]);
    expect(CedictTools.getRecordsForWorddAtIndex('哈罗你好吗？', 2, 'simplified')).toEqual([
      {
        "english": "/Hello!/Hi!/How are you?/",
        "pinyin": "ni3 hao3",
        "simp": "你好",
        "trad": "你好",
      },
    ]);
    expect(CedictTools.getRecordsForWorddAtIndex('哈罗你好吗？', 3, 'simplified')).toEqual([
      {
        "english": "/Hello!/Hi!/How are you?/",
        "pinyin": "ni3 hao3",
        "simp": "你好",
        "trad": "你好",
      },
    ]);
  });
});
