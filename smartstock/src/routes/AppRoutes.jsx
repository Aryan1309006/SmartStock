import { Routes, Route } from "react-router-dom";
import Inventory from "../pages/Inventory";

<Routes>
  <Route path="/dashboard" element={<Dashboar />} />
  <Route path="/inventory" element={<Inventory />} />
  <Route path="/items" element={<Items />} />
  <Route path="/analytics" element={<Analytics />} />
  <Route path="/settings" element={<Settings />} />
</Routes>