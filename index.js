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


        app.get('/catagory', async (req, res) => {
            const query = {};
            const catagory = await catagoryCollection.find(query).toArray();
            res.send(catagory);
        });

        app.get('/category/:id', async (req, res) => {
            const code =req.params.id;
            const query = {code:code};
            const laptops = await laptopCollection.find(query).toArray();
            // console.log(laptops);
            res.send(laptops);
        });

        app.post('/bookings',  async (req, res) => {
            const bookings = req.body;
            // console.log(bookings);
            const result = await bookingsCollection.insertOne(bookings);
            res.send(result);
        });

        app.post('/user',  async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/user',  async (req, res) => {
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
            console.log(email);
            const query = { email }
            const buyers = await bookingsCollection.find(query).toArray();
            res.send(buyers);
        })


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