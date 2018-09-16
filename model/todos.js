const AV = require('../libs/av-weapp-min.js');

class Todo extends AV.Object{

}

AV.Object.register(Todo, 'Todo')
module.exports = Todo