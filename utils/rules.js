/* eslint-disable @typescript-eslint/no-shadow */
import moment from "moment-timezone";
import _ from 'lodash';
import {chuanHoa, setDateToday} from '@/utils/utils';

const allCharacters =
  'a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹýếẾ';
// ten : trường tên
// text : trường text
// email
// soDienThoai
// ngaySinh
// required
// username
// password
// inputNumber
// CMND

const rules = {
  dacbiet: [
    {
      pattern: new RegExp(`^[0-9${allCharacters} \n]+$`),
      message: 'Không chứa kí tự đặc biệt',
    },
  ],
  ten: [
    {
      max: 50,
      message: 'Không quá 50 kí tự',
    },
    {
      whitespace: true,
      message: 'Toàn kí tự trắng không hợp lệ',
    },
    {
      pattern: new RegExp(`^[${allCharacters} ]+$`),
      message: 'Tên chỉ bao gồm chữ cái',
    },
  ],
  text: [
    {
      whitespace: true,
      message: 'Toàn kí tự trắng không hợp lệ',
    },
  ],
  sotaikhoan: [
    {
      pattern: new RegExp('^[0-9-]+$'),
      message: 'Chỉ được nhập số',
    },
  ],
  number: (max, min = 0) => [
    {
      pattern: new RegExp('^[0-9-]+$'),
      message: 'Chỉ được nhập số',
    },
    {
      validator: (__, value, callback) => {
        if (parseInt(value, 10) > max) callback('');
        callback();
      },
      message: `Giá trị tối đa: ${max}`,
    },
    {
      validator: (__, value, callback) => {
        if (parseInt(value, 10) < min) callback('');
        callback();
      },
      message: `Giá trị nhỏ nhất: ${min}`,
    },
  ],
  lonHon0: [
    {
      validator: (_, value, callback) => {
        if (value<=0){
          callback('');
        }
        callback();
      },
      message: `Số phải lớn hơn 0`,
    },
  ],
  lonHonHoacBang0: [
    {
      validator: (_, value, callback) => {
        if (value<0){
          callback('');
        }
        callback();
      },
      message: `Số phải lớn hơn hoặc bằng 0`,
    },
  ],
  email: [
    {
      validator: (__, email, callback) => {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) callback('');
        callback();
      },
      message: 'Email chưa đúng định dạng',
    },
  ],
  soDienThoai: [
    {
      pattern: new RegExp(/(^(09|03|07|08|05|01|02|04|06){1}[0-9]{8}$){1}/g),
      message: 'Số điện thoại không đúng định dạng(10 số, không bao gồm kí tự đặc biệt)',
    },
  ],
  ngaySinh: [
    {
      validator: (_, value, callback) => {
        if (moment(value).isAfter(moment())) callback('');
        callback();
      },
      message: 'Ngày sinh chưa đúng',
    },
  ],
  required: [
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],
  username: [
    {
      pattern: new RegExp('^[a-zA-Z0-9._]{4,32}$'),
      message: 'Độ dài 4 tới 32 kí tự, chỉ dùng chữ thường, chữ hoa, số, ".", "_"',
    },
    // {
    //   pattern: new RegExp('^(?![_.])[a-zA-Z0-9._]+(?<![_.])$'),
    //   message: 'Không bao gồm "_" hay "." ở đầu hoặc cuối'
    // }
  ],
  nameDuplicateAdmin : [
    {
      validator: (_, value, callback) => {
        if (value.toLowerCase() === 'admin') callback(''); 
        callback(); 
      },
      message: 'Không được dùng tên trường này',
    },
  ],
  endTimeAfterStartTime: (startField,message, isTime = false, isTimeOnlyWithHourAndMinute = true)=>[
    ({getFieldValue})=>({
      validator: (_, value) => {
        const startTime = getFieldValue(startField);
        if (moment.isMoment(startTime) && moment.isMoment(value)){
          if (!!isTime){
            setDateToday(startTime);
            setDateToday(value);
          }
          if (!!isTimeOnlyWithHourAndMinute){
            startTime.second(0).millisecond(0);
            value.second(0).millisecond(0);
          }
          if (startTime.isAfter(value)){
            return Promise.reject(new Error(message??`Thời gian kết thúc phải sau thời gian bắt đầu !`));
          }
        }
        return Promise.resolve();
      },
    })
  ],
  isInDateRange: (rangeStart,rangeEnd,message, isTime = false, isTimeOnlyWithHourAndMinute = true)=>[
    {
      validator: (__, value) => {
        if (moment.isMoment(value) && value.isValid() && moment.isMoment(rangeStart) && rangeStart.isValid() && moment.isMoment(rangeEnd) && rangeEnd.isValid()){
          if (!!isTime){
            setDateToday(rangeStart);
            setDateToday(rangeEnd);
            setDateToday(value);
          }
          if (!!isTimeOnlyWithHourAndMinute){
            rangeStart.second(0).millisecond(0);
            rangeEnd.second(0).millisecond(0);
            value.second(0).millisecond(0);
          }
          if (!(value.isSameOrAfter(rangeStart) && value.isSameOrBefore(rangeEnd))){
            return Promise.reject(new Error(message ?? "Nằm trong khoảng thời gian không cho phép"));
          }
        }
        return Promise.resolve();
      },
    }
  ],
  isNotInOtherStartEndRange: (index,field, itemList,message, isTime = false, isTimeOnlyWithHourAndMinute = true)=>[
    ({getFieldValue})=>({
      validator: (__, value) => {
        const otherTime = getFieldValue(field);
        if (moment.isMoment(otherTime) && otherTime.isValid()){
          if (!!isTime){
            setDateToday(otherTime);
          }
          if (!!isTimeOnlyWithHourAndMinute){
            otherTime.second(0).millisecond(0)
          }
        }
        if (moment.isMoment(value) && value.isValid() && Array.isArray(itemList) && itemList.length){
          if (!!isTime){
            setDateToday(value);
          }
          if (!!isTimeOnlyWithHourAndMinute){
            value.second(0).millisecond(0)
          }
          for (let i =0;i<itemList.length;i++){
            if (i!==index){
              const rangeStart = moment(itemList[i].thoiGianBatDau);
              const rangeEnd = moment(itemList[i].thoiGianKetThuc);
              if (moment.isMoment(rangeStart) && rangeStart.isValid()){
                if (!!isTime){
                  setDateToday(rangeStart);
                }
                if (!!isTimeOnlyWithHourAndMinute){
                  rangeStart.second(0).millisecond(0)
                }
              }
              if (moment.isMoment(rangeEnd) && rangeEnd.isValid()){
                if (!!isTime){
                  setDateToday(rangeEnd);
                }
                if (!!isTimeOnlyWithHourAndMinute){
                  rangeEnd.second(0).millisecond(0)
                }
              }
              if ((moment.isMoment(rangeStart) && rangeStart.isValid() && moment.isMoment(rangeEnd) && rangeEnd.isValid() && value.isBetween(rangeStart,rangeEnd) && !value.isSame(rangeStart)) || (moment.isMoment(otherTime) && otherTime.isValid() && ((moment.isMoment(rangeStart) && rangeStart.isValid() && rangeStart.isBetween(moment.min(otherTime,value),moment.max(otherTime,value)) && !rangeStart.isSame(moment.min(otherTime,value))) || (moment.isMoment(rangeEnd) && rangeEnd.isValid() && rangeEnd.isBetween(moment.min(otherTime,value),moment.max(otherTime,value)) && !rangeEnd.isSame(moment.max(otherTime,value)))))){
                return Promise.reject(new Error(message ?? "Nằm trong khoảng thời gian không cho phép"));
              }
            }
          }
        }
        return Promise.resolve();
      },
    })
  ],
  password: [
    {
      pattern: new RegExp('^[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]{8,}$'),
      message: 'Độ dài ít nhất 8 kí tự, không sử dụng ký tự khoảng trắng',
    },
    // {
    //   pattern: new RegExp(
    //     '^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]+$'
    //   ),
    //   message: 'Bao gồm cả chữ và số'
    // }
  ],
  CMND: [
    {
      pattern: new RegExp('^[0-9]{9}$|^[0-9]{12}$'),
      message: 'Bao gồm 9 hoặc 12 chữ số',
    },
  ],
  length: (len) => [
    {
      max: len,
      message: `Không quá ${len} kí tự`,
    },
  ],
  textEditor: [
    {
      validator: (_, value, callback) => {
        const { text } = value;
        if (!text || !text.length || !text[0] || !chuanHoa(text).length) callback('');
        callback();
      },
      message: 'Hãy nhập nội dung',
    },
  ],
  fileRequired: [
    {
      validator: (__, value, callback) => {
        if (_.get(value, 'fileList', []).length === 0) callback('');
        callback();
      },
      message: 'Hãy chọn file',
    },
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],

  fileLimit: [
    {
      validator: (__, value, callback) => {
        if (_.get(value, 'fileList', []).length > 15) callback('');
        callback();
      },
      message: 'Số lượng không quá 15 file',
    },
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],

  float: (max, min = 0, sauDauPhay = 2) => [
    {
      pattern: new RegExp('^[0-9.]+$'),
      message: 'Số hoặc dấu chấm',
    },
    {
      validator: (__, value, callback) => {
        if (max && parseFloat(value) > max) callback('');
        callback();
      },
      message: `Giá trị tối đa: ${max}`,
    },
    {
      validator: (__, value, callback) => {
        if (parseFloat(value) < min) callback('');
        callback();
      },
      message: `Giá trị nhỏ nhất: ${min}`,
    },
    {
      validator: (__, value, callback) => {
        const string = `${value}`.split('.');
        if (string.length === 2 && string[1].length > sauDauPhay) callback('');
        callback();
      },
      message:
        sauDauPhay === 0
          ? `Không được nhập số thập phân`
          : `Chỉ được ${sauDauPhay} số sau dấu phẩy`,
    },
  ],
};

export default rules;
