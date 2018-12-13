var mongoose = require('mongoose');
mongoose.connect("mongodb://skm:skmskm1@ds129484.mlab.com:29484/codelab");

// Class Schema
var CategorySchema = mongoose.Schema({
	name: {
		type: String
	}
	
});

var Category = module.exports = mongoose.model('categories', CategorySchema);

// Fetch All Posts
module.exports.getCategories = function(callback, limit){
	Category.find(callback).limit(limit);
}

// Fetch Single Post
module.exports.getCategoryById = function(id, callback){
	Category.findById(id, callback);
}

// Add Lesson
module.exports.addCategory = function(info, callback){
    var categoryObj=new Category(info);
	categoryObj.save(callback);
	
}