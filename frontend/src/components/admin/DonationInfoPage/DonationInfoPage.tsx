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
import { Event, addEvent } from "api/event";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import DonationInfoTab, { TimeSlot } from "./DonationInfoTab";
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

function DonationInfoPage(): JSX.Element {
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
    const backPath: string = "/Admin";
    const nextPath: string = "/Admin";

    if (e.currentTarget.value === "back") {
      navigate(backPath);
    } else if (e.currentTarget.value === "reject") {
      updateItem({ ...item, status: "Rejected" });
      navigate(backPath);
    } else if (e.currentTarget.value === "approve") {
      // if (await storedTimeSlots.map((timeSlot) => sendEventToDB(timeSlot))) {
      //   console.log("Success submitting events!");
      //   navigate(nextPath);
      // }
      console.log(storedTimeSlots.map((timeSlot) => sendEventToDB(timeSlot)));
    }
  };

  const sendEventToDB = (timeSlot: TimeSlot) => {
    const arr: string[][] = [[], []];
    arr[0][0] = "test";
    arr[0][1] = "test";
    const event: Event = {
      title: `${item.name} ${item.scheduling}`,
      startTime: new Date(timeSlot.eventStart),
      endTime: new Date(timeSlot.eventEnd),
      volunteerId: "a0da0a77-8b2b-4db4-b042-2f2904165116",
      itemId: item._id === undefined ? "" : item._id,
      address: item.address,
      city: item.city,
      zipCode: item.zipCode,
      volunteerFirstName: timeSlot.volunteer.split(" ")[0],
      volunteerLastName: timeSlot.volunteer.split(" ")[1],
      donorFirstName: donor.firstName,
      donorLastName: donor.lastName,
      itemName: item.name,
      phone: donor.phone,
      pickupAvailability: arr, // TODO
      location: item.city,
    };
    // console.log(event)
    // const response = addEvent(event);
    // if (!response) {
    //   // "There was an error saving the events. Please try again later."
    //   // TODO: add error message to user
    // }
    return event;
  };

  const sendUpdatedItemToDB = async () => {
    const updatedItem: Item = {
      ...item,
      status: "Approved and Scheduled",
    };

    const response = await updateItem(updatedItem);
    if (!response) {
      // "There was an error updating the item. Please try again later."
      // TODO: add error message to user
    }
    return response;
  };

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

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  const storedStatus = useSelector(
    (state: RootState) => state.event.donationStatus
  );
  const storedTimeSlots = useSelector(
    (state: RootState) => state.event.timeSlots
  );

  return (
    <div>
      {/* <Button onClick={() => console.log(storedTimeSlots)}>
        Check timeslots
      </Button> */}
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
          <TabPanel value={value} index={0} component="span">
            <DonationInfoTab
              item={item}
              donor={donor}
              timeSlots={availableTimes}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AdminSchedulePage timeSlots={availableTimes} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ReceiptPage />
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
          <div id="NextButtons">
            <button
              type="button"
              className="rejectButton"
              value="reject"
              onClick={buttonNavigation}
            >
              Reject Donation
            </button>
            <button
              type="button"
              className="approveButton"
              value="approve"
              onClick={buttonNavigation}
            >
              Approve and Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationInfoPage;
