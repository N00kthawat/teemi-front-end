import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import './Page/Login.css';
import './Page/Register.css';
import './Page/Home/Home.css';
import './components/HeadUser.css';
import './Page/Management/Management_Concert.css';
import './Page/Management/Management_Hotel.css';
import './Page/Management/Management_P.css';
import './Page/Concert/ConcertAdd.css';
import './Page/Concert/ChanelC.css';
import './Page/Concert/AllC.css';
import './Page/Concert/TimeC.css';
import './Page/Concert/TicketInform.css';
import './Page/EditConcerts/EditCon.css';
import './Page/EditConcerts/EditChanel.css';
import './Page/EditConcerts/EditTime.css';
import './Page/EditConcerts/EditTicket.css';
import './Page/Hotel/HotelAdd.css';
import './Page/Hotel/ImgHotel.css';
import './Page/Hotel/Room.css';
import './Page/Hotel/ImgRoom.css';
import './Page/Hotel/ChanelH.css';
import './Page/Hotel/AllH.css';
import './Page/EditHotels/EditHotel.css';
import './Page/EditHotels/EditRoom.css';
import './Page/EditHotels/EditChanelHotel.css';
import './Page/EditHotels/EditImgHotel.css';
import './Page/EditHotels/EditImgRoom.css';
import './Page/Users/EditUser.css';
import './Page/Users/Profile.css';
import './Page/Management/ConcertDeals.css';
import './Page/Management/HotelDeals.css';
import './Page/Management/SeeConDeals.css';
import './Page/Management/EditSeeConDeals.css';
import './Page/Management/SeeHoDeals.css';
import './Page/Management/EditSeeHoDeals.css';
import './Page/Users/RegisterEntreprenur.css';
import './Page/Users/LoginEntreprenur.css';
import './Page/Home/HomeEN.css';
import './Page/Matching/HotelMatConcert.css';
import './Page/Matching/ConcertMatHotel.css';
import './Page/Matching/MatAllH.css';
import './Page/Matching/MatAllC.css';
import './Page/Delas/Notifications.css';
import './Page/Management/SeeHoDeals_.css';
import './Page/Management/SeeConDeals_.css';
import './Page/Package/ManageConcertPackaes.css';
import './Page/Package/ManageHotelPackaes.css';
import './Page/Matching/HMC.css';
import './Page/Matching/CMH.css';
import './Page/Home/HomeEN_Con.css';
import './Page/Home/HomeEN_P.css';
import './Page/Home/Home_Con.css';
import './Page/Home/Home_P.css';
import './Page/Home/UAllH.css';
import './Page/Home/UAllC.css';
import './Page/Admin/LoginAdmin.css';
import './Page/Admin/RoomStatus.css';
import './Page/Admin/TypeConcert.css';
import './Page/Admin/TypeShow.css';
import './Page/Admin/TypeTicket.css';
import './Page/Admin/TypeHotel.css';
import './Page/Admin/TypeRoom.css';
import './Page/Admin/TypeView.css';
import './Page/Admin/OfferStatus.css';
import './Page/Home/UMatAllC.css';
import './Page/Home/UMatAllH.css';
import './Page/CancelPackage/CancelHotel.css';
import './Page/CancelPackage/CancelConcert.css';
import './Page/Management/Management_Concert_MAX.css';
import './Page/Management/Management_Concert_MIN.css';
import './Page/Admin/UserHistory.css';
import './Page/Management/Management_History.css';
import './Page/Management/Management_History_MAX.css';
import './Page/Management/Management_History_MIN.css';
import './Page/Management/Management_History_SUC.css';
import './Page/Management/Management_History_SUC_MAX.css';
import './Page/Management/Management_History_SUC_MIN.css';
import './Page/Management/Management_History_Failed.css';
import './Page/Management/Management_History_Failed_MAX.css';
import './Page/Management/Management_History_Failed_MIN.css';
import './Page/Management/Management_Hotel_Match.css';
import './Page/Management/Management_Hotel_Un_Match.css';
import './Page/Management/Management_Concert_Match.css';
import './Page/Management/Management_Concert_Un_Match.css';
import './Page/Management/Management_Concert_Un_Match_MAX.css';
import './Page/Management/Management_Concert_Un_Match_MIN.css';
import './Page/Users/LostPassword.css';
import './Page/Users/CheckUser.css';
import './Page/Users/PinCode.css';
import './Page/Matching/CMHOther.css';
import './Page/Management/HotelDealsA.css';
import './Page/Admin/RegisterAdmin.css';


