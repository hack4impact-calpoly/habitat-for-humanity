import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { getUserByID, User } from "api/user";
import { getItemByID, Item, updateItem } from "api/item";
import { Email, sendEmail, createParagraph, createListItem } from "api/email";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { addEvent } from "api/event";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { clearTimeSlots } from "redux/eventSlice";
import { RootState } from "../../../redux/store";
import DonationInfoTab, { TimeSlot } from "./DonationInfoTab";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import ReceiptPage from "./ReceiptPage/ReceiptPage";
import AdminSchedulePage from "./AdminSchedulePage";
import sofa1 from "../../donor/donation/images/sofa-01.png";

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
      sendUpdatedItemToDB(storedStatus, false);
      navigate(backPath);
      navigate(0); // Reload page after navigating back to fetch changes
    } else if (e.currentTarget.value === "reject") {
      updateItem({ ...item, status: "Rejected" });
      sendUpdatedItemToDB("Rejected", false);
      sendDonationStatusEmail(false);
      navigate(backPath);
      navigate(0); // Reload page after navigating back to fetch changes
    } else if (e.currentTarget.value === "approve") {
      if (
        (await storedTimeSlots.map((timeSlot) =>
          sendEventToDB(timeSlot, item)
        )) &&
        (await sendUpdatedItemToDB("Approved and Scheduled", true))
      ) {
        sendDonationStatusEmail(true);
        console.log("Success submitting events!");
        clearTimeSlots(); // Clear time slots from redux
        navigate(nextPath);
        navigate(0); // Reload page after navigating back to fetch changes
      }
    }
  };

  const sendEventToDB = (timeSlot: TimeSlot, item: Item) => {
    const event = {
      title: `${item.name} ${item.scheduling}`,
      startTime: new Date(timeSlot.eventStart),
      endTime: new Date(timeSlot.eventEnd),
      volunteerId: "dd9b6616-6353-438a-8bb8-a0b022c32b5e", // TODO add correct volunteer id
      itemId: item._id === undefined ? "" : item._id,
    };
    console.log(event);
    const response = addEvent(event);
    if (!response) {
      // "There was an error saving the events. Please try again later."
      // TODO: add error message to user
    }
    return response;
  };

  // Update item status in DB TODO: add other statuses
  const sendUpdatedItemToDB = async (status: string, newApproval: boolean) => {
    let updatedItem: Item = {
      ...item,
      status,
    };
    if (newApproval) {
      updatedItem = {
        ...updatedItem,
        timeApproved: new Date(),
      };
    }
    const response = await updateItem(updatedItem);
    if (!response) {
      // "There was an error updating the item. Please try again later."
      // TODO: add error message to user
    }
    setItem(updatedItem); // Update state of current item
    return response;
  };

  const sendDonationStatusEmail = async (isApproved: boolean) => {
    try {
      const subject = isApproved
        ? "Donation Request Approval"
        : "Donation Request Rejection";

      const status = isApproved ? "Approved" : "Rejected";

      const container = document.createElement("div");

      container.appendChild(
        createParagraph(
          isApproved
            ? "Your donation request has been approved."
            : "Your donation request has been rejected."
        )
      );
      container.appendChild(
        createParagraph("Here are the details of the item:")
      );

      const list = document.createElement("ul");
      list.style.listStyleType = "none";
      container.appendChild(list);

      const stateValue = item.state || ""; // Check for undefined state

      // TODO: Include time for pickup if
      const listItems = [
        { label: "Name: ", value: item.name },
        { label: "Size: ", value: item.size },
        { label: "Address: ", value: item.address },
        { label: "City: ", value: item.city },
        { label: "State: ", value: stateValue },
        { label: "Zip Code: ", value: item.zipCode },
        { label: "Scheduling: ", value: item.scheduling },
      ];

      listItems.forEach((item) => {
        const listItem = createListItem(item.label, item.value);
        list.appendChild(listItem);
      });

      // TODO: Include which time was approved
      if (item.timeAvailability) {
        const timeAvailability = document.createElement("li");
        const strong = document.createElement("strong");
        strong.style.fontFamily = "Rubik, sans-serif";
        strong.innerText = "Time Availability: ";
        timeAvailability.appendChild(strong);

        const ul = document.createElement("ul");

        item.timeAvailability.forEach((time, index) => {
          const li = document.createElement("li");
          const start = document.createElement("span");
          start.innerText = `Start: ${new Date(time.start).toLocaleString(
            "en-US",
            {
              timeZone: "America/Los_Angeles",
            }
          )}`;
          li.appendChild(start);
          li.appendChild(document.createElement("br"));
          const end = document.createElement("span");
          end.innerText = `End: ${new Date(time.end).toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          })}`;
          li.appendChild(end);
          ul.appendChild(li);
        });

        timeAvailability.appendChild(ul);
        list.appendChild(timeAvailability);
      }

      const stat = createListItem(
        "Status: ",
        isApproved ? "Approved" : "Rejected"
      );
      list.appendChild(stat);

      container.appendChild(
        createParagraph("Thank you for supporting our cause!")
      );

      const email = {
        recipientEmail: donor.email,
        subject,
        body: container.outerHTML,
        isHTML: true,
      };

      const response = await sendEmail(email);
      if (!response) {
        throw new Error("There was an error sending the donation email.");
      }

      return response;
    } catch (error) {
      console.error("Error sending donation email:", error);
      throw error;
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
      {/* <Button onClick={() => console.log(storedStatus)}>Check status</Button> */}
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
            <ReceiptPage item={item} donor={donor} />
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
