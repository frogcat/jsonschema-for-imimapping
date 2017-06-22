const expect = require('chai').expect;
const Validator = require('jsonschema').Validator;
const fs = require('fs');

const schema = JSON.parse(fs.readFileSync("jsonschema-for-imimapping.json", "UTF-8"));

describe('有効な key-value', function() {

  var obj = {
    '空のオブジェクト': {},
    '値が文字列': {
      "a": "clazz>prop1"
    },
    '値が空の配列': {
      "a": []
    },
    '値が文字列の配列': {
      "a": ["clazz>prop1", "clazz>prop2", "clazz>prop3"]
    }
  };

  Object.keys(obj).forEach(key => {
    it(key, function() {
      var a = new Validator().validate(obj[key], schema);
      expect(a.errors.length).to.equal(0);
    });
  });

});

describe('無効な key-value', function() {


  var obj = {
    '値が数値': {
      "a": 1
    },
    '値がオブジェクト': {
      "a": {}
    },
    '値が true': {
      "a": true
    },
    '値が false': {
      "a": false
    },
    '値が文字列以外の配列': {
      "a": ["hello", "world", 1, []]
    }
  };

  Object.keys(obj).forEach(key => {
    it(key, function() {
      var a = new Validator().validate(obj[key], schema);
      expect(a.errors.length).not.to.equal(0);
    });
  });

});

describe('予約語正常系', function() {


  var obj = {
    '@prefix はオブジェクト': {
      "@prefix": {
        "key1": "value1",
        "key2": "value2"
      }
    },
    '@vocab は文字列': {
      "@vocab": "http://example.org"
    },
    '@dmd は文字列': {
      "@dmd": "http://example.org"
    },
    '@title は文字列': {
      "@title": "title"
    },
    '@description は文字列': {
      "@description": "description"
    },
    '@vnd.* の値は任意(文字列)': {
      "@vnd.hello": "world"
    },
    '@vnd.* の値は任意(数値)': {
      "@vnd.hello": 1
    },
    '@vnd.* の値は任意(配列)': {
      "@vnd.hello": []
    },
    '@vnd.* の値は任意(オブジェクト)': {
      "@vnd.hello": {}
    },
    '@vnd.* の値は任意(boolean)': {
      "@vnd.hello": true
    },
    '@vnd.* の値は任意(boolean)': {
      "@vnd.hello": false
    }
  };

  Object.keys(obj).forEach(key => {
    it(key, function() {
      var a = new Validator().validate(obj[key], schema);
      expect(a.errors.length).to.equal(0);
    });
  });
});

describe('予約語異常系', function() {

  var obj = {
    '@prefix にオブジェクト以外': {
      "@prefix": "hello"
    },
    '@prefix に : 入り文字列': {
      "@prefix": {
        "a": "hoge",
        ":": "puyo"
      }
    },
    '@vocab に文字列以外': {
      "@vocab": {}
    },
    '@dmd に文字列以外': {
      "@dmd": {}
    },
    '@title に文字列以外': {
      "@title": {}
    },
    '@description に文字列以外': {
      "@description": []
    },
    '登録外予約語 @vnd.': {
      "@vnd.": 1
    },
    '登録外予約語 @vnd': {
      "@vnd": 1
    },
    '登録外予約語 @unknown': {
      "@unknown": 1
    }
  };

  Object.keys(obj).forEach(key => {
    it(key, function() {
      var a = new Validator().validate(obj[key], schema);
      expect(a.errors.length).not.to.equal(0);
    });
  });
});
