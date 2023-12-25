const getUser = (req, res) => {
    const {query} = req;

    res.json({
        msg: 'Get API - controller',
        query
    });
}

const postUser = (req, res) => {
    const {body} = req;

    res.status(201).json({
        msg: 'Post API - controller',
        body
    });
}

const putUser = (req, res) => {
    const {id} = req.params;

    res.status(400).json({
        msg: 'Put API - controller',
        id
    });
}

const deleteUser = (req, res) => {
    res.json({
        msg: 'Delete API - controller'
    });
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser
}