<script>
  import $ from 'jquery'
  /*接口调用地址*/
  const URL = 'http://192.168.1.69:9021';
//  const URL='';
//      const URL = 'http://192.168.0.82:9200';
  //  const URL = 'http://192.168.0.139:9200';
  const API = (url, data = {}, type = 'GET', parse = '', isFile = false) => {
    return new Promise(function (resolve, reject) {
      let promise;
      if (isFile) {
        promise = $.ajax({
          type: type,
          url: URL + url,
          data: data,
          beforeSend: function (xmlhttprequest) {
            xmlhttprequest.setRequestHeader('Authorization', sessionStorage.getItem('token'))
          },
          processData: false,//用于对data参数进行序列化处理 这里必须false
          contentType: false,//必填，获取随机分界符
//          xhrFields: {
//            withCredentials: true
//          },
//          mimeType: "multipart/form-data",

        });
      } else {
        if (parse === '') {
          promise = $.ajax({
            type: type,
            url: URL + url,
            data: data,
//          headers: {
//            "Content-Type": "application/json; charset=utf-8",
//          },
            beforeSend: function (xmlhttprequest) {
              xmlhttprequest.setRequestHeader('Authorization', sessionStorage.getItem('token'))
              xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
            },
          });
        } else {
          promise = $.ajax({
            type: type,
            url: URL + url + parse,
            data: data,
//          headers: {
//            "Content-Type": "application/json; charset=utf-8",
//          },
            beforeSend: function (xmlhttprequest) {
              xmlhttprequest.setRequestHeader('Authorization', sessionStorage.getItem('token'))
              xmlhttprequest.setRequestHeader('Content-Type', "application/json; charset=utf-8")
            },
          });
        }
      }
      promise.then(function (response) {
        // 成功了调用resolve()
        resolve(response)
      }).catch(function (error) {
        //失败了调用reject()
        reject(error);
      })
    });
  };

  const DateUtils = (function () {

    var locale = {
      dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      shortDayNames: ["日", "一", "二", "三", "四", "五", "六"],
      monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      shortMonthNames: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
      am: "上午",
      pm: "下午",
      shortAm: '上',
      shortPm: '下'
    };

    /**
     * 左边补0
     */
    function leftPad(str, size) {
      var result = '' + str;

      while (result.length < size) {
        result = '0' + result;
      }

      return result;
    }

    var parseToken = (function () {
      var match2 = /\d{2}/, // 00 - 99
        //match3 = /\d{3}/,          // 000 - 999
        match4 = /\d{4}/, // 0000 - 9999
        match1to2 = /\d{1,2}/, // 0 - 99
        match1to3 = /\d{1,3}/, // 0 - 999
        //match1to4 = /\d{1,4}/,     // 0 - 9999
        match2w = /.{2}/, // 匹配两个字符
        match1wto2w = /.{1,2}/, // 匹配1~2个字符
        map = {
          //年的后两位
          'yy': {
            regex: match2,
            name: 'year'
          },
          //年
          'yyyy': {
            regex: match4,
            name: 'year'
          },
          //两位数的月，不到两位数则补0
          'MM': {
            regex: match2,
            name: 'month'
          },
          //月
          'M': {
            regex: match1to2,
            name: 'month'
          },
          //两位数的日期，不到两位数则补0
          'dd': {
            regex: match2,
            name: 'date'
          },
          //日期
          'd': {
            regex: match1to2,
            name: 'date'
          },
          //两位数的小时，24小时进制
          'HH': {
            regex: match2,
            name: 'hours'
          },
          //小时，24小时进制
          'H': {
            regex: match1to2,
            name: 'hours'
          },
          //两位数的小时，12小时进制
          'hh': {
            regex: match2,
            name: 'hours'
          },
          //小时，12小时进制
          'h': {
            regex: match1to2,
            name: 'hours'
          },
          //两位数的分钟
          'mm': {
            regex: match2,
            name: 'minutes'
          },
          //分钟
          'm': {
            regex: match1to2,
            name: 'minutes'
          },
          's': {
            regex: match1to2,
            name: 'seconds'
          },
          'ss': {
            regex: match2,
            name: 'seconds'
          },
          //上午、下午
          'tt': {
            regex: match2w,
            name: 't'
          },
          //上午、下午
          't': {
            regex: match1wto2w,
            name: 't'
          },
          //毫秒
          'S': {
            regex: match1to3,
            name: 'millisecond'
          },
          //毫秒
          'SS': {
            regex: match1to3,
            name: 'millisecond'
          },
          //毫秒
          'SSS': {
            regex: match1to3,
            name: 'millisecond'
          }
        };

      return function (token, str, dateObj) {
        var result, part = map[token];
        if (part) {
          result = str.match(part.regex);
          if (result) {
            dateObj[part.name] = result[0];
            return result[0];
          }
        }

        return null;
      };
    })();

    return {
      locale: locale,
      format: function (val, pattern) {
        if (Object.prototype.toString.call(val) !== '[object Date]') {
          return '';
        }

        if (Object.prototype.toString.call(pattern) !== '[object String]' || pattern === '') {
          pattern = 'yyyy-MM-dd HH:mm:ss';
        }

        var fullYear = val.getFullYear(),
          month = val.getMonth(),
          day = val.getDay(),
          date = val.getDate(),
          hours = val.getHours(),
          minutes = val.getMinutes(),
          seconds = val.getSeconds(),
          milliseconds = val.getMilliseconds();

        return pattern.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|SS?S?)/g, function (m) {
          if (m.charAt(0) === '\\') {
            return m.replace('\\', '');
          }

          var locale = DateUtils.locale;

          switch (m) {
            case "hh":
              return leftPad(hours < 13 ? (hours === 0 ? 12 : hours) : (hours - 12), 2);
            case "h":
              return hours < 13 ? (hours === 0 ? 12 : hours) : (hours - 12);
            case "HH":
              return leftPad(hours, 2);
            case "H":
              return hours;
            case "mm":
              return leftPad(minutes, 2);
            case "m":
              return minutes;
            case "ss":
              return leftPad(seconds, 2);
            case "s":
              return seconds;
            case "yyyy":
              return fullYear;
            case "yy":
              return (fullYear + '').substring(2);
            case "dddd":
              return locale.dayNames[day];
            case "ddd":
              return locale.shortDayNames[day];
            case "dd":
              return leftPad(date, 2);
            case "d":
              return date;
            case "MMMM":
              return locale.monthNames[month];
            case "MMM":
              return locale.shortMonthNames[month];
            case "MM":
              return leftPad(month + 1, 2);
            case "M":
              return month + 1;
            case "t":
              return hours < 12 ? locale.shortAm : locale.shortPm;
            case "tt":
              return hours < 12 ? locale.am : locale.pm;
            case "S":
              return milliseconds;
            case "SS":
              return leftPad(milliseconds, 2);
            case "SSS":
              return leftPad(milliseconds, 3);
            default:
              return m;
          }
        });
      },

      parse: function (val, pattern) {
        if (!val) {
          return null;
        }

        if (Object.prototype.toString.call(val) === '[object Date]') {
          // 如果val是日期，则返回。
          return val;
        }

        if (Object.prototype.toString.call(val) !== '[object String]') {
          // 如果val不是字符串，则退出。
          return null;
        }

        var time;
        if (Object.prototype.toString.call(pattern) !== '[object String]' || pattern === '') {
          // 如果fmt不是字符串或者是空字符串。
          // 使用浏览器内置的日期解析
          time = Date.parse(val);
          if (isNaN(time)) {
            return null;
          }

          return new Date(time);
        }

        var i, token, tmpVal,
          tokens = pattern.match(/(\\)?(dd?|MM?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|SS?S?|.)/g),
          dateObj = {
            year: 0,
            month: 1,
            date: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            millisecond: 0
          };

        for (i = 0; i < tokens.length; i++) {
          token = tokens[i];
          tmpVal = parseToken(token, val, dateObj);

          if (tmpVal !== null) {
            if (val.length > tmpVal.length) {
              val = val.substring(tmpVal.length);
            } else {
              val = '';
            }
          } else {
            val = val.substring(token.length);
          }
        }

        if (dateObj.t) {
          if (DateUtils.locale.pm === dateObj.t || DateUtils.locale.shortPm === dateObj.t) {
            dateObj.hours = (+dateObj.hours) + 12;
          }
        }

        dateObj.month -= 1;

        return new Date(dateObj.year, dateObj.month, dateObj.date, dateObj.hours, dateObj.minutes, dateObj.seconds, dateObj.millisecond);
      }
    };
  })();
  const isEmptyObject = (obj) => {
      for (let name in obj) {
        return false;
      }
      return true;
    },
    getTimeByTimestamp = (now) => {
      if (isEmptyObject(now)) {
        let time = new Date(parseInt(now));
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let day = time.getDate();
        month = month <= 9 ? month = "0" + month : month;
        day = day <= 9 ? day = "0" + day : day;
        hours = hours <= 9 ? hours = "0" + hours : hours;
        minutes = minutes <= 9 ? minutes = "0" + minutes : minutes;
        seconds = seconds <= 9 ? seconds = "0" + seconds : seconds;
        return year + "-" + month + "-" + day + ' ' + hours + ':' + minutes + ':' + seconds;
      } else {
        return "";
      }

    },
    getDateFormat = (value, format) => {
      if (isEmptyObject(value) && value !== "null") {
        if (value.length <= 0) {
          return;
        }
        //字符串中包含T的时间
        // console.log(typeof value);
        if (typeof value === 'number') {

        } else {
          if (value.indexOf('T') >= 0) {
            value = value.replace(/\/ /g, "");
            value = value.replace("T", " ");
            if (value.indexOf(".") >= 0) {
              value = value.substring(0, value.indexOf("."));
            }
          } else if (value.indexOf('/') < 0 && value.indexOf('-') < 0 && value.indexOf(':') < 0) {
            value = getTimeByTimestamp(value);
          }
        }


        return {
          timestamp: new Date(value).getTime(),
          dateFormat: DateUtils.format(new Date(value), format)
        }
      } else {
        return {
          timestamp: '',
          dateFormat: ''
        }
      }
    };




  export default {
    name: "common",
    URL, getDateFormat, API,
    mockdata(url,params,type){
      return API(url,params,type)
    }
  }
</script>