import LoginPage from './Page/Login';
import RegisterPage from './Page/Register';
import HomePage from './Page/Home/Home';
import ToolbarHeadUser from './components/HeadUser';
import ManagementConcert from './Page/Management/Management_Concert';
import ManagementHotel from './Page/Management/Management_Hotel';
import ManagementP from './Page/Management/Management_P';
import ConcertAdd from './Page/Concert/ConcertAdd';
import ChanelC from './Page/Concert/ChanelC';
import AllC from './Page/Concert/AllC';
import TimeC from './Page/Concert/TimeC';
import TicketInform from './Page/Concert/TicketInform';
import EditCon from './Page/EditConcerts/EditCon';
import EditChanel from './Page/EditConcerts/EditChanel';
import EditTime from './Page/EditConcerts/EditTime';
import EditTicket from './Page/EditConcerts/EditTicket';
import HotelAdd from './Page/Hotel/HotelAdd';
import ImgHotel from './Page/Hotel/ImgHotel';
import RoomHotel from './Page/Hotel/Room';
import ImgRoom from './Page/Hotel/ImgRoom';
import ChanelH from './Page/Hotel/ChanelH';
import AllH from './Page/Hotel/AllH';
import EditHotel from './Page/EditHotels/EditHotel';
import EditRoom from './Page/EditHotels/EditRoom';
import EditChanelHotel from './Page/EditHotels/EditChanelHotel';
import EditImgHotel from './Page/EditHotels/EditImgHotel';
import EditImgRoom from './Page/EditHotels/EditImgRoom';
import EditUser from './Page/Users/EditUser';
import Profile from './Page/Users/Profile';
import ConcertDeals from './Page/Management/ConcertDeals';
import HotelDeals from './Page/Management/HotelDeals';
import SeeConDeals from './Page/Management/SeeConDeals';
import EditSeeConDeals from './Page/Management/EditSeeConDeals';
import SeeHoDeals from './Page/Management/SeeHoDeals';
import EditSeeHoDeals from './Page/Management/EditSeeHoDeals';
import RegisterEntreprenur from './Page/Users/RegisterEntreprenur';
import LoginEntreprenur from './Page/Users/LoginEntreprenur';
import HomeEN from './Page/Home/HomeEN';
import HotelMatConcert from './Page/Matching/HotelMatConcert';
import ConcertMatHotel from './Page/Matching/ConcertMatHotel';
import MatAllH from './Page/Matching/MatAllH';
import MatAllC from './Page/Matching/MatAllC';
import Delas from './Page/Delas/Notifications';
import SeeHoDeals_ from './Page/Management/SeeHoDeals_';
import SeeConDeals_ from './Page/Management/SeeConDeals_';
import ManageConcertPackaes from './Page/Package/ManageConcertPackaes';
import ManageHotelPackaes from './Page/Package/ManageHotelPackaes';
import HMC from './Page/Matching/HMC';
import CMH from './Page/Matching/CMH';
import HomeEN_Con from './Page/Home/HomeEN_Con';
import HomeEN_P from './Page/Home/HomeEN_P';
import Home_Con from './Page/Home/Home_Con';
import Home_P from './Page/Home/Home_P';
import UAllH from './Page/Home/UAllH';
import UAllC from './Page/Home/UAllC';
import LoginAdmin from './Page/Admin/LoginAdmin';
import RoomStatus from './Page/Admin/RoomStatus';
import TypeConcert from './Page/Admin/TypeConcert';
import TypeShow from './Page/Admin/TypeShow';
import TypeTicket from './Page/Admin/TypeTicket';
import TypeHotel from './Page/Admin/TypeHotel';
import TypeRoom from './Page/Admin/TypeRoom';
import TypeView from './Page/Admin/TypeView';
import OfferStatus from './Page/Admin/OfferStatus';
import UMatAllC from './Page/Home/UMatAllC';
import UMatAllH from './Page/Home/UMatAllH';
import CancelHotel from './Page/CancelPackage/CancelHotel';
import CancelConcert from './Page/CancelPackage/CancelConcert';
import Management_Concert_MAX from './Page/Management/Management_Concert_MAX';
import Management_Concert_MIN from './Page/Management/Management_Concert_MIN';
import UserHistory from './Page/Admin/UserHistory';
import Management_History from './Page/Management/Management_History';
import Management_History_MAX from './Page/Management/Management_History_MAX';
import Management_History_MIN from './Page/Management/Management_History_MIN';
import History_SUC from './Page/Management/Management_History_SUC';
import History_SUC_MAX from './Page/Management/Management_History_SUC_MAX';
import History_SUC_MIN from './Page/Management/Management_History_SUC_MIN';
import History_Failed from './Page/Management/Management_History_Failed';
import History_Failed_MAX from './Page/Management/Management_History_Failed_MAX';
import History_Failed_MIN from './Page/Management/Management_History_Failed_MIN';
import Hotel_Match from './Page/Management/Management_Hotel_Match';
import Hotel_Un_Match from './Page/Management/Management_Hotel_Un_Match';
import Concert_Match from './Page/Management/Management_Concert_Match';
import Concert_Un_Match from './Page/Management/Management_Concert_Un_Match';
import Concert_Un_Match_MAX from './Page/Management/Management_Concert_Un_Match_MAX';
import Concert_Un_Match_MIN from './Page/Management/Management_Concert_Un_Match_MIN';
import LostPassword from './Page/Users/LostPassword';
import CheckUser from './Page/Users/CheckUser';
import Pincode from './Page/Users/PinCode';
import CMHOther from './Page/Matching/CMHOther';
import HotelDealsA from './Page/Management/HotelDealsA';
import RegisterAdmin from './Page/Admin/RegisterAdmin';

