import moment from 'moment';

import jwt_decode from 'jwt-decode';

import * as Constants from '../config/constant';

export const strToLowercase = (str) => str.toLowerCase();

export const isEmptyObject = (val) => isNullOrEmpty(val) || (val && Object.keys(val).length === 0);

export const isEmptyArray = (val) => val && !val.length;

export const isNullOrEmpty = (str) => !str;

export const hasText = (str) => !!(str && str.trim() !== '');

export const hasNoText = (str) => !(str && str.trim() !== '');

export const parseStr = (str, replaceStr = '') => (isNullOrEmpty(str) ? replaceStr : str);

export const parseArray = (arr, replaceStr = []) => (isNullOrEmpty(arr) || isEmptyArray(arr) ? replaceStr : arr);

export const formatData = (data) => JSON.stringify(data, null, 2);

export const getCurrentDateTime = () => new Date();

export const isPastDateTime = (datetime) => datetime < getCurrentDateTime();

export const ConvertToUtc = (dateStr, dateFormat = '') =>
  moment().utc(dateStr, isNullOrEmpty(dateFormat) ? Constants.Common.DateFormat_DD_MM_YYYY : dateFormat);

export const GetDate = (dateStr, dateFormat = '') =>
  moment(dateStr).format(isNullOrEmpty(dateFormat) ? Constants.Common.DateFormat_DD_MM_YYYY : dateFormat);

export const GetTime = (dateStr, timeformat = '') =>
  moment
    .utc(dateStr)
    .local()
    .format(isNullOrEmpty(timeformat) ? Constants.Common.TimeFormat_hh_mm : timeformat);

export const GetYearDifference = (startDate, endDate) => {
  var a = moment([startDate[0], startDate[1], startDate[2]]);
  var b = moment([endDate[0], endDate[1], endDate[2]]);
  return a.diff(b, 'years', true);
};

export const areFilesInvalid = (filesArray) => {
  let invalidFileCount = 0;
  filesArray.forEach((oneFile) => {
    if (
      oneFile.type === 'image/png' ||
      oneFile.type === 'image/jpg' ||
      oneFile.type === 'image/jpeg' 
    ) {
      if (oneFile.size > 1000000) {
        console.log('File is too large');
        invalidFileCount++;
      } else {
        console.log('File upload success');
      }
    } else {
      console.log('Invalid file type');
      invalidFileCount++;
    }
  });
  console.log('invalidCount', invalidFileCount);
  return invalidFileCount;
};

export const areFilesInvalidBulkUpload = (filesArray) => {
  let invalidFileCount = 0;
  filesArray.forEach((oneFile) => {
    if (
      // file type conditions
      oneFile.type === 'application/zip' ||
      oneFile.type === 'application/x-zip-compressed' ||
      oneFile.type === 'application/zip-compressed' ||
      oneFile.type === 'application/vnd.ms-excel' ||
      oneFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      if (oneFile.size > 1000000) {
        console.log('File is too large');
        invalidFileCount++;
      } else {
        console.log('File upload success');
      }
    } else {
      console.log('Invalid file type');
      invalidFileCount++;
    }
  });
  console.log('invalidCount', invalidFileCount);
  return invalidFileCount;
};

export const decodeJWT = (token) => jwt_decode(token);

export const arrayToString = (array) => array.toString();

export const splitWithDelimitter = (date, delimitter) => date.split(delimitter).map(Number);

export const arrayIntersection = (array1, array2) => array1.filter((value) => array2.includes(value));

export const arrayDifference = (array1, array2) => array1.filter((x) => !array2.includes(x));
