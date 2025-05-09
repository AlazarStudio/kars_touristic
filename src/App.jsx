
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";


import server from "./serverConfig";


import Layout from './Components/Standart/Layout/Layout';
import Non_Found_Page from './Components/Pages/Non_Found_Page';

import Main_Page from './Components/Pages/Main_Page';
import About_Page from './Components/Pages/About_Page';
import Transfer_Page from './Components/Pages/Transfer_Page';
import Faq_Page from './Components/Pages/Faq_Page';
import Contacts_Page from './Components/Pages/Contacts_Page';
import Turagents_Page from './Components/Pages/Turagents_Page';
import Region_Page from './Components/Pages/RegionInfo_Page';
import Tours_Page from './Components/Pages/Tours_Page';
import Hotels_Page from './Components/Pages/Hotels_Page';
import Number_Page from './Components/Pages/Number_Page';
import Visit_Page from './Components/Pages/Visit_Page';
import Event_Page from './Components/Pages/Event_Page';
import Admin_Page from './Components/Admin/Admin_Page';
import SignUp from './Components/Admin/Blocks/SignUp/SignUp';
import SignIn from './Components/Admin/Blocks/SignIn/SignIn';
import Profile from './Components/Admin/Blocks/Profile/Profile';
import ProfileTouragent from './Components/Admin/Blocks/ProfileTouragent/ProfileTouragent';
import Search_Page from './Components/Pages/Search_Page/Search_Page';
import Favorites_Page from './Components/Pages/Favorites_Page/Favorites_Page';
import Cart_Page from './Components/Pages/Cart_Page/Cart_Page';
import SignUpTouragent from './Components/Admin/Blocks/SignUpTouragent/SignUpTouragent';
import ToursModered_Page from './Components/Pages/ToursModered_Page';
import AdminPageNew from './Components/AdminNew/AdminPageNew';
import RedirectOldTours from "./Components/Pages/RedirectOldTours";
import Partners_Page from "./Components/Pages/Partners_Page/Partners_Page";


function App() {
  // const [tempMain, setTempMain] = useState('Karachaevo-Cherkessiya');

  const [tempMain, setTempMain] = useState(null); // начально пусто

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(`${server}/api/getRegions`);
        const data = await response.json();
        if (data?.regions?.length > 0) {
          const visibleRegions = data.regions.filter(r => r.visible !== false);
          if (visibleRegions.length === 1) {
            setTempMain(visibleRegions[0].link); // 👈 если один видимый
          } else {
            setTempMain(null); // 👈 иначе tempMain не нужен
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке регионов:", error);
      }
    };

    fetchRegions();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout tempMain={tempMain}/>}>
          <Route index element={<Main_Page tempMain={tempMain}/>} />
          <Route path="/about" element={<About_Page />} />
          <Route path="/transfer" element={<Transfer_Page />} />
          <Route path="/faq" element={<Faq_Page />} />
          <Route path="/contacts" element={<Contacts_Page />} />
          <Route path="/turagents" element={<Turagents_Page />} />
          <Route path="/partners" element={<Partners_Page />} />

          <Route path="/region/:id" element={<Region_Page />} />
          <Route path="/region/:id/:tab" element={<Region_Page />} />
          <Route path="/region/:id/:tab/:idTour" element={<Region_Page />} />
          <Route path="/region/:id/:pageName?/:idTour?" element={<Region_Page />} />
          <Route path="/region/:id/:tab/:idTour/:idRoom" element={<Region_Page />} />

          <Route path="/search" element={<Search_Page />} />
        
          <Route path="/tours/:id" element={<RedirectOldTours />} />
          <Route path="/excursions/:id" element={<RedirectOldTours />} />
          <Route path="/gids/:id" element={<RedirectOldTours />} />
          <Route path="/hotels/:id" element={<RedirectOldTours />} />
          <Route path="/hotels/:id/:numID" element={<RedirectOldTours />} />
          <Route path="/visits/:id" element={<RedirectOldTours />} />
          <Route path="/events/:id" element={<RedirectOldTours />} />

          {/* <Route path="/tours/:id" element={<Tours_Page tableName={'multidayTour'} requestType={'getOneMultidayTour'} similar={'getMultidayTours'} pageName={'tours'} />} /> */}
          {/* <Route path="/excursions/:id" element={<Tours_Page tableName={'onedayTour'} requestType={'getOneOnedayTour'} similar={'getOnedayTours'} pageName={'excursions'} />} /> */}
          {/* <Route path="/gids/:id" element={<Tours_Page tableName={'authorTour'} requestType={'getOneAuthorTours'} similar={'getAuthorTours'} pageName={'gids'} />} /> */}
          {/* <Route path="/hotels/:id" element={<Hotels_Page />} /> */}
          {/* <Route path="/hotels/:id/:numID" element={<Number_Page />} /> */}
          {/* <Route path="/visits/:id" element={<Visit_Page />} /> */}
          {/* <Route path="/events/:id" element={<Event_Page />} /> */}

          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />

          <Route path="/signUpTouragent" element={<SignUpTouragent />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profileTouragent/:id" element={<ProfileTouragent />} />

          <Route path="/favourites" element={<Favorites_Page />} />
          
          {/* <Route path="/cart" element={<Cart_Page />} /> */}

          <Route
            path="/toursModered/:id"
            element={
              <ToursModered_Page
                tableName={'AuthorTour'}
                requestType={'getOneAuthorTours'}
                similar={'getAuthorTours'}
                pageName={'tours'}
              />
            }
          />

          {/* <Route path="/admin" element={<Admin_Page />} />
          <Route path="/admin/:id" element={<Admin_Page />} />
          <Route path="/admin/:id/:title" element={<Admin_Page />} />
          <Route path="/admin/:id/:title/:type" element={<Admin_Page />} />
          <Route path="/admin/:id/:title/:type/:add" element={<Admin_Page />} />
          <Route
            path="/admin/:id/:title/:type/:add/:idToEdit"
            element={<Admin_Page />}
          />
          <Route
            path="/admin/:id/:title/:type/:add/:idToEdit/:roomId"
            element={<Admin_Page />}
          /> */}

          <Route path="*" element={<Non_Found_Page />} />
        </Route>
        {/* <Route path="/admin1" element={<AdminPageNew />} /> */}
        <Route path="/admin" element={<AdminPageNew />} />
          <Route path="/admin/:id" element={<AdminPageNew />} />
          <Route path="/admin/:id/:title" element={<AdminPageNew />} />
          <Route path="/admin/:id/:title/:type" element={<AdminPageNew />} />
          <Route path="/admin/:id/:title/:type/:add" element={<AdminPageNew />} />
          <Route
            path="/admin/:id/:title/:type/:add/:idToEdit"
            element={<AdminPageNew />}
          />
          <Route
            path="/admin/:id/:title/:type/:add/:idToEdit/:roomId"
            element={<AdminPageNew />}
          />
      </Routes>
    </>
  );
}

export default App;