function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/head" element={<ToolbarHeadUser />} />
                <Route path="/management" element={<ManagementConcert />} />
                <Route path="/management_hotel" element={<ManagementHotel />} />
                <Route path="/management_p" element={<ManagementP />} />
                <Route path="/concertadd" element={<ConcertAdd />} />
                <Route path="/chanelc" element={<ChanelC />} />
                <Route path="/allc/:CID" element={<AllC />} />
                <Route path="/timec/:CID" element={<TimeC />} />
                <Route path="/ticketinform/:CID" element={<TicketInform />} />
                <Route path="/editcon/:CID" element={<EditCon />} />
                <Route path="/editchanel/:CID" element={<EditChanel />} />
                <Route path="/edittime/:CID" element={<EditTime />} />
                <Route path="/editticket/:CID" element={<EditTicket />} />
                <Route path="/hoteladd" element={<HotelAdd />} />
                <Route path="/imghotel/:ID_hotel" element={<ImgHotel />} />
                <Route path="/room/:ID_hotel" element={<RoomHotel />} />
                <Route path="/imgroom/:ID_room" element={<ImgRoom />} />
                <Route path="/chanelh/:ID_hotel" element={<ChanelH />} />
                <Route path="/allh/:ID_hotel" element={<AllH />} />
                <Route path="/edithotel/:ID_hotel" element={<EditHotel />} />
                <Route path="/editroom/:ID_room" element={<EditRoom />} />
                <Route path="/editchanelhotel/:ID_hotel" element={<EditChanelHotel/>} />
                <Route path="/editimghotel/:ID_hotel" element={<EditImgHotel />} />
                <Route path="/editimgroom/:ID_room" element={<EditImgRoom />} />
                <Route path="/edituser/:userId" element={<EditUser />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/concertdeals/:CID" element={<ConcertDeals />} />
                <Route path="/hoteldetails/:ID_hotel" element={<HotelDeals />} />
                <Route path="/seecondeals/:CID" element={<SeeConDeals />} />
                <Route path="/editseedeals/:CDID" element={<EditSeeConDeals />} />
                <Route path="/seehoteldetails/:ID_hotel" element={<SeeHoDeals />} />
                <Route path="/editseehoteldetails/:HDID" element={<EditSeeHoDeals />} />
                <Route path="/loginentreprenur/:userId" element={<LoginEntreprenur />} />
                <Route path="/registerentreprenur/:ID_user" element={<RegisterEntreprenur />} />
                <Route path="/homeen" element={<HomeEN />} />
                <Route path="/hotelmatconcert/:ID_user/:ID_hotel/:HDID/:S_datetimeHD/:E_datetimeHD" element={<HotelMatConcert />} /> 
                <Route path="/concertmathotel/:ID_user/:CID/:CDID/:S_datetime/:E_datetime" element={<ConcertMatHotel />} />
                <Route path="/matallh/:ID_hotel" element={<MatAllH />} />
                <Route path="/matallc/:CID" element={<MatAllC />} />
                <Route path="/delas/:ID_user" element={<Delas />} />
                <Route path="/seehodeals_/:ID_hotel" element={<SeeHoDeals_ />} />
                <Route path="/seecondeals_/:CID" element={<SeeConDeals_ />} />
                <Route path="/manageconcertpackaes/:ID_user" element={<ManageConcertPackaes />} />
                <Route path="/managehotelpackaes/:ID_user" element={<ManageHotelPackaes />} />
                <Route path="/hmc" element={<HMC/>} />
                <Route path="/cmh/:ID_user/:ID_hotel/:HDID/:S_datetimeHD/:E_datetimeHD" element={<CMH/>} />
                <Route path="/homeen_con" element={<HomeEN_Con/>} />
                <Route path="/homeen_p" element={<HomeEN_P/>} />
                <Route path="/home_con" element={<Home_Con/>} />
                <Route path="/home_p" element={<Home_P/>} />
                <Route path="/uallh/:ID_hotel" element={<UAllH />} />
                <Route path="/uallc/:CID" element={<UAllC />} />
                <Route path="/loginadmin" element={<LoginAdmin/>}/>
                <Route path="/room-status" element={<RoomStatus/>}/>
                <Route path="/concert-types" element={<TypeConcert/>}/>
                <Route path="/show-types" element={<TypeShow/>}/>
                <Route path="/ticket-types" element={<TypeTicket/>}/>
                <Route path="/hotel-types" element={<TypeHotel/>}/>
                <Route path="/room-types" element={<TypeRoom/>}/>
                <Route path="/view-types" element={<TypeView/>}/>
                <Route path="/offer-status" element={<OfferStatus/>}/>
                <Route path="/umatallh/:ID_hotel" element={<UMatAllH />} />
                <Route path="/umatallc/:CID" element={<UMatAllC />} />
                <Route path="/cancelconcert/:ID_user" element={<CancelConcert />} />
                <Route path="/cancelhotel/:ID_user" element={<CancelHotel />} />
                <Route path="/management_concert_max" element={<Management_Concert_MAX />} />
                <Route path="/management_concert_min" element={<Management_Concert_MIN />} />
                <Route path="/userhistory" element={<UserHistory />} />
                <Route path="/management_history" element={<Management_History/>} />
                <Route path="/management_history_max" element={<Management_History_MAX/>} />
                <Route path="/management_history_min" element={<Management_History_MIN/>} />
                <Route path="/management_historysuc" element={<History_SUC/>} />
                <Route path="/management_historysuc_max" element={<History_SUC_MAX/>} />
                <Route path="/management_historysuc_min" element={<History_SUC_MIN/>} />
                <Route path="/management_historyfailed" element={<History_Failed/>} />
                <Route path="/management_historyfailed_max" element={<History_Failed_MAX/>} />
                <Route path="/management_historyfailed_min" element={<History_Failed_MIN/>} />
                <Route path="/management_hotel_match" element={<Hotel_Match />} />
                <Route path="/management_hotel_un_match" element={<Hotel_Un_Match />} />
                <Route path="/management_match" element={<Concert_Match />} />
                <Route path="/management_un_match" element={<Concert_Un_Match />} />
                <Route path="/management_un_match_max" element={<Concert_Un_Match_MAX />} />
                <Route path="/management_un_match_min" element={<Concert_Un_Match_MIN />} />
                <Route path="/lostpassword" element={<LostPassword/>} />
                <Route path="/checkuser/:Email" element={<CheckUser/>} />
                <Route path="/pincode/:Email" element={<Pincode/>} />
                <Route path="/cmhother/:ID_user/:ID_hotel/:HDID/:S_datetimeHD/:E_datetimeHD" element={<CMHOther />} /> 
                <Route path="/hoteldetailsa/:ID_hotel/:ID_room" element={<HotelDealsA />} />
                <Route path="/registeradmin" element={<RegisterAdmin />} />
                </Routes>
    </Router>
  )
}


export default App