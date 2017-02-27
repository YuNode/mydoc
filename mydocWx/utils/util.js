function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// function getChapterItemData(docname, chapterName) {
//   wx.request({
//     //url: 'http://localhost:3000/api/v1/docs/typescript-tutorial/type-of-function.md',
//     url: 'http://localhost:3000/api/v1/docs/' + docname + '/' + chapterName,
//     data: {
//     },
//     header: {
//       'content-type': 'application/json'
//     },
//     success: function (res) {
//       if (res.data) {
//         return res.data
//       }
//     },
//     fail() {
//       return false;
//     }
//   })
// }


module.exports = {
  formatTime: formatTime,
  //getChapterItemData:getChapterItemData
}
