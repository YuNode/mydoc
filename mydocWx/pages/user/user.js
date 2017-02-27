var util = require('../../utils/util.js')

Page({
    data: {
        isLogin: false,
        isShowReg: false,
        loginAccountName: "",
        loginPassWord: "",
        // bookmarks: [
        //     {
        //         "_id": "58b0271fdb07612a64b72622",
        //         "docChapter": "type-of-function.md",
        //         "docName": "VUE2.0开发"
        //     },
        //     {
        //         "_id": "58b0272bdb07612a64b72623",
        //         "docChapter": "type-of-function.md",
        //         "docName": "VUE2.0开发"
        //     },
        //     {
        //         "_id": "58b0275f25e0441d4cf2e93f",
        //         "docChapter": "type-of-function.md",
        //         "docName": "VUE2.0开发"
        //     },
        //     {
        //         "_id": "58b0e25a974fe009646dc67d",
        //         "docChapter": "any.md",
        //         "docName": "typescript-tutorial"
        //     },
        //     {
        //         "_id": "58b0e277974fe009646dc67e",
        //         "docChapter": "any.md",
        //         "docName": "typescript-tutorial"
        //     },
        //     {
        //         "_id": "58b0e282974fe009646dc67f",
        //         "docChapter": "built-in-objects.md",
        //         "docName": "typescript-tutorial"
        //     }
        // ],
        bookmarks: [],
        currentUserId: null,
        isNoBookmarks: false
    },
    onLoad: function () {
        var that = this;
        wx.getStorage({
            key: 'user',
            success: function (res) {
                that.setData({
                    isLogin: true,
                    currentUserId: res.data._id
                })
                if (that.data.isLogin) {
                    that.getBookmarksAndShow();
                }
            }
        })

    },
    onShow: function () {
        this.getBookmarksAndShow();
    },
    getBookmarksAndShow: function () {
        var that = this;
        wx.request({
            url: 'http://localhost:3000/api/v1/bookmarks',
            data: {
                userId: that.data.currentUserId,
            },
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                if (res.data.userBookmarks&&(res.data.userBookmarks.bookmarkArry.length>=0)) {
                    that.setData({
                        bookmarks: res.data.userBookmarks.bookmarkArry,
                        isNoBookmarks: false
                    })
                } else {
                    that.setData({
                        isNoBookmarks: true
                    })
                }

            },
            fail() {
                wx.showToast({
                    title: '获取书签失败',
                    icon: 'fail',
                    duration: 20000
                })
            }
        })
    },
    //事件处理函数
    toReg: function (event) {
        this.setData({
            isShowReg: true
        })
    },
    tologin: function () {

        this.setData({
            isShowReg: false
        })
    },
    regFormSubmit: function (e) {
        var that = this;

        if (!((/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(e.detail.value.regaccount)) || (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(e.detail.value.regaccount)))) {
            wx.showToast({
                title: '请输入有效的手机号或邮箱号',
                icon: 'fail',
                duration: 3000
            })
        } else {

            if (e.detail.value.regpassword.length < 6) {
                wx.showToast({
                    title: '请输入6位以上密码',
                    icon: 'fail',
                    duration: 3000
                })

            } else {

                if (e.detail.value.regpassword != e.detail.value.regpassword1) {
                    wx.showToast({
                        title: '两次输入的密码不相同，请重新输入',
                        icon: 'fail',
                        duration: 3000
                    })
                } else {
                    // 判断账号是手机号还是邮箱号
                    var emailTemp;
                    var phoneTemp;
                    if (/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(e.detail.value.regaccount)) {
                        emailTemp = "";
                        phoneTemp = e.detail.value.regaccount;
                    } else {
                        emailTemp = e.detail.value.regaccount;
                        phoneTemp = "";
                    }
                    //请未登录
                    wx.request({
                        url: 'http://localhost:3000/api/v1/user', //仅为示例，并非真实的接口地址
                        data: {
                            email: emailTemp,
                            phone: phoneTemp,
                            password: e.detail.value.regpassword
                        },
                        method: "POST",
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            // that.setData({
                            //     docs: res.data
                            // })
                            console.log(res.data)
                            if (res.data && res.data.status == 0) {
                                wx.showToast({
                                    title: res.data.message,
                                    icon: 'success',
                                    duration: 3000
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.message,
                                    icon: 'fail',
                                    duration: 3000
                                })
                            }
                        },
                        fail() {
                            wx.showToast({
                                title: '注册失败',
                                icon: 'fail',
                                duration: 20000
                            })
                        }
                    })

                }
            }
        }
    },
    loginFormSubmit: function (e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);

        var that = this;
        if (!((/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(e.detail.value.login_account)) || (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(e.detail.value.login_account)))) {
            wx.showToast({
                title: '请输入有效的手机号或邮箱号',
                icon: 'fail',
                duration: 3000
            })
        } else {

            if (e.detail.value.login_password.length < 6) {
                wx.showToast({
                    title: '请输入6位以上密码',
                    icon: 'fail',
                    duration: 3000
                })

            } else {

                // 判断账号是手机号还是邮箱号
                var emailTemp;
                var phoneTemp;
                if (/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(e.detail.value.login_account)) {
                    emailTemp = "";
                    phoneTemp = e.detail.value.login_account;
                } else {
                    emailTemp = e.detail.value.login_account;
                    phoneTemp = "";
                }
                console.log("发送请求")
                //请未登录
                wx.request({
                    url: 'http://localhost:3000/api/v1/user',
                    data: {
                        email: emailTemp,
                        phone: phoneTemp,
                        password: e.detail.value.login_password
                    },
                    method: "GET",
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        console.log(res.data)
                        if (res.data && res.data.status == 0) {
                            wx.setStorage({
                                key: "user",
                                data: res.data.user,
                                success: function () {
                                    that.setData({
                                        isLogin: true,
                                        currentUserId: res.data.user._id
                                    });
                                    that.getBookmarksAndShow();
                                    wx.showToast({
                                        title: res.data.message,
                                        icon: 'success',
                                        duration: 3000
                                    })
                                },
                                fail: function () {
                                    wx.showToast({
                                        title: '登录出现故障',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                }
                            })

                        } else {
                            wx.showToast({
                                title: res.data.message,
                                icon: 'fail',
                                duration: 3000
                            })
                        }
                    },
                    fail() {
                        wx.showToast({
                            title: '登录失败',
                            icon: 'fail',
                            duration: 20000
                        })
                    }
                })
            }
        }
    },
    logout: function () {
        var that = this;
        wx.removeStorage({
            key: 'user',
            success: function (res) {
                if (!res.data) {
                    that.setData({
                        isLogin: false,
                    })
                }
            }
        })
    },
    selectBookmarkItem: function (event) {
        console.log(event.currentTarget.dataset);
        var app = getApp()
        console.log("event.currentTarget.dataset.docchapter", event.currentTarget.dataset.docchapter);

        app.selectDocName = event.currentTarget.dataset.docname;
        app.selectChapterName = event.currentTarget.dataset.docchapter;
        wx.navigateTo({
            url: '../doc/doc'
        })
    },
    delBookmarkItem: function (event) {
        console.log(event.currentTarget.dataset.bookmarkid);
        var that = this;


        wx.request({
            url: 'http://localhost:3000/api/v1/bookmarks?userId=' + that.data.currentUserId + "&bookmarkid=" + event.currentTarget.dataset.bookmarkid,
            // data: {
            //     userId: that.data.currentUserId,
            //     bookmarkid: event.currentTarget.dataset.bookmarkid,

            // },
            method: "PUT",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                if (res.data && res.data.status == 0) {
                    //找到的索引，以删除本地书签
                    var bookmarksTemp = [];
                    for (var i = 0; i < that.data.bookmarks.length; i++) {
                        if (that.data.bookmarks[i]._id != event.currentTarget.dataset.bookmarkid) {
                            bookmarksTemp.push(that.data.bookmarks[i]);
                        }
                    }
                    that.setData({
                        bookmarks: bookmarksTemp
                    })
                    if (that.data.bookmarks.length <= 0) {
                        that.setData({
                            isNoBookmarks: true
                        })
                    }
                } else {
                    wx.showToast({
                        title: '删除失败',
                        icon: 'fail',
                        duration: 20000
                    })
                }
            },
            fail() {
                wx.showToast({
                    title: '删除失败',
                    icon: 'fail',
                    duration: 20000
                })
            }
        })
    }
})
