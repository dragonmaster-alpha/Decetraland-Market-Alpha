import Bid from '../models/bid.model'

const bidsSerializer = data => ({
    id: data.id,
    user_id: data.user_id,
    card_id: data.card_id,
    bid_price: data.bid_price,
    expire_date: data.expire_date,
    status: data.status,
    register_date: data.register_date
});

// Retrieve all data
exports.findAll =  (req, res) => {
    Bid.find()
    .then(async data => {
        const scenes = await Promise.all(data.map(bidsSerializer));
        res.send(scenes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving scenes."
        });
    });
};

// Retrieve data with pagination
exports.findPagination = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;

    let query = {}

    const paginated = await Bid.paginate(
        query,
        {
            page,
            limit,
            lean: true,
            sort: { updatedAt: "desc" }
        }
    )
    
    const { docs } = paginated;
    const users = await Promise.all(docs.map(bidsSerializer));

    delete paginated["docs"];
    const meta = paginated

    res.json({ meta, users });
};

exports.findOne = (req, res) => {
    Bid.findById(req.params.id)
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "user not found with id " + req.params.id
                });
            }
            const user = bidsSerializer(data)
            res.send(user);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.id
            });
        });
};

exports.findMatchBid = (req, res) => {
    console.log(req.body.id);
    console.log(req.user.id);
    Bid.findOne({card_id : req.body.id, user_id : req.user.id})
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "Bid not found with id " + req.body.id
                });
            }
            const bid = bidsSerializer(data)
            res.send(bid);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bid not found with id " + req.body.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving bid with id " + err.kind
            });
        });
};

exports.create = (req, res) => {
    if(!req.body.bid_price || !req.body.id || !req.user.id || !req.body.expire_date) {
         return res.status(400).send({
             message: "Card id, Price and Expire date can not be empty"
         });
    }

    const bid = new Bid({
        card_id: req.body.id,
        user_id: req.user.id,
        bid_price: req.body.bid_price,
        expire_date: req.body.expire_date
    });

    bid.save()
    .then(data => {
        const user = bidsSerializer(data)
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

exports.getPlacedBid = (req, res) => {
    if (!req.user.id) {
        return res.status(400).send({
            message: "User should log in first."
        });
    }

    Bid.aggregate([
        // {
        //     $project: {
        //         'id': card_details.id,
        //         // user_id: data.user_id,
        //         'card_name': card_details.card_name,
        //         'card_desc': card_details.card_desc,
        //         'card_price': card_details.card_price,
        //         'img_url': card_details.img_url,
        //         'status': card_details.status,
        //         'owner': card_details.owner,
        //         'register_date': card_details.register_date
        //     }
        // },
        {
            $match: {
                user_id: req.user.id
            }
        },
        {
            $addFields: {
                cardID : {$toObjectId : '$card_id'}
            }
        },
        {
            $lookup: {
                from: 'card',
                localField: 'cardID',
                foreignField: '_id',
                as: 'card_details'
            }
        }
    ]).then(async data => {
        const cards = await Promise.all(data.map(dt => ({
            id: dt.card_details[0].id,
            // user_id: data.user_id,
            card_name: dt.card_details[0].card_name,
            card_desc: dt.card_details[0].card_desc,
            card_price: dt.card_details[0].card_price,
            img_url: dt.card_details[0].img_url,
            status: dt.card_details[0].status,
            owner: dt.card_details[0].owner,
            register_date: dt.card_details[0].register_date
        })));
        // const user = bidsSerializer(data)
        res.send(cards);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the placed bids."
        });
    });
};

exports.getReceivedBid = (req, res) => {
    console.log('here');
    if (!req.user.id) {
        return res.status(400).send({
            message: "User should log in first."
        });
    }

    Bid.aggregate([
        {
            $addFields: {
                cardID : {$toObjectId : '$card_id'}
            }
        },
        {
            $lookup: {
                from: 'card',
                localField: 'cardID',
                foreignField: '_id',
                as: 'card_details'
            }
        },
        {
            $unwind: {
                path: "$card_details"
            }
        },
        {
            $match: {
                "card_details.owner": req.user.id
            }
        },  
    ]).then(async data => {
        console.log(data)
        const cards = await Promise.all(data.map(dt => ({
            id: dt.card_id,
            // user_id: data.user_id,
            card_name: dt.card_details.card_name,
            card_desc: dt.card_details.card_desc,
            card_price: dt.card_details.card_price,
            bid_price: dt.bid_price,
            img_url: dt.card_details.img_url,
            status: dt.card_details.status,
            owner: dt.card_details.owner,
            bidder: dt.user_id,
            register_date: dt.card_details.register_date
        })));
        console.log(cards)
        // const user = bidsSerializer(data)
        res.send(cards);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the placed bids."
        });
    });
};

exports.updateOrCreate = (req, res) => {
    if(!req.body.bid_price || !req.body.id || !req.user.id || !req.body.expire_date) {
         return res.status(400).send({
             message: "Card id, Price and Expire date can not be empty"
         });
    }

    Bid.updateOne({card_id : req.body.id, user_id : req.user.id}, {
        card_id: req.body.id,
        user_id: req.user.id,
        bid_price: req.body.bid_price,
        expire_date: req.body.expire_date
    }, {upsert: true})
        .then(data => {
            console.log(data)
            if(!data) {
                return res.status(404).send({
                    message: "Bids not found with id " + req.body.id
                });
            }
            const bid = bidsSerializer(data)
            res.send(bid);
        }).catch(err => {
            console.log(err)
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bid not found with id " + req.body.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving bid with id " + err.kind
            });
        });
};

exports.update = (req, res) => {
    if(!req.body.username || !req.body.email ) {
        return res.status(400).send({
            message: "Name and Email can not be empty"
        });
    }

    Bid.findByIdAndUpdate(req.params.id, {
        username: req.body.username.trim(),
        email: req.body.email.trim(),
    }, {new: true})
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        const user = bidsSerializer(data)
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
};

exports.delete = (req, res) => {
    Bid.findByIdAndRemove(req.params.id)
     .then(user => {
         if(!user) {
             return res.status(404).send({
                 message: "User not found with id " + req.params.id
             });
         }
         res.send({ id: req.params.id, message: "User deleted successfully!" });
     }).catch(err => {
         if(err.kind === 'ObjectId' || err.username === 'NotFound') {
             return res.status(404).send({
                 message: "User not found with id " + req.params.id
             });
         }
         return res.status(500).send({
             message: "Could not delete user with id " + req.params.id
         });
     });
};
