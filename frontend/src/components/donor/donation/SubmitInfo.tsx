import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { updateDonorID } from "redux/donationSlice";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";
import { useSelector, useDispatch } from "react-redux";
import { getUserByID } from "api/user";
import { Email, sendEmail, createParagraph, createListItem } from "api/email";
import { Item, addItem } from "../../../api/item";
import { addImages, getImages, getImageByID } from "../../../api/image";
import { RootState } from "../../../redux/store";

require("./SubmitInfo.css");

interface DummyComponentProps {
  name?: string;
  dimensions?: string;
  photos?: string[];
  location?: string;
  dropOff?: boolean;
  component?: boolean;
}

// TODO: eventually use DonorScheduleDropoff/Pickup pages instead of this component
const SubmitInfo: React.FC<DummyComponentProps> = ({
  name,
  dimensions,
  photos,
  location,
  dropOff,
  component,
}) => {
  const storedDonation = useSelector((state: RootState) => state.donation);

  const storedName = useSelector((state: RootState) => state.donation.name);
  const storedDimensions = useSelector(
    (state: RootState) => state.donation.dimensions
  );
  const statePhotos = useSelector((state: RootState) => state.donation.photos);

  // storedPhotos is an array of images names,
  // if access is needed, images name can be used
  // to generate presigned urls.
  const storedPhotos = statePhotos.map((url) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split("?")[0];
  });
  const storedLocation = useSelector(
    (state: RootState) => state.donation.address
  );
  const storedDropOff = useSelector(
    (state: RootState) => state.donation.dropoff
  );
  const storedDonorID = useSelector(
    (state: RootState) => state.donation.donorID
  );
  const storedEvents = useSelector(
    (state: RootState) => state.donation.pickupTimes
  );
  const dispatch = useDispatch();

  const setCurrentUserID = async () => {
    Auth.currentUserInfo().then((user) => {
      const { attributes = {} } = user;
      dispatch(updateDonorID(attributes["custom:id"]));
    });
  };

  useEffect(() => {
    setCurrentUserID();
  }, []);

  name = storedName;
  dimensions = storedDimensions;
  photos = storedPhotos;
  location = storedLocation;
  dropOff = storedDropOff;

  const [dropOffOption, setDropOffOption] = useState(dropOff);
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();

  /* convert array of base64-encoded back into array of image files */
  // const convertToFiles = (photos: string[] | undefined): File[] => {
  //   const files: File[] = [];
  //   const timestamp = new Date().getTime(); // Get the current timestamp
  //   photos?.forEach((photo, index) => {
  //     const byteString = atob(photo.split(",")[1]);
  //     const mimeString = photo.split(",")[0].split(":")[1].split(";")[0];
  //     const ab = new ArrayBuffer(byteString.length);
  //     const ia = new Uint8Array(ab);
  //     for (let i = 0; i < byteString.length; i++) {
  //       ia[i] = byteString.charCodeAt(i);
  //     }
  //     const blob = new Blob([ab], { type: mimeString });
  //     // Create a file object with a unique name
  //     const fileName = `image-${timestamp}-${index}.${
  //       mimeString.split("/")[1]
  //     }`;
  //     const file = new File([blob], fileName, { type: mimeString });
  //     files.push(file);
  //   });
  //   return files;
  // };

  /* Send image files array to S3 */
  // const sendImagesToS3 = async (): Promise<boolean> => {
  //   const files = convertToFiles(photos);
  //   console.log("Converted back to Files: ", files);
  //   try {
  //     await addImages(files);
  //     console.log("Images uploaded successfully!");
  //     return true;
  //   } catch (error) {
  //     console.error("Error: ", error);
  //     return false;
  //   }
  // };

  const sendToDB = async () => {
    const donation: Item = {
      name: storedDonation.name,
      size: storedDonation.dimensions,
      photos: storedPhotos,
      address: storedDonation.address,
      city: storedDonation.city,
      state: storedDonation.state,
      zipCode: storedDonation.zipCode.toString(),
      donorId: storedDonation.donorID,
      timeApproved: new Date(),
      scheduling: storedDonation.dropoff ? "Dropoff" : "Pickup",
      timeAvailability: storedDonation.pickupTimes, // TODO
      timeSubmitted: new Date(),
      status: "Needs Approval",
    };
    const response = await addItem(donation);
    console.log("To be sent to DB:", donation);
    // const imagesUploaded = await sendImagesToS3();
    if (!response) {
      setServerError(
        "There was an error sending your donation. Please try again later."
      );
    }
    return response;
  };

  const sendDonationRequestEmail = async () => {
    try {
      const donorUser = await getUserByID(storedDonation.donorID);

      const container = document.createElement("div");
      container.appendChild(
        createParagraph(
          "Thank you for submitting your donation request. Here are the details:"
        )
      );

      const list = document.createElement("ul");
      list.style.listStyleType = "none";
      container.appendChild(list);

      const listItems = [
        { label: "Name: ", value: storedDonation.name },
        { label: "Size: ", value: storedDonation.dimensions },
        { label: "Address: ", value: storedDonation.address },
        { label: "City: ", value: storedDonation.city },
        { label: "State: ", value: storedDonation.state },
        { label: "Zip Code: ", value: storedDonation.zipCode },
        {
          label: "Scheduling: ",
          value: storedDonation.dropoff ? "Dropoff" : "Pickup",
        },
      ];

      listItems.forEach((item) => {
        const listItem = createListItem(item.label, item.value);
        list.appendChild(listItem);
      });

      if (!storedDonation.dropoff) {
        const timeAvailability = document.createElement("li");
        const strong = document.createElement("strong");
        strong.style.fontFamily = "Rubik, sans-serif";
        strong.innerText = "Time Availability: ";
        timeAvailability.appendChild(strong);

        const ul = document.createElement("ul");

        storedDonation.pickupTimes.forEach((time, index) => {
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

      const timeSubmitted = createListItem(
        "Time Submitted: ",
        new Date().toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          second: undefined,
        })
      );
      list.appendChild(timeSubmitted);

      const status = createListItem("Status: ", "Needs Approval");
      list.appendChild(status);

      container.appendChild(
        createParagraph(
          "We appreciate your generous donation. Our team will review your request and get back to you soon."
        )
      );
      container.appendChild(
        createParagraph("Thank you for supporting our cause!")
      );

      const body = container.outerHTML;

      const email = {
        recipientEmail: donorUser.email,
        subject: "Donation Request Submission Confirmation",
        body,
        isHTML: true,
      };

      const response = await sendEmail(email);
      if (!response) {
        setServerError(
          "There was an error sending your donation submission confirmation email. Your donation request has been tracked."
        );
      }
      return response;
    } catch (error) {
      console.error("Error sending donation request email:", error);
      throw error;
    }
  };

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    const backPath: string = "/Donor/Donate/ScheduleDropoffPickup";
    const nextPath: string = "/Donor/Donate/NextSteps";

    if (e.currentTarget.value === "backButton") {
      navigate(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      if ((await sendToDB()) && (await sendDonationRequestEmail())) {
        navigate(nextPath);
      }
    }
  };

  return (
    <div>
      {!component && <DonatorNavbar />}
      {console.log(storedDonation.pickupTimes)}
      <div id={!component ? "MainContainer" : ""}>
        <div id="SubmitInfoPage">
          <div id="information">
            {!component && <ProgressBar activeStep={4} />}
            <h2 id="Review">Review</h2>
            <p>Please review your donation information before you submit.</p>
            <h2 id="ItemInfo">Item Information</h2>
            <p id="itemName">
              <b>Item Name:</b> {name}
            </p>
            <p id="itemDimensions">
              <b>Item Dimensions: </b>
              {dimensions}
            </p>
            <p id="itemPhotos">
              <b>Item Photos</b>
            </p>
            <div id="ProductImages">
              {statePhotos.map((imagePresignedUrl: any, i: any) => (
                <img
                  src={imagePresignedUrl}
                  alt="uploaded"
                  key={i}
                  id="ProductImage"
                />
              ))}
            </div>
            <h2 id="Location">Location</h2>
            <h4 id="Address">
              {storedDonation.address} <br /> {storedDonation.city},{" "}
              {storedDonation.state} {storedDonation.zipCode}
            </h4>
          </div>
          <div id="SchedulingInfo">
            <h2 id="Scheduling">Scheduling</h2>
            <h4 id="SchdulingDesc">
              Does the donation need to be picked up or can you drop it off at
              our ReStore?
            </h4>
          </div>
          <div id="donPDOptions">
            <div>
              <input
                type="radio"
                className="radioOptionLabelCircle"
                checked={dropOffOption}
                onChange={() => setDropOffOption(true)}
              />
              <p id="radioDropoff" className="radioOptionLabel radioLabel">
                I can drop off at the ReStore
              </p>
            </div>
            <br />
            <div id="radioPickUp">
              <input
                type="radio"
                className="radioOptionLabelCircle"
                checked={!dropOffOption}
                onChange={() => setDropOffOption(false)}
              />
              <p className="radioOptionLabel radioLabel">
                I need the item to be picked up
              </p>
            </div>
          </div>
          <div id="ReStoreHours">
            <h2 id="ReStore">ReStore Drop Off Hours</h2>
            <div id="ReStoreHoursTable">
              <div className="ReStoreHoursTableItem">
                <p>Monday</p>
                <p>Closed</p>
              </div>
              <div className="ReStoreHoursTableItem">
                <p>Tuesday</p>
                <p>10:00 AM to 5:00 PM</p>
              </div>
              <div className="ReStoreHoursTableItem">
                <p>Wednesday</p>
                <p>10:00 AM to 5:00 PM</p>
              </div>
              <div className="ReStoreHoursTableItem">
                <p>Thursday</p>
                <p>10:00 AM to 5:00 PM</p>
              </div>
              <div className="ReStoreHoursTableItem">
                <p>Friday</p>
                <p>10:00 AM to 5:00 PM</p>
              </div>
              <div className="ReStoreHoursTableItem">
                <p>Saturday</p>
                <p>10:00 AM to 5:00 PM</p>
              </div>
              <div className="ReStoreHoursTableItem">
                <p>Sunday</p>
                <p>Closed</p>
              </div>
            </div>
          </div>
          <div className="inputError">{serverError}</div>
          {!component && (
            <div
              id="donPickupButtons"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                value="backButton"
                className="donPickupButton backButton"
                onClick={buttonNavigation}
                style={{ padding: "10px 45px" }}
              >
                Back
              </button>
              <button
                type="button"
                value="nextButton"
                className="donPickupButton nextButton"
                onClick={buttonNavigation}
                style={{ padding: "10px 45px" }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitInfo;
