'use strict';
module.exports = function(sequelize, DataTypes) {
  var post_tag = sequelize.define('post_tag', {
    postId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return post_tag;
};