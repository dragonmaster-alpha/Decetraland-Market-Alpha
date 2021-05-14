import Card from '../models/card.model'
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const multiparty = require('multiparty');

const cardsSerializer = data => ({
    id: data.id,
    // user_id: data.user_id,
    card_name: data.card_name,
    card_desc: data.card_desc,
    card_price: data.card_price,
    img_url: data.img_url,
    status: data.status,
    owner: data.owner,
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


// Retrieve all data
exports.findAllByUserID =  (req, res) => {
    console.log(req.headers);
    Card.find({owner: req.user.id})
    .then(async data => {
        const cards = await Promise.all(data.map(cardsSerializer));
        console.log(cards);
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

exports.getReceivedBid = (req, res) => {
    console.log('asfdher');
    if (!req.user.id) {
        return res.status(400).send({
            message: "User should log in first."
        });
    }

    Card.aggregate([
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
                owner: req.user.id
            }
        },
        {
            $addFields: {
                cardID : {$toString : '$_id'}
            }
        },
        {
            $lookup: {
                from: 'bid',
                localField: 'cardID',
                foreignField: 'card_id',
                as: 'bid_details'
            }
        }
    ]).then(async data => {
        console.log(data);
        const cards = await Promise.all(data.map(cardsSerializer));
        // const user = bidsSerializer(data)
        res.send(cards);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the placed bids."
        });
    });
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
                    message: "Card not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving card with id " + req.params.id
            });
        });
};

exports.create = (req, res) => {
    let form = new multiparty.Form();
    var cardName, cardPrice, cardDesc, userId, file;

    const storage = multer.diskStorage({
        destination: "./uploads/",
        filename: function(req, file, cb){
        cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
        }
    });
    
    const upload = multer({
        storage: storage,
        limits:{fileSize: 10000000},
    }).fields([
        { name: 'file', maxCount: 1 }, 
    ]);

    upload(req, res, function(err) {
        var generatedFilePath = req.files['file'][0]['path'];
        if (err) {
            // ...
        } 

        // Get posted data:
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
        //    user_id: req.body.user_id,
           owner: req.body.user_id,
           img_url: generatedFilePath
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
        var obj = { 
            myField1: req.body.card_name,
            myField2: req.body.card_desc
        };

        console.log(obj);
        // ...
     });
    

//    form.parse(req, function(err, fields, files) {
//     cardName = fields['card_name'][0];
//     cardDesc = fields['card_desc'][0];
//     cardPrice = fields['card_price'][0];
//     userId = fields['user_id'][0];
//     file = files['file'][0];
//     console.log(file);

// //    fs.writeFile("IMAGE-" + Date.now() + path.extname(file.originalFilename));
    
//     if(!cardName || !cardDesc || !cardPrice) {
//          return res.status(400).send({
//              message: "Name, Description and Price can not be empty"
//          });
//     }

//     if (!userId) {
//         return res.status(400).send({
//             message: "Please check if you already log in."
//         });
//     }

//     const card = new Card({
//         card_name: cardName.trim(),
//         card_desc: cardDesc.trim(),
//         card_price: cardPrice,
//         user_id: userId
//     });

//     card.save()
//     .then(data => {
//         const card = cardsSerializer(data)
//         res.send(card);
//     }).catch(err => {
//         res.status(500).send({
//             message: err.message || "Some error occurred while creating the Card."
//         });
//     });
//    });

    // const storage = multer.diskStorage({
    //     destination: "./uploads/",
    //     filename: function(req, file, cb){
    //     cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    //     }
    // });
    
    // const upload = multer({
    //     storage: storage,
    //     limits:{fileSize: 1000000},
    // }).single("file");
    
    // console.log(req.card_name);
    // if(!req.body.card_name || !req.body.card_desc || !req.body.card_price) {
    //      return res.status(400).send({
    //          message: "Name, Description and Price can not be empty"
    //      });
    // }

    // if (!req.body.user_id) {
    //     return res.status(400).send({
    //         message: "Please check if you already log in."
    //     });
    // }

    // const card = new Card({
    //     card_name: req.body.card_name.trim(),
    //     card_desc: req.body.card_desc.trim(),
    //     card_price: req.body.card_price,
    //     user_id: req.body.user_id
    // });

    // card.save()
    // .then(data => {
    //     const card = cardsSerializer(data)
    //     res.send(card);
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while creating the Card."
    //     });
    // });
};

exports.updateByID = (req, res) => {
    if(!req.user.id || !req.body.status) {
        return res.status(400).send({
            message: "Owner, and Status can not be empty"
        });
    }

    Card.findOneAndUpdate({_id:req.body.id/*, status: {$ne: 'Sold'}*/}, {
        owner: req.user.id,
        status: req.body.status,
    }, {new: true})
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Card not found with id " + req.body.id
            });
        }
        const card = cardsSerializer(data)
        res.send(card);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Card not found with id " + req.body.id
            });
        }
        return res.status(500).send({
            message: "Error updating card with id " + req.params.id
        });
    });
}

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
