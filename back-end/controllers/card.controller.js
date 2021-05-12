import Card from '../models/card.model'

const cardsSerializer = data => ({
    id: data.id,
    user_id: data.user_id,
    card_name: data.card_name,
    card_desc: data.card_desc,
    card_price: data.card_price,
    register_date: data.register_date
});

// Retrieve all data
exports.findAll =  (req, res) => {
    Card.find()
    .then(async data => {
        const cards = await Promise.all(data.map(cardsSerializer));
        res.send(cards);
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

    const paginated = await Card.paginate(
        query,
        {
            page,
            limit,
            lean: true,
            sort: { updatedAt: "desc" }
        }
    )
    
    const { docs } = paginated;
    const cards = await Promise.all(docs.map(cardsSerializer));

    delete paginated["docs"];
    const meta = paginated

    res.json({ meta, cards });
};

exports.findOne = (req, res) => {
    Card.findById(req.params.id)
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "card not found with id " + req.params.id
                });
            }
            const card = cardsSerializer(data)
            res.send(card);
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
    console.log('create');
    console.log(req.body.card_name);
    console.log(req.body.card_price);
    console.log(req.body.card_desc);
    if(!req.body.card_name || !req.body.card_desc || !req.body.card_price) {
         return res.status(400).send({
             message: "Name, Description and Price can not be empty"
         });
    }

    if (!req.body.user_id) {
        return res.status(400).send({
            message: "Please check if you already log in."
        });
    }

    const card = new Card({
        card_name: req.body.card_name.trim(),
        card_desc: req.body.card_desc.trim(),
        card_price: req.body.card_price,
        user_id: req.body.user_id
    });

    card.save()
    .then(data => {
        const card = cardsSerializer(data)
        res.send(card);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Card."
        });
    });
};

exports.update = (req, res) => {
    if(!req.body.card_name || !req.body.card_desc || !req.body.card_price ) {
        return res.status(400).send({
            message: "Name, Description and Price can not be empty"
        });
    }

    Card.findByIdAndUpdate(req.params.id, {
        card_name: req.body.card_name.trim(),
        card_desc: req.body.card_desc.trim(),
        card_price: req.body.card_price.trim(),
    }, {new: true})
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Card not found with id " + req.params.id
            });
        }
        const card = cardsSerializer(data)
        res.send(card);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Card not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating card with id " + req.params.id
        });
    });
};

exports.delete = (req, res) => {
    Card.findByIdAndRemove(req.params.id)
     .then(card => {
         if(!card) {
             return res.status(404).send({
                 message: "Card not found with id " + req.params.id
             });
         }
         res.send({ id: req.params.id, message: "Card deleted successfully!" });
     }).catch(err => {
         if(err.kind === 'ObjectId') {
             return res.status(404).send({
                 message: "Card not found with id " + req.params.id
             });
         }
         return res.status(500).send({
             message: "Could not delete card with id " + req.params.id
         });
     });
};
