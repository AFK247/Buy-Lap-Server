const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const user = process.env.db_user;
const password = process.env.db_password;

//The user and password were taken from env
const uri = `mongodb+srv://${user}:${password}@cluster0.bs7nnrw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Two collection is used
async function run() {
    try {

        const catagoryCollection = client.db('Laptop').collection('Catagory');
        const laptopCollection = client.db('Laptop').collection('Laptops');
        const bookingsCollection = client.db('Laptop').collection('Bookings');
        const usersCollection = client.db('Laptop').collection('Users');
        const advertiseCollection = client.db('Laptop').collection('Advertise');


        app.get('/catagory', async (req, res) => {
            const query = {};
            const catagory = await catagoryCollection.find(query).toArray();
            res.send(catagory);
        });

        app.get('/category/:id', async (req, res) => {
            const code = req.params.id;
            const query = { code: code };
            const laptops = await laptopCollection.find(query).toArray();
            // console.log(laptops);
            res.send(laptops);
        });

        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            // console.log(bookings);
            const result = await bookingsCollection.insertOne(bookings);
            res.send(result);
        });

        app.post('/user', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/user', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            // console.log(laptops);
            res.send(users);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' });
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })

        app.get('/buyer/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email }
            const buyers = await bookingsCollection.find(query).toArray();
            res.send(buyers);
        })

        app.get('/seller/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email }
            const sellers = await laptopCollection.find(query).toArray();
            res.send(sellers);
        })

        app.post('/addProduct', async (req, res) => {
            const add = req.body;
            // console.log(bookings);
            const result = await laptopCollection.insertOne(add);
            res.send(result);
        });

        app.post('/advertise', async (req, res) => {
            const advertise = req.body;
            const product_name = advertise.product_name;
            // console.log(product_name);
            const query = { product_name };
            const found = await advertiseCollection.findOne(query);
            // console.log("found",found);
            if (found) {
            }
            else {
                const result = await advertiseCollection.insertOne(advertise);
                res.send(result);
            }

        });

        app.get('/advertise', async (req, res) => {
            const query = {};
            const item = await advertiseCollection.find(query).toArray();
            res.send(item);
        });


    }
    finally {
        //Nothing
    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})