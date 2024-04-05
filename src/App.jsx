import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./Components/Standart/Layout/Layout";
import Non_Found_Page from "./Components/Pages/Non_Found_Page";

import Main_Page from "./Components/Pages/Main_Page";
import About_Page from "./Components/Pages/About_Page";
import Transfer_Page from "./Components/Pages/Transfer_Page";
import Faq_Page from "./Components/Pages/Faq_Page";
import Contacts_Page from "./Components/Pages/Contacts_Page";
import Turagents_Page from "./Components/Pages/Turagents_Page";
import Region_Page from "./Components/Pages/RegionInfo_Page";
import Tours_Page from "./Components/Pages/Tours_Page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main_Page />} />
          <Route path="/about" element={<About_Page />} />
          <Route path="/transfer" element={<Transfer_Page />} />
          <Route path="/faq" element={<Faq_Page />} />
          <Route path="/contacts" element={<Contacts_Page />} />
          <Route path="/turagents" element={<Turagents_Page />} />
          <Route path="/region/:id" element={<Region_Page />} />
          <Route path="/tours/:id" element={<Tours_Page />} />
          <Route path="*" element={<Non_Found_Page />} />
        </Route>
      </Routes>
    </>
  )
}


export default App
