"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { deleteItemByItemId, getItemByID, Item, updateItem } from "api/item";
import { deleteEventByItemId, Event, getEventByItemId } from "api/event";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { addEvent } from "api/event";
import { Button, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTimeSlots,
  TimeSlot,
  updateDonationStatus,
} from "../../../../redux/eventSlice";
import { RootState } from "../../../../redux/store";
import DonationInfoTab from "../../../../components/admin/DonationInfoPage/DonationInfoTab";
import AdminNavbar from "../../../../components/admin/AdminNavbar/AdminNavbar";
import Receipt from "../../../../components/admin/DonationInfoPage/Receipt/Receipt";
import AdminSchedule from "../../../../components/admin/DonationInfoPage/AdminSchedule";
import { updateNotes } from "../../../../redux/donationSlice";
import { getClerkUser, getUserByID } from "api/user";
import { sendApproveEmail, sendReceiptEmail, sendRejectEmail } from "api/email";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";

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
  images: [],
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
  },
];

const getTime = (time: string) =>
  time ? moment(time).format("h:mm A") : "N/A";

const getDay = (time: string) =>
  time ? moment(time).utc().format("dddd, MMMM Do YYYY") : "N/A";

const sendApprovalEmail = async (donor: any, notes: string) => {
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
        itemNotes: notes,
      },
    });
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

const sendRejectionEmail = async (donor: any, notes: string) => {
  try {
    await sendRejectEmail({
      to: donor.email,
      firstName: donor.firstName,
      itemNotes: notes,
    });
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
  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState<boolean>(false);
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
      await sendRejectionEmail(donor, notes);
    }
  };

  const approveItem = async () => {
    if (storedTimeSlots.length > 0) {
      await deleteEventByItemId(id);
      storedTimeSlots.map((timeSlot) => sendEventToDB(timeSlot, item));
      clearTimeSlots(); // Clear time slots from redux
    }
    if (item.scheduling !== "Pickup" || storedTimeSlots.length > 0) {
      const success = await sendUpdatedItemToDB("Approved and Scheduled", true);

      if (success && donor && donor.email) {
        await sendApprovalEmail(donor, notes);
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
    }
    return await updateItem(updatedItem);
  };

  const sendReceipt = async () => {
    const receiptElement = document.getElementById("receiptPage");
    if (!receiptElement) return;

    document
      .querySelectorAll(
        ".forFlex input, .signature-field input, .value-div input",
      )
      .forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = "transparent";
        }
      });
    const canvas = await html2canvas(receiptElement, { scale: 5 });
    const imgData = canvas.toDataURL("image/jpeg");
    const pdfDOC = new JsPDF();
    const pdfWidth = pdfDOC.internal.pageSize.getWidth();
    const pdfHeight = pdfDOC.internal.pageSize.getHeight();

    // Get image properties
    const imgProps = pdfDOC.getImageProperties(imgData);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;

    // Calculate scale factor to preserve aspect ratio
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    pdfDOC.addImage(imgData, "JPEG", 0, 0, scaledWidth, scaledHeight);

    const pdfBlob = pdfDOC.output("blob");

    try {
      await sendReceiptEmail({
        to: donor.email,
        donationDetails: {
          name: donor.firstName,
          phone: "(805) 546-8699",
          contactEmail: "restoreslo@habitatslo.org",
          officeLocation: "2790 Broad St, San Luis Obispo, CA 93401",
          officeHours: "Tuesday - Saturday, 10AM - 5PM",
          website: "https://www.habitatslo.org",
        },
        receipt: pdfBlob,
      });
      alert("Receipt sent!");
    } catch (err) {
      console.error("Failed to send receipt", err);
      alert("Failed to send receipt.");
    }
    document
      .querySelectorAll(
        ".forFlex input, .signature-field input, .value-div input",
      )
      .forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = "#d5f7ff";
        }
      });
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
      if (value !== 2) {
        setValue(2); // Go to Reciept Tab
        return;
      }
      sendReceipt();
      await sendUpdatedItemToDB("Completed", false);
      router.push("/Admin");
      router.refresh();
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
    setNotes(newNotes);
  };

  const storedStatus = useSelector(
    (state: RootState) => state.event.donationStatus,
  );
  const storedTimeSlots = useSelector(
    (state: RootState) => state.event.timeSlots,
  );

  const handleDeleteItem = async () => {
    await deleteItemByItemId(id);
    await deleteEventByItemId(id);
    setOpen(false);
    router.push("/Admin");
    router.refresh();
    return;
  };

  return (
    <div>
      <AdminNavbar />
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className="modal-box">
            <Typography component="div">
              <h2 className="modal-title-text">Are you sure?</h2>
              <p className="modal-default-text">
                This action will permanently delete the item. You cannot undo
                this.
              </p>
              <div className="modal-button-group">
                <button
                  type="button"
                  className="view-donation-button cancel-button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="view-donation-button delete-button"
                  onClick={handleDeleteItem}
                >
                  Delete
                </button>
              </div>
            </Typography>
          </Box>
        </Modal>
      )}
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
              events={events}
              onNotesChange={handleNotesChange}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AdminSchedule timeSlots={availableTimes} events={events} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Receipt item={item} donor={donor} events={events} />
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
              className="deleteButton"
              onClick={() => setOpen(true)}
            >
              Delete item
            </button>
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
