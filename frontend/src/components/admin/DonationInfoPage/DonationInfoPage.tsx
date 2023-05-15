import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { getUserByID, User } from "api/user";
import { getItemByID, Item } from "api/item";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { Event } from "redux/donationSlice";
import sofa1 from "../../donor/donation/images/sofa-01.png";
import DonationInfoTab, { getDay, getTime } from "./DonationInfoTab";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import ReceiptPage from "./ReceiptPage/ReceiptPage";
import AdminSchedulePage from "./AdminSchedulePage";

require("./DonationInfoPage.css");

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: {
  [x: string]: any;
  children: any;
  value: any;
  index: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const imagesPool = [{ src: sofa1 }];

const avaiTimes = [
  {
    day: "Tuesday, January 11",
    hours: [
      "10:00 AM to 11:00AM",
      "11:00 AM to 12:00 PM",
      "12:00 PM to 1:00 PM",
    ],
  },
  {
    day: "Wednesday, January 12",
    hours: [
      "10:00 AM to 11:00AM",
      "11:00 AM to 12:00 PM",
      "12:00 PM to 1:00 PM",
    ],
  },
  {
    day: "Friday, January 14",
    hours: ["2:00 PM to 3:00PM", "3:00 PM to 4:00PM", "4:00 PM to 5:00PM"],
  },
];

const emptyItem: Item = {
  _id: "",
  name: "",
  size: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  scheduling: "",
  timeAvailability: [{ start: "", end: "" }],
  donorId: "",
  timeSubmitted: new Date(),
  timeApproved: new Date(),
  status: "",
};

const emptyUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  userType: "",
};

const emptyEvents: Event[] = [
  {
    start: "",
    end: "",
  },
];

function DonationInfoPage(): JSX.Element {
  const [value, setValue] = useState<number>(0);
  const [item, setItem] = useState<Item>(emptyItem);
  const [donor, setDonor] = useState<User>(emptyUser);
  const [availableTimes, setAvailableTimes] = useState<Event[]>(emptyEvents);
  const { id } = useParams();

  useEffect(() => {
    const fetchedItem =
      typeof id === "string"
        ? getItemByID(id)
            .then((item) => setItem(item))
            .catch((err) => {
              console.log(err);
              setItem(emptyItem);
            })
        : setItem(emptyItem);
  }, []);

  useEffect(() => {
    if (item.donorId !== "") {
      const fetchedDonor = getUserByID(item.donorId)
        .then((donor) => setDonor(donor))
        .catch((err) => {
          console.log(err);
          setDonor(emptyUser);
        });
    }
    if (item.timeAvailability) {
      setAvailableTimes(item.timeAvailability);
    }
  }, [item]);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };
  return (
    <div>
      <AdminNavbar />
      <div id="DonInfoPage">
        <div id="ActiveDonHeader">
          <h1>Donation Approval</h1>
        </div>
        <div id="DonInfoBox">
          <div id="Tabs">
            <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                TabIndicatorProps={{ style: { background: "#314d89" } }}
                textColor="primary"
              >
                <Tab
                  label={<span className="IndividTabs">Donation Info</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  label={<span className="IndividTabs">Scheduling</span>}
                  {...a11yProps(1)}
                />
                <Tab
                  label={<span className="IndividTabs">Receipt</span>}
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
          </div>
          <TabPanel value={value} index={0}>
            <DonationInfoTab item={item} donor={donor} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AdminSchedulePage times={availableTimes} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ReceiptPage />
          </TabPanel>
        </div>
        <div id="DonInfoButtons">
          <button type="button" className="backButton">
            Back
          </button>
          <div id="NextButtons">
            <button type="button" className="rejectButton">
              Reject Donation
            </button>
            <button type="button" className="approveButton">
              Approve and Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationInfoPage;
