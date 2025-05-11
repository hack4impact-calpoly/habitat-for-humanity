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
import { useDispatch, useSelector } from "react-redux";
import {
  clearTimeSlots,
  updateDonationStatus,
} from "../../../../redux/eventSlice";
import { RootState } from "../../../../redux/store";
import DonationInfoTab, {
  TimeSlot,
} from "../../../../components/admin/DonationInfoPage/DonationInfoTab";
import AdminNavbar from "../../../../components/admin/AdminNavbar/AdminNavbar";
import Receipt from "../../../../components/admin/DonationInfoPage/Receipt/Receipt";
import AdminSchedule from "../../../../components/admin/DonationInfoPage/AdminSchedule";
import { updateNotes } from "../../../../redux/donationSlice";
import { getClerkUser, getUserByID } from "api/user";
import { sendApproveEmail, sendRejectEmail } from "api/email";

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
  photos: [],
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

const sendApprovalEmail = async (donor: any) => {
  try {
    await sendApproveEmail({
      to: donor.email,
      donationDetails: {
        name: donor.firstName,
        phone: "(805) 546-8699",
        contactEmail: "restoreslo@habitatslo.org",
        officeLocation: "2790 Broad St, San Luis Obispo, CA 93401",
        officeHours: "Tuesday - Saturday, 10AM - 5PM",
        website: "https://www.habitatslo.org",
      },
    });
    console.log("Approval email sent!");
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

const sendRejectionEmail = async (donor: any) => {
  try {
    await sendRejectEmail({
      to: donor.email,
      firstName: donor.firstName,
    });
    console.log("Rejection email sent!");
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
};

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
  const dispatch = useDispatch();

  const rejectItem = async () => {
    const success = await sendUpdatedItemToDB("Rejected", false);
    deleteEventByItemId(id);

    if (success && donor && donor.email) {
      await sendRejectionEmail(donor);
    }
  };

  const approveItem = async () => {
    if (storedTimeSlots.length > 0) {
      await storedTimeSlots.map((timeSlot) => sendEventToDB(timeSlot, item));
      console.log("Success submitting events!");
      clearTimeSlots(); // Clear time slots from redux
    }
    if (item.scheduling !== "Pickup" || storedTimeSlots.length > 0) {
      const success = await sendUpdatedItemToDB("Approved and Scheduled", true);

      if (success && donor && donor.email) {
        await sendApprovalEmail(donor);
      }

      await router.push(nextPath);
      router.refresh(); // Reload page after navigating back to fetch changes
    }
  };

  const sendEventToDB = (timeSlot: TimeSlot, item: Item) => {
    const event = {
      title: `${item.name.join(", ")} ${item.scheduling}`,
      startTime: new Date(timeSlot.eventStart),
      endTime: new Date(timeSlot.eventEnd),
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
    console.log(updatedItem);
    return await updateItem(updatedItem);
  };

  useEffect(() => {
    const fetchedItem =
      typeof id === "string"
        ? getItemByID(id)
            .then((item) => {
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

    if (item.status) {
      dispatch(updateDonationStatus(item.status));
    }
  }, [item]);

  const getActionButtonText = () => {
    if (storedStatus === "Rejected") return "Reject";
    if (storedStatus === "Approved and Scheduled") return "Send Receipt";
    if (storedStatus === "Completed") return "Save Changes";
    if (storedStatus === "Needs Approval") {
      if (item.scheduling === "Pickup") {
        return "Schedule Pickup";
      } else {
        return "Approve";
      }
    }
    return "Save Changes"; // Default for everyting else
  };

  const handleActionButtonClick = async () => {
    if (storedStatus === "Rejected") {
      rejectItem();
      router.back();
      router.refresh();
      return;
    }

    if (storedStatus === "Approved and Scheduled") {
      setValue(2); // Go to Reciept Tab
      return;
    }

    if (storedStatus === "Completed") {
      // Completed — no action? jsut save and go back(this does get rid of the donation
      //no clue where it sends it to)
      await sendUpdatedItemToDB("Completed", false);
      router.push("/Admin");
      router.refresh();
      return;
    }

    if (storedStatus === "Needs Approval") {
      if (item.scheduling === "Pickup" && value !== 1) {
        setValue(1); // Go to Scheduling Tab
        return;
      } else {
        approveItem();
        return;
      }
    }

    // Default Save Changes
    await sendUpdatedItemToDB(storedStatus, false);
    router.push("/Admin");
    router.refresh();
  };

  const getActionButtonClass = () => {
    if (storedStatus === "Rejected") return "rejectButton";
    return "approveButton";
  };

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

  useEffect(() => {
    console.log("🕒 Stored Time Slots:", storedTimeSlots);
  }, [storedTimeSlots]);
  
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
            <Receipt
              item={item}
              donor={donor}
              scheduledTimeSlot={
                storedTimeSlots.length > 0
                  ? `${moment(storedTimeSlots[0].eventStart).format("dddd, MMMM Do YYYY")} from ${moment(storedTimeSlots[0].eventStart).format("h:mm A")} to ${moment(storedTimeSlots[0].eventEnd).format("h:mm A")}`
                  : "Not scheduled"
              }
            />
          </TabPanel>
        </div>
        <div id="DonInfoButtons">
          <button
            type="button"
            className="backButton"
            value="cancel"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <div id="NextButtons">
            <button
              type="button"
              //uses the old styles from reject and approve button
              className={getActionButtonClass()}
              onClick={handleActionButtonClick}
            >
              {getActionButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationInfoPage;
