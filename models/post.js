'use strict';
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define('post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    authorId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.post.belongsTo(models.author);
        models.post.hasMany(models.comment);
        models.post.belongsToMany(models.tag, {through: 'post_tag'})
      }
    }
  });
  return post;
};
