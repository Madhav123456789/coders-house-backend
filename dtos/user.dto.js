class USERDTO{
    constructor(user){
        this.name = user.name,
        this.email = user.email,
        this.mobile = user.mobile,
        this.avtaar = user.avtaar?process.env.BASE_URL+"/"+user.avtaar:user.avtaar,
        this.activated = user.activated,
        this.follwings = user.followings,
        this.followers = user.followers,
        this.description = user.description,
        this.categories = user.categories
    }
};

module.exports = USERDTO;