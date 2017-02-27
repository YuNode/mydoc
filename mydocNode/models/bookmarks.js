
var mongoose = require('./mongooseConnect');
var ObjectId = require('mongoose').Types.ObjectId;

var bookmarkSchema = new mongoose.Schema({
    userId: String,
    bookmarkArry: [
        {
            docName: String,
            docChapter: String,
        }
    ]
}, {
        collection: 'bookmarks'
    });
var bookmarkModel = mongoose.model('Bookmark', bookmarkSchema);

function Bookmarks(bookmark)
{
    console.log(bookmark);
    this.userId = bookmark.userId;
};
Bookmarks.prototype.add = function (docName, docChapter, callback)
{
    var that = this;
    console.log("that.userId:" + that.userId)
    bookmarkModel.findOne({ userId: that.userId }, async function (err, userBookmarks)
    {
        if (err)
        {
            return callback(err);
        }

        var createRecord = async function ()
        {
            return new Promise(function (resolve, reject)
            {
                var bookmark = {
                    userId: that.userId,
                    bookmarkArry: []
                };
                var newBookmark = new bookmarkModel(bookmark);
                newBookmark.save(function (err, bookmark)
                {
                    if (err)
                    {
                        resolve({ status: false })

                    }
                    else
                    {
                        resolve({ status: true })
                    }

                });
            })
        }

        if (!userBookmarks)
        {
            //没有该用户的记录，创建用户书签记录
            console.log("没有该用户的记录，创建用户书签记录")

            if (await createRecord().status == 0)
            {
                return callback(err);
            }

        }

        console.log("userBookmarks:" + userBookmarks)
        //添加书签
        console.log("添加书签")
        bookmarkModel.update({ userId: that.userId }, { $addToSet: { bookmarkArry: { docName: docName, docChapter: docChapter } } }, function (err)
        {
            if (err)
            {
                return callback(err);
            } else
            {
                return callback(null, "OK");
            }

        });


    });

}
Bookmarks.prototype.get = function (callback)
{
    var that = this;
    bookmarkModel.findOne({ userId: that.userId }, function (err, userBookmarks)
    {
        if (err)
        {
            return callback(err);
        }
        callback(null, userBookmarks);
    });
};


Bookmarks.prototype.del = function (bookmarkItemId, callback)
{
    console.log("bookmarkItemId:",bookmarkItemId);

    var that = this;
    bookmarkModel.update({ userId: that.userId }, 
    { $pull: { bookmarkArry: { _id: bookmarkItemId } } }, function (err)
    {
        if (err)
        {
            console.log(err)
            return callback(err);
        }
        return callback(null,0);
    });

};
module.exports = Bookmarks;