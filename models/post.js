var mongoose = require('mongoose');
mongoose.connect("mongodb://skm:skmskm1@ds129484.mlab.com:29484/codelab");
// Class Schema
var PostsSchema = mongoose.Schema({
	title: {
		type: String
	},
	category: {
		type: String
	},
	body:{
		type:String
	},
	file:{
		type:String
	}
	
});

var Post = module.exports = mongoose.model('Post', PostsSchema);

// Fetch All Posts
module.exports.getPosts = function(callback, limit){
	Post.find(callback).limit(limit);
}

// Fetch Single Post
module.exports.getPostById = function(id, callback){
	Post.findById(id, callback);
}

// Add Lesson
module.exports.addPost = function(info, callback){
    var postObj=new Post(info);
	postObj.save(callback);
	
}