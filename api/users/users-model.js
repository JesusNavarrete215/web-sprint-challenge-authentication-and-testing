const db = require("../../data/dbConfig")

module.exports={
    add,
    findBy
}

function findBy(filter) {
    return db('users').where(filter).orderBy("id");
}

function findById(id){
    // select * from users where id=1
    return db('users').where('id', id).first()
}

async function add(user) {
    const [id] = await db('users').insert(user);
    return findById(id)
}