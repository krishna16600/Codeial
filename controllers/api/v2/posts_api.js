module.exports.index = (req, res) => {
    return res.json(200 , {
        message: 'v2 loaded',
        posts: []
    })
}