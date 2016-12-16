import { SegmentingTrie } from 'segmenting-trie';
import * as fs from 'fs';
import * as _ from 'lodash';

export type Charset = 'simplified' | 'traditional';
export interface CedictRecord {
  trad: string;
  simp: string;
  pinyin: string;
  english: string;
}

export namespace CedictTools {
  let simpTrie: SegmentingTrie;
  let tradTrie: SegmentingTrie;

  let simpRecords: { [simp: string]: CedictRecord[] };
  let tradRecords: { [trad: string]: CedictRecord[] };

  let hasBeenInitialized = false;

  // TODO Load file asynchronously
  export const initialize = (): void => {
    if (hasBeenInitialized) {
      return;
    }

    const cedictRecords: CedictRecord[] = fs.readFileSync('./cedict_ts.u8', 'utf8')
      .split('\r\n')
      .filter((line: string) => line[0] !== '#' && line.length > 0)
      .map((line: string) => {
        const match = /^(.*?) (.*?) \[(.*?)\] (.*?)$/.exec(line) as RegExpExecArray;

        return {
          trad: match[1],
          simp: match[2],
          pinyin: match[3],
          english: match[4],
        };
      });

    simpRecords = _.groupBy(cedictRecords, r => r.simp);
    tradRecords = _.groupBy(cedictRecords, r => r.trad);

    simpTrie = new SegmentingTrie(Object.keys(simpRecords));
    tradTrie = new SegmentingTrie(Object.keys(tradRecords));

    hasBeenInitialized = true;
  }

  export const getCharset = (text: string): Charset => {
    let c = 0;

    while (c < text.length) {
      const tradMatch = tradTrie.getFirstWordInText(text.slice(c));
      const tradMatchLength = tradMatch ? tradMatch.length : 1;
      const simpMatch = simpTrie.getFirstWordInText(text.slice(c));
      const simpMatchLength = simpMatch ? simpMatch.length : 1;

      if (tradMatchLength < simpMatchLength) {
        return 'simplified'; 
      } else if (tradMatchLength === simpMatchLength) {
        c += tradMatchLength;
      } else {
        return 'traditional';
      }
    }

    return 'traditional';
  }

  export const getRecordsForWord = (word: string, charset: Charset): CedictRecord[] | null => {
    if (charset === 'simplified') {
      return simpRecords[word] || null;
    } else {
      return tradRecords[word] || null;
    }
  }

  export const getRecordsForWorddAtIndex = (text: string, index: number, charset: Charset): CedictRecord[] | null => {
    let trie;

    if (charset === 'simplified') {
      trie = simpTrie;
    } else {
      trie = tradTrie;
    }

    const segment = trie.getSegmentAtIndex(text, index);
    if (segment && segment.isInDict) {
      return getRecordsForWord(segment.str, charset);
    } else {
      return null;
    }
  }
};  
