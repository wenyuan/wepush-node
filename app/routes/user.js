const Router = require('koa-router')

const {RegisterValidator} = require('../validators/validator')
const {User} = require('../models/user')
const router = new Router({
  prefix:'/user'
})

// register
router.post('/register', async(ctx)=>{
  const v = await new RegisterValidator().validate(ctx)
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  }
  const result = await User.create(user)
  throw new global.errs.Success()
})

module.exports = router
