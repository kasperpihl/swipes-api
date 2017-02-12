// import req from 'request';
// import mapApiMethod from './api_map';
//
// const request = ({ auth_data, method, params = {} }, callback) => {
//   const url =
//     auth_data.access_token ?
//     'https://api.dropboxapi.com/2' :
//     'https://api.dropboxapi.com/oauth2';
//   const mappedMethod = mapApiMethod(method);
//   const options = {
//     method: 'post',
//     json: true,
//     url: url + mappedMethod,
//     headers: {
//       'Content-Type': 'application/json; charset=utf-8',
//     },
//   };
//
//   if (auth_data.access_token) {
//     options.body = params;
//     options.headers.Authorization = `Bearer ${auth_data.access_token}`;
//   } else {
//     options.form = params;
//   }
//
//   req(options, (err, res, body) => {
//     if (err) {
//       console.log(err);
//       return callback(err);
//     }
//
//     return callback(null, body);
//   });
// };
//
// export {
//   request,
// };
