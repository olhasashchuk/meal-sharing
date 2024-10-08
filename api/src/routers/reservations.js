import express from "express";
import knex from "../database_client.js";
import { getTableSchema, validParam } from "../valid_data.js";

const reservationsRouter = express.Router();

// Get all reservations
reservationsRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex.select("*").from("reservation");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Adds a new reservation to the database
reservationsRouter.post("/", async (req, res) => {
   const dataSchema = await getTableSchema("reservation"); 
   const validError = validParam(req.body, dataSchema);
   const existedReservation = await knex('reservation').where({ contact_name: req.body.contact_name}).first()
   
   try {
      if (validError) {
         return res.status(404).json({ message: validError });
      }

      if (existedReservation) {
         return res.status(404).json( { message: 'Reservation with this contact of name was existed' });
      }
      
      const [newReservation] = await knex('reservation').insert(req.body);
      res.status(201).json(newReservation);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });

// Returns the reservation by id
reservationsRouter.get("/:id", async (req, res) => {
   try {   
      const { id } = req.params;
      const reservationID = await knex("reservation").where({ id }).first();
      if(reservationID) {
         res.json(reservationID);
      } else {
         res.status(404).json({ message: "Reservation can't find" });
      } 
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
 });

// Updates the reservation by id

reservationsRouter.put("/:id", async (req, res) => {
try {   
   const { id } = req.params;
   const reservationUpdate = await knex("reservation").where({ id }).update(req.body);

   if(reservationUpdate) {
      res.json(reservationUpdate);
   } else {
      res.status(404).json({ message: "Reservation can't find" });
   } 
} catch (error) {
   res.status(500).json({ error: error.message });
}
});

reservationsRouter.delete("/:id", async (req, res) => {
   try {   
      const { id } = req.params;
      const reservationDelete = await knex("reservation").where({ id }).del();
  
      if(reservationDelete) {
         res.json({ message: 'Reservation was deleted'});
      } else {
         res.status(404).json({ message: "Reservation can't find" });
      } 
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
 });

export default reservationsRouter;