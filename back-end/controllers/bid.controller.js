import Bid from '../models/bid.model'

const bidsSerializer = data => ({
    id: data.id,
    user_id: data.user_id,
    scene_name: data.scene_name,
    scene_desc: data.scene_desc,
    scene_price: data.scene_price,
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

exports.create = (req, res) => {
    if(!req.body.username || !req.body.email || !req.body.password) {
         return res.status(400).send({
             message: "Name, Email and Password can not be empty"
         });
    }

    const user = new User({
        username: req.body.username.trim(),
        email: req.body.email.trim(),
        password: req.body.password.trim()
    });

    user.save()
    .then(data => {
        const user = bidsSerializer(data)
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
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
