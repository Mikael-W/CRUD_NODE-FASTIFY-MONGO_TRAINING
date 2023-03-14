import fastify from 'fastify';
import { connect, Schema, model } from 'mongoose';

const server = fastify({ logger: true });

// Connect to MongoDB
connect('mongodb://localhost/training', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema
const carSchema = new Schema({
  brand: String,
  model: String,
  color: String,
  sportsCar: Boolean,
  kilometer: Number,
});

// Define a model
const Car = model('Car', carSchema);

// Add a car
server.post('/car', async (request, reply) => {
  const { brand, model, color, sportsCar, kilometer } = request.body;
  const car = new Car({ brand, model, color, sportsCar, kilometer });
  await car.save();
  reply.code(201).send(car);
});

// Get all cars
server.get('/cars', async (request, reply) => {
  const cars = await Car.find();
  reply.code(200).send(cars);
});

// Get a car by ID
server.get('/cars/:id', async (request, reply) => {
  const { id } = request.params;
  const car = await Car.findById(id);
  reply.code(200).send(car);
});

// Update a car by ID
server.put('/cars/:id', async (request, reply) => {
  const { id } = request.params;
  const { brand, model, color, sportsCar, kilometer } = request.body;
  const car = await Car.findByIdAndUpdate(id, { brand, model, color, sportsCar, kilometer }, { new: true });
  reply.code(200).send(car);
});

// Delete a car by ID
server.delete('/cars/:id', async (request, reply) => {
  const { id } = request.params;
  await Car.findByIdAndDelete(id);
  reply.code(200).send({ message: 'Car deleted' });
});

// IIFE Start the server
(async () => {
  try {
    server.listen({ port: 3000 });
    console.log('Server started on port 3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();


