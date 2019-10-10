const {Sequelize,Model} = require('sequelize')
const {unset, clone, isArray} = require('lodash')
const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database

const sequelize = new Sequelize(dbName,user,password,{
  dialect:'mysql',
  host: host,
  port: port,
  logging:true,

  timezone: '+08:00',
  define:{
    timestamps:true, // 是否需要增加createdAt、updatedAt、deletedAt字段，默认为 true
    paranoid:true, // true: 删除数据时不会进行物理删除，而是设置deletedAt为当前时间（paranoid只有在启用时间戳时才能工作）
    createdAt:'created_at', // 将字段改个名
    updatedAt:'updated_at',
    deletedAt:'deleted_at',
    underscored:true, // 将自动设置所有属性的字段参数为下划线命名方式（不会覆盖已经定义的字段选项）
    freezeTableName:true, // 默认情况下，表名自动复数；使用 freezeTableName:true 参数可以为特定模型停止此行为
    scopes:{
      bh:{
        attributes:{
          exclude:['updated_at','deleted_at','created_at']
        }
      }
    }
  }
})

// 取消强制同步
// 删除同名数据表后同步，谨慎使用，会导致数据丢失
sequelize.sync({
  force:false
})

Model.prototype.toJSON= function(){
  // let data = this.dataValues
  let data = clone(this.dataValues)
  unset(data, 'updated_at')
  unset(data, 'created_at')
  unset(data, 'deleted_at')

  for (key in data){
    if(key === 'image'){
      if(!data[key].startsWith('http'))
        data[key]=global.config.host + data[key]
    }
  }

  if(isArray(this.exclude)){
    this.exclude.forEach(
      (value)=>{
        unset(data,value)
      }
    )
  }
  // this.exclude
  // exclude
  // a,b,c,d,e
  return data
}

module.exports = {
  db:sequelize
}
