var WxParse = require('../../wxParse/wxParse.js');
Page({
	data: {
		//chapters: [{ "chapter_name": "章节1" }, { "chapter_name": "章节2" },],
		chapters: [],
		chaptersShow: false,
		currentChapterIndex: 0,
		scrollTop: 100
	},
	onLoad: function () {
		var that = this;
		/**
		 * 初始化emoji设置
		 */
		WxParse.emojisInit('[]', "/wxParse/emojis/", {
			"00": "00.gif",
			"01": "01.gif",
			"02": "02.gif",
			"03": "03.gif",
			"04": "04.gif",
			"05": "05.gif",
			"06": "06.gif",
			"07": "07.gif",
			"08": "08.gif",
			"09": "09.gif",
			"09": "09.gif",
			"10": "10.gif",
			"11": "11.gif",
			"12": "12.gif",
			"13": "13.gif",
			"14": "14.gif",
			"15": "15.gif",
			"16": "16.gif",
			"17": "17.gif",
			"18": "18.gif",
			"19": "19.gif",
		});

		this.requestChaptersData(getApp().selectDocName, function () {
			var selectChapter = that.data.chapters[that.data.currentChapterIndex].chapter_name;
			//如果app全局变量selectChapterName存在则使用
			if (getApp().selectChapterName != null) {
				console.log("run")

				selectChapter=getApp().selectChapterName;

				console.log("getApp().selectChapter", getApp().selectChapterName)
				getApp().selectChapterName = null;
			}

			console.log("selectChapter", selectChapter)
			that.requestChapterItemData(getApp().selectDocName, selectChapter);
			wx.setNavigationBarTitle({
				title: selectChapter
			})
		});


	},
	selectChapter: function (event) {
		this.requestChapterItemData(getApp().selectDocName, event.currentTarget.dataset.chapter_name);
		wx.setNavigationBarTitle({
			title: event.currentTarget.dataset.chapter_name
		})
		//找到所选章节的索引，保存
		var i = 0;
		for (; i < this.data.chapters.length; i++) {
			if (this.data.chapters[i].chapter_name == event.currentTarget.dataset.chapter_name) {
				this.data.currentChapterIndex = i;
			}
		}

		this.setData({
			scrollTop: 0
		});
		this.closeChapters();
	},
	closeChapters: function () {
		this.setData({
			chaptersShow: false
		})
	},
	showChapter: function () {
		this.setData({
			chaptersShow: true
		})
	},
	requestChaptersData: function (docname, callback) {
		var that = this;

		wx.request({
			//url: 'http://localhost:3000/api/v1/docs/typescript-tutorial',
			url: 'http://localhost:3000/api/v1/docs/' + docname,

			data: {
			},
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				console.log(res.data)
				that.setData({
					chapters: res.data
				})
				//回调
				if (typeof callback === 'function') {

					callback();
				}
			},
			fail() {
				wx.showToast({
					title: '数据加载失败',
					icon: 'fail',
					duration: 20000
				})
			}
		})
	},
	requestChapterItemData: function (docname, chapterName) {
		var that = this;
		wx.request({
			//url: 'http://localhost:3000/api/v1/docs/typescript-tutorial/type-of-function.md',
			url: 'http://localhost:3000/api/v1/docs/' + docname + '/' + chapterName,
			data: {
			},
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				that.setData({

					docs: res.data

				})
				WxParse.wxParse('article', 'md', that.data.docs, that, 5);
			},
			fail() {
				wx.showToast({
					title: '数据加载失败',
					icon: 'fail',
					duration: 20000
				})
			}
		})
	},
	btnPrevious: function () {
		if (this.data.currentChapterIndex - 1 >= 0) {
			this.requestChapterItemData(getApp().selectDocName, this.data.chapters[--this.data.currentChapterIndex].chapter_name);
			wx.setNavigationBarTitle({
				title: this.data.chapters[this.data.currentChapterIndex].chapter_name
			})
			this.setData({
				scrollTop: 0
			});
		} else {
			wx.showToast({
				title: '已经是第一页',
				icon: 'fail',
				duration: 1500
			})
		}
	},
	btnNext: function () {
		if (this.data.currentChapterIndex + 1 < this.data.chapters.length) {
			this.requestChapterItemData(getApp().selectDocName, this.data.chapters[++this.data.currentChapterIndex].chapter_name);
			wx.setNavigationBarTitle({
				title: this.data.chapters[this.data.currentChapterIndex].chapter_name
			})
			this.setData({
				scrollTop: 0
			});
		} else {
			wx.showToast({
				title: '没有了',
				icon: 'fail',
				duration: 1500
			})
		}
	},
	addToBookmarks: function () {
		console.log("addToBookmarks");
		var that = this;
		var userId = null;
		wx.getStorage({
			key: 'user',
			success: function (res) {

				userId = res.data._id;

				wx.request({
					url: 'http://localhost:3000/api/v1/bookmarks', //仅为示例，并非真实的接口地址
					data: {
						userId: userId,
						docname: getApp().selectDocName,
						docchapter: that.data.chapters[that.data.currentChapterIndex].chapter_name
					},
					method: "POST",
					header: {
						'content-type': 'application/json'
					},
					success: function (res) {

					},
					fail() {
						wx.showToast({
							title: '添加书签失败',
							icon: 'fail',
							duration: 20000
						})
					}
				})
			}
		})



	}
})
