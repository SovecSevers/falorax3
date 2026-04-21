import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-96bf23b4/health", (c) => {
  return c.json({ status: "ok" });
});

// Get permissions
app.get("/make-server-96bf23b4/permissions", async (c) => {
  try {
    const permissions = await kv.get("permissions") || {
      adminPassword: "admin123",
      editors: []
    };
    return c.json(permissions);
  } catch (error) {
    console.log("Error getting permissions:", error);
    return c.json({ error: "Failed to get permissions: " + error.message }, 500);
  }
});

// Update permissions (admin only)
app.post("/make-server-96bf23b4/permissions", async (c) => {
  try {
    const body = await c.req.json();
    const { adminPassword, editors } = body;

    await kv.set("permissions", {
      adminPassword: adminPassword || "admin123",
      editors: editors || []
    });

    return c.json({ success: true });
  } catch (error) {
    console.log("Error updating permissions:", error);
    return c.json({ error: "Failed to update permissions: " + error.message }, 500);
  }
});

// Get all clans
app.get("/make-server-96bf23b4/clans", async (c) => {
  try {
    const clans = await kv.get("clans") || [];
    return c.json(clans);
  } catch (error) {
    console.log("Error getting clans:", error);
    return c.json({ error: "Failed to get clans: " + error.message }, 500);
  }
});

// Add a new clan
app.post("/make-server-96bf23b4/clans", async (c) => {
  try {
    const newClan = await c.req.json();
    const clans = await kv.get("clans") || [];
    clans.push(newClan);
    await kv.set("clans", clans);
    return c.json(newClan);
  } catch (error) {
    console.log("Error adding clan:", error);
    return c.json({ error: "Failed to add clan: " + error.message }, 500);
  }
});

// Update a clan
app.put("/make-server-96bf23b4/clans/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedClan = await c.req.json();
    const clans = await kv.get("clans") || [];
    const index = clans.findIndex((clan: any) => clan.id === id);
    if (index !== -1) {
      clans[index] = { ...clans[index], ...updatedClan };
      await kv.set("clans", clans);
      return c.json(clans[index]);
    } else {
      return c.json({ error: "Clan not found" }, 404);
    }
  } catch (error) {
    console.log("Error updating clan:", error);
    return c.json({ error: "Failed to update clan: " + error.message }, 500);
  }
});

// Delete a clan
app.delete("/make-server-96bf23b4/clans/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const clans = await kv.get("clans") || [];
    const filteredClans = clans.filter((clan: any) => clan.id !== id);
    await kv.set("clans", filteredClans);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting clan:", error);
    return c.json({ error: "Failed to delete clan: " + error.message }, 500);
  }
});

// Get all cities
app.get("/make-server-96bf23b4/cities", async (c) => {
  try {
    const cities = await kv.get("cities") || [];
    return c.json(cities);
  } catch (error) {
    console.log("Error getting cities:", error);
    return c.json({ error: "Failed to get cities: " + error.message }, 500);
  }
});

// Add a new city
app.post("/make-server-96bf23b4/cities", async (c) => {
  try {
    const newCity = await c.req.json();
    const cities = await kv.get("cities") || [];
    cities.push(newCity);
    await kv.set("cities", cities);
    return c.json(newCity);
  } catch (error) {
    console.log("Error adding city:", error);
    return c.json({ error: "Failed to add city: " + error.message }, 500);
  }
});

// Update a city
app.put("/make-server-96bf23b4/cities/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedCity = await c.req.json();
    const cities = await kv.get("cities") || [];
    const index = cities.findIndex((city: any) => city.id === id);
    if (index !== -1) {
      cities[index] = { ...cities[index], ...updatedCity };
      await kv.set("cities", cities);
      return c.json(cities[index]);
    } else {
      return c.json({ error: "City not found" }, 404);
    }
  } catch (error) {
    console.log("Error updating city:", error);
    return c.json({ error: "Failed to update city: " + error.message }, 500);
  }
});

// Delete a city
app.delete("/make-server-96bf23b4/cities/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const cities = await kv.get("cities") || [];
    const filteredCities = cities.filter((city: any) => city.id !== id);
    await kv.set("cities", filteredCities);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting city:", error);
    return c.json({ error: "Failed to delete city: " + error.message }, 500);
  }
});

Deno.serve(app.fetch);