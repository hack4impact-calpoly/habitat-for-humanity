import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { getUserByID, User } from "api/user";
import { getItemByID, Item, updateItem } from "api/item";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import moment from "moment";
import DonorDonationInfoTab, { TimeSlot } from "./DonorDonationInfoTab";
import DonorNavbar from "../DonorNavbar/DonorNavbar";
import sofa1 from "../donation/images/sofa-01.png";

require("./DonorDonationInfoPage.css");

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
        <Typography component="span">{children}</Typography>
      </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const imagesPool: string[] = [sofa1];

const date = new Date();

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
  photos: [""],
};

const emptyUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  userType: "",
};

const emptyTimeSlots: TimeSlot[] = [
  {
    id: "",
    eventStart: "",
    eventEnd: "",
    timeSlotString: "",
    dayString: "",
    volunteer: "",
  },
];

const getTime = (time: string) =>
  time ? moment(time).format("h:mm A") : "N/A";

const getDay = (time: string) =>
  time ? moment(time).utc().format("dddd, MMMM Do YYYY") : "N/A";
const getDayShort = (time: string) =>
  time ? moment(time).format("dddd, MMMM Do YYYY") : "N/A";

function DonorDonationInfoPage(): JSX.Element {
  const [value, setValue] = useState<number>(0);
  const [item, setItem] = useState<Item>(emptyItem);
  const [donor, setDonor] = useState<User>(emptyUser);
  const [availableTimes, setAvailableTimes] =
    useState<TimeSlot[]>(emptyTimeSlots);
  const { id } = useParams();

  const navigate = useNavigate();
  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    const backPath: string = "/Donor/History";

    if (e.currentTarget.value === "back") {
      navigate(backPath);
    }
  };

  // Fetch and set item on load
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

  // Fetch and set donor and available times on item change
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
      const newAvailableTimes: TimeSlot[] = item.timeAvailability.map(
        (event) => ({
          id: `${event.start},${event.end}`,
          eventStart: event.start,
          eventEnd: event.end,
          timeSlotString: `${getTime(event.start)} - ${getTime(event.end)}`,
          dayString: `${getDay(event.start)}`,
          volunteer: "",
        })
      );
      setAvailableTimes(newAvailableTimes);
    }
  }, [item]);

  return (
    <div>
      <DonorNavbar />
      <div id="DonInfoPage">
        <div id="ActiveDonHeader">
          <h1>Donation Information</h1>
        </div>
        <div id="DonInfoBox">
          <div id="Tabs">
            <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
              <Tabs
                value={value}
                variant="fullWidth"
                TabIndicatorProps={{ style: { background: "#314d89" } }}
                textColor="primary"
              >
                <Tab
                  label={<span className="IndividTabs">Donation Info</span>}
                  {...a11yProps(0)}
                />
              </Tabs>
            </Box>
          </div>
          <TabPanel value={value} index={0} component="span">
            <DonorDonationInfoTab
              item={item}
              donor={donor}
              timeSlots={availableTimes}
            />
          </TabPanel>
        </div>
        <div id="DonInfoButtons">
          <button
            type="button"
            className="backButton"
            value="back"
            onClick={buttonNavigation}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorDonationInfoPage;
