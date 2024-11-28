"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Thing {
  _id: string;
  name: string;
}
export default function Home() {
  const [name, setName] = useState("");
  const [items, setItems] = useState<Thing[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v3/thing");
        setItems(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const newThing = {
  //     name,
  //   };

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3001/api/v3/thing",
  //       newThing,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     window.location.reload();
  //     console.log("Response:", response.data);
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      console.log("Name is required.");
      return;
    }

    if (editingId) {
      const updatedThing = { name };

      try {
        const response = await axios.put(
          `http://localhost:3001/api/v3/thing/${editingId}`,
          updatedThing,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Updated item:", response.data);

        setItems(
          items.map((item) =>
            item._id === editingId
              ? { ...item, name: response.data.name }
              : item
          )
        );

        setName("");
        setEditingId(null);
        window.location.reload();
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      const newThing = { name };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/v3/thing",
          newThing,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setItems((prevItems) => [...prevItems, response.data]);
        setName("");
        window.location.reload();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/v3/thing/${id}`
      );
      console.log("Deleted item:", response.data);

      // Listeden silinen öğeyi çıkar
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdate = (id: string, currentName: string) => {
    setEditingId(id);
    setName(currentName);
  };

  return (
    <div>
      <form
        className="flex gap-2 pt-5 flex-col justify-center items-center"
        action=""
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit">ADD</button>
      </form>

      <div className="pt-5 flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold">Items List</h2>
        <ul className="list-disc pl-2">
          {items.map((item) => (
            <div key={item._id}>
              <li>{item.name}</li>
              <div className="flex gap-5">
                <button
                  onClick={() => handleUpdate(item._id, item.name)}
                  className="text-yellow-500"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
