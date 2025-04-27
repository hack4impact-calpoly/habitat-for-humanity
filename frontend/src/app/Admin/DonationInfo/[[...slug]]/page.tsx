"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { getItemByID, Item, updateItem } from "api/item";
import { deleteEventByItemId, Event } from "api/event";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { addEvent } from "api/event";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { clearTimeSlots } from "../../../../redux/eventSlice";
import { RootState } from "../../../../redux/store";
import DonationInfoTab, {
  TimeSlot,
} from "../../../../components/admin/DonationInfoPage/DonationInfoTab";
import AdminNavbar from "../../../../components/admin/AdminNavbar/AdminNavbar";
import Receipt from "../../../../components/admin/DonationInfoPage/Receipt/Receipt";
import AdminSchedule from "../../../../components/admin/DonationInfoPage/AdminSchedule";
import { updateNotes } from "../../../../redux/donationSlice";

import { getClerkUser, getUserByID } from "api/user";

require("../../../../App.css");

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
  notes: "",
  photos: [""],
  notes: "",
};

const emptyUser = {
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
    volunteer: "",
  },
];

const getTime = (time: string) =>
  time ? moment(time).format("h:mm A") : "N/A";

const getDay = (time: string) =>
  time ? moment(time).utc().format("dddd, MMMM Do YYYY") : "N/A";

function DonationInfoPage() {
  const [value, setValue] = useState<number>(0);
  const [item, setItem] = useState<Item>(emptyItem);
  const [donor, setDonor] = useState<any>(emptyUser);
  const [availableTimes, setAvailableTimes] =
    useState<TimeSlot[]>(emptyTimeSlots);
  const [notes, setNotes] = useState<string>("");
  const params = useParams();
  const slug = params.slug;
  const id = slug ? slug[0] : "";
  
  const nextPath: string = "/Admin";
  const router = useRouter();
  const rejectItem = async () => {
    updateItem({ ...item, status: "Rejected" });
    sendUpdatedItemToDB("Rejected", false);
    deleteEventByItemId(id);
  }
  const approveItem = async () => {
    console.log("timeslots", storedTimeSlots);
    if (
      (await storedTimeSlots.map((timeSlot) => sendEventToDB(timeSlot, item))) &&
      (await sendUpdatedItemToDB("Approved and Scheduled", true))
    ) {
      console.log("Success submitting events!");
      clearTimeSlots(); // Clear time slots from redux
      await router.push(nextPath);
      router.refresh(); // Reload page after navigating back to fetch changes
    }
  }
  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    if (e.currentTarget.value === "back") {
      if (storedStatus === "Approved and Scheduled") {
        await approveItem();
      } else if (storedStatus === "Rejected") {
        await rejectItem();
        await router.back();
        router.refresh(); // Reload page after navigating back to fetch changes
      }
      else {
        sendUpdatedItemToDB(storedStatus, false);
        await router.back();
        router.refresh(); // Reload page after navigating back to fetch changes
      }
    } else if (e.currentTarget.value === "reject") {
      await rejectItem();
      await router.back();  
      router.refresh(); // Reload page after navigating back to fetch changes
    } else if (e.currentTarget.value === "approve") {
      await approveItem();
    }
  };

  const sendEventToDB = (timeSlot: TimeSlot, item: Item) => {
    const event = {
      title: `${item.name} ${item.scheduling}`,
      startTime: new Date(timeSlot.eventStart),
      endTime: new Date(timeSlot.eventEnd),
      volunteerId: "dd9b6616-6353-438a-8bb8-a0b022c32b5e", // TODO: Replace with actual volunteerId
      itemId: item._id || "",
    };
    return addEvent(event);
  };

  const sendUpdatedItemToDB = async (status: string, newApproval: boolean) => {
    let updatedItem: Item = {
      ...item,
      status,
      notes: notes,
    };
    if (newApproval) {
      updatedItem.timeApproved = new Date();
    } else {
      updatedItem.timeApproved = undefined;
    }

    return await updateItem(updatedItem);
  };

  useEffect(() => {
    const fetchedItem =
      typeof id === "string"
        ? getItemByID(id)
            .then((item) =>  {
              setItem(item);
              setNotes(item.notes || "");
            })
            .catch((err) => {
              console.log(err);
              setItem(emptyItem);
              setNotes("");
            })
        : setItem(emptyItem);
  }, [id]);

  useEffect(() => {
    if (item.donorId !== "") {
      const getDonor = async () => {
        await getClerkUser(item.donorId)
          .then(async (clerkUser) => {
            await getUserByID(item.donorId).then((user) => {
              setDonor({ ...clerkUser, phone: user.phone });
            });
          })
          .catch((err) => {
            console.error(err);
            setDonor(emptyUser);
          });
      };
      getDonor();
    }

    if (item.timeAvailability) {
      const newAvailableTimes: TimeSlot[] = item.timeAvailability.map(
        (event) => ({
          id: `${event.start},${event.end}`,
          eventStart: event.start,
          eventEnd: event.end,
          timeSlotString: `${getTime(event.start)} - ${getTime(event.end)}`,
          dayString: getDay(event.start),
          volunteer: "",
        }),
      );
      setAvailableTimes(newAvailableTimes);
    }
  }, [item]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes); // This will accept empty strings
  };
  

  const storedStatus = useSelector(
    (state: RootState) => state.event.donationStatus,
  );
  const storedTimeSlots = useSelector(
    (state: RootState) => state.event.timeSlots,
  );

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
          <TabPanel value={value} index={0} component="span">
            <DonationInfoTab
              item={item}
              donor={donor}
              timeSlots={availableTimes}
              notes={notes || ""}
              onNotesChange={handleNotesChange}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AdminSchedule timeSlots={availableTimes} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Receipt item={item} donor={donor} />
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
