'use strict';
module.exports = function(sequelize, DataTypes) {
  var tag = sequelize.define('tag', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.tag.belongsToMany(models.post, {through: 'post_tag'})      }
    }
  });
  return tag;
};