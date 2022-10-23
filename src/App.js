import React from "react";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import NewPage  from "./pages/NewPage";
import Details from './pages/Details';
import Requests from './pages/Requests';
import ReqNew from './pages/ReqNew';

function App(){
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pages/NewPage' element={<NewPage />} />
          <Route path="/campaigns/:address" element={<Details />} />
          <Route path="/campaigns/requests/:address" element={<Requests />} />
          <Route path="/campaigns/requests/new/:address" element={<ReqNew />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
