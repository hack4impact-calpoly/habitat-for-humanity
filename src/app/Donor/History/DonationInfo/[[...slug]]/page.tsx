"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { getUserByID, User } from "api/user";
import { getItemByID, Item, updateItem } from "api/item";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { Event, addEvent, getEventByItemId } from "api/event";
import { Button, dividerClasses } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import DonorDonationInfoTab, {
  TimeSlot,
} from "components/donor/DonorDonationInfoPage/DonorDonationInfoTab";
import DonorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { useUser } from "@clerk/nextjs";

require("../../../../../App.css");

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

const date = new Date();

const emptyItem: Item = {
  _id: "",
  name: [""],
  size: [""],
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
  notes: "",
  images: [],
};

const emptyUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const emptyTimeSlots: TimeSlot[] = [
  {
    id: "",
    eventStart: "",
    eventEnd: "",
    timeSlotString: "",
    dayString: "",
  },
];

const getTime = (time: string) =>
  time ? moment(time).format("h:mm A") : "N/A";

const getDay = (time: string) =>
  time ? moment(time).utc().format("dddd, MMMM Do YYYY") : "N/A";
const getDayShort = (time: string) =>
  time ? moment(time).format("dddd, MMMM Do YYYY") : "N/A";

function DonationInfoPage() {
  const { user } = useUser();
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState<number>(0);
  const [item, setItem] = useState<Item>(emptyItem);
  const [events, setEvents] = useState<Event[]>([]);
  const [availableTimes, setAvailableTimes] =
    useState<TimeSlot[]>(emptyTimeSlots);
  const params = useParams();
  const slug = params.slug;
  const id = slug ? slug[0] : "";

  const router = useRouter();

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    if (e.currentTarget.value === "back") {
      router.back();
    }
  };

  // Fetch and set item on load
  useEffect(() => {
    const fetchItem = async () => {
      if (typeof id === "string") {
        try {
          const fetchedItem = await getItemByID(id);
          setItem(fetchedItem);
        } catch (err) {
          console.error(err);
          setItem(emptyItem);
        }
      } else {
        setItem(emptyItem);
      }
    };
    fetchItem();
  }, [id]);

  // Fetch and set donor and available times on item change
  useEffect(() => {
    const fetchData = async () => {
      if (item.timeAvailability) {
        const newAvailableTimes: TimeSlot[] = item.timeAvailability?.length
          ? item.timeAvailability.map((event) => ({
              id: `${event.start},${event.end}`,
              eventStart: event.start,
              eventEnd: event.end,
              timeSlotString: `${getTime(event.start)} - ${getTime(event.end)}`,
              dayString: `${getDay(event.start)}`,
              volunteer: "",
            }))
          : emptyTimeSlots;
        setAvailableTimes(newAvailableTimes);
      }
      if (user?.id) {
        const response = await getUserByID(user.id);
        setPhone(response.phone || "Phone not found");
      }
    };
    fetchData();

    if (item) {
      const getEvents = async () => {
        if (item._id) {
          try {
            const matchedEvents = await getEventByItemId(item._id);
            setEvents(matchedEvents);
          } catch (err) {
            console.error("Could not fetch scheduled event:", err);
          }
        }
      };
      getEvents();
    }
  }, [item, user]);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  const storedStatus = useSelector(
    (state: RootState) => state.event.donationStatus,
  );
  const storedTimeSlots = useSelector(
    (state: RootState) => state.event.timeSlots,
  );

  return (
    <div>
      <DonorNavbar />
      <div id="DonInfoPage">
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
              </Tabs>
            </Box>
          </div>
          <TabPanel value={value} index={0} component="span">
            <DonorDonationInfoTab
              item={item}
              donor={{
                id: user?.id || "",
                firstName: user?.firstName || "Unknown",
                lastName: user?.lastName || "user",
                email: user?.primaryEmailAddress?.emailAddress || "",
                phone: phone,
              }}
              timeSlots={availableTimes}
              events={events}
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

export default DonationInfoPage;
