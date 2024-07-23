import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../updateProfile/firebaseConfig";
import { getAuth } from "firebase/auth";
import moment from "moment-timezone"; // Import moment-timezone
import "react-calendar/dist/Calendar.css";
import "./CalendarComponent.css";
import Navbar from "../navbar/navbar";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", time: "" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const eventsCollection = collection(
            db,
            "users",
            currentUser.uid,
            "events"
          );
          const querySnapshot = await getDocs(eventsCollection);
          const eventsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventsList);
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const eventsOnSelectedDate = events.filter((event) => {
      const eventDate = moment.tz(event.date, "Asia/Singapore").toDate();
      return eventDate.toDateString() === selectedDate.toDateString();
    });

    setEventsForSelectedDate(
      eventsOnSelectedDate.sort((a, b) => {
        const [hoursA, minutesA] = a.time.split(":").map(Number);
        const [hoursB, minutesB] = b.time.split(":").map(Number);

        // Convert times to a comparable format
        const timeA = hoursA * 60 + minutesA; // Time in minutes
        const timeB = hoursB * 60 + minutesB; // Time in minutes

        return timeA - timeB;
      })
    );
  }, [selectedDate, events]);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const eventsCollection = collection(
          db,
          "users",
          currentUser.uid,
          "events"
        );
        await addDoc(eventsCollection, {
          name: newEvent.name,
          date: moment.tz(selectedDate, "Asia/Singapore").format("YYYY-MM-DD"),
          time: newEvent.time,
        });
        setShowAddEvent(false);
        setNewEvent({ name: "", time: "" });
        const querySnapshot = await getDocs(eventsCollection);
        const eventsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      }
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const eventRef = doc(db, "users", currentUser.uid, "events", eventId);
        await deleteDoc(eventRef);
        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12 || 12;
    return `${hour}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
  };

  return (
    <div>
      <Navbar />
      <div className="calendar-container">
        <div className="calendar-controls">
          <button
            className="add-event-button"
            onClick={() => setShowAddEvent(!showAddEvent)}
          >
            Add Event
          </button>
        </div>
        {showAddEvent && (
          <div className="add-event-form">
            <h2>Add Event</h2>
            <label>
              Event Name:
              <input
                type="text"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, name: e.target.value })
                }
              />
            </label>
            <label>
              Event Time:
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
              />
            </label>
            <button onClick={handleAddEvent}>Save Event</button>
          </div>
        )}
        <div className="calendar-content">
          <div className="calendar">
            <Calendar onChange={onDateChange} value={selectedDate} />
          </div>
          <div className="events-list">
            <h2>Events on {selectedDate.toDateString()}</h2>
            <ul>
              {eventsForSelectedDate.map((event) => (
                <li key={event.id}>
                  {event.name} - {formatTime(event.time)}
                  <button onClick={() => handleDeleteEvent(event.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
