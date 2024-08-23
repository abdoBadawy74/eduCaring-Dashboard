import axios from "axios";
import React, { useEffect, useState } from "react";
import "./createEvent.css";
import { ADD_EVENT, BASE, EVENT_GALLERY_RESORSES, EVENT_RESORSES, UPLOAD } from "../../API/Api";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import LoadingScreen from "../../components/LoadingScreen";

const CreateEvent = () => {
  //
  // *********************************
  // *********************************

  const eventId = useParams().id;
  const [getLoading, setGetLoading] = useState(false);
  //
  useEffect(() => {
    setGetLoading(true);
    axios
      .get(`${BASE}/Event/${eventId}`)
      .then((data) => {
        setEventData(data.data.responseObject);
        setGetLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setGetLoading(false);
      });
  }, []);

  // *********************************
  // *********************************

  const questionObj = {
    id: 0,
    eventDayId: 0,
    questionAr: "",
    questionEn: "",
    point: 0,
    eventDayQuestionAnswers: [
      {
        id: 0,
        eventDayQuestionId: 0,
        answerAr: "",
        answerEn: "",
        isTrueAnswer: false,
      },
    ],
  };

  const dayObj = {
    id: 0,
    eventId: 0,
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    address: "",
    addressGPSLink: "",
    latitude: "",
    longitude: "",
    eventStartDay: "",
    noOfTickets: 0,
    price: 0,
    linkZoom: "",
    linkUploadedVideo: "",
    displayLinkUploadedVideo: "",
    isDeleted: false,
    isOnline: false,
    isOffline: false,
    eventDaySpeakers: [
      {
        id: 0,
        eventDayId: 0,
        speakerId: 0,
        startSpeakTime: "",
        endSpeakTime: "",
      },
    ],
    eventDayQuestions: [questionObj],
  };

  const [eventData, setEventData] = useState({
    id: 0,
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    primeImageURL: "",
    displayPrimeImageURL: "",
    startDay: "",
    endDay: "",
    startSellTicketDay: "",
    endSellTicketDay: "",
    isDeleted: false,
    isOnline: false,
    isOffline: false,
    totalPrice: 0,
    eventDays: [{ ...dayObj, eventDayQuestions: [questionObj] }],
    eventImages: [
      {
        id: 0,
        eventId: 0,
        imageURL: "",
        displayImageURL: "<string>",
      },
    ],
  });

  console.log(eventData);

  // *********************************
  // *********************************

  //TODO Event Changes and Images && Video Upload

  const handleEventChange = (e) => {
    const { id, value, type, checked } = e.target;

    setEventData((prevEvent) => ({
      ...prevEvent,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChangeAndSendPrime = async (e) => {
    e.preventDefault();

    const file = e.target.files.item(0);

    if (file) {
      const formData = new FormData();
      formData.append("Content", file);

      try {
        const uploadResult = await axios.post(`${BASE}/${UPLOAD}/${EVENT_RESORSES}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(uploadResult.data);
        setEventData({
          ...eventData,
          primeImageURL: uploadResult.data.responseObject.insert,
          displayPrimeImageURL: uploadResult.data.responseObject.display,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEventImagesChangeAndSendImages = async (e) => {
    e.preventDefault();

    const files = e.target.files;

    if (files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("Content", files[i]);
      }

      try {
        const uploadResult = await axios.post(
          `${BASE}/${UPLOAD}/${EVENT_GALLERY_RESORSES}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(uploadResult.data);

        // Assuming uploadResult.data is an array of image URLs
        const eventImages = uploadResult.data.responseObject.map((imageUrl) => ({
          id: 0,
          eventId: eventId, // Replace eventId with the actual event ID
          imageURL: imageUrl.insert,
          displayImageURL: imageUrl.display,
        }));

        // Now you can update your state or send this data to the server as needed
        setEventData({ ...eventData, eventImages });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVideoChangeAndSend = async (e, dayIndex) => {
    e.preventDefault();

    const file = e.target.files.item(0);

    if (file) {
      const formData = new FormData();
      formData.append("Content", file);

      try {
        const uploadResult = await axios.post(`${BASE}/${UPLOAD}/${EVENT_RESORSES}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(uploadResult.data);

        setEventData((prevEventData) => {
          const updatedEventDays = [...prevEventData.eventDays];
          updatedEventDays[dayIndex] = {
            ...updatedEventDays[dayIndex],
            linkUploadedVideo: uploadResult.data.responseObject.insert,
            displayLinkUploadedVideo: uploadResult.data.responseObject.display,
          };

          return {
            ...prevEventData,
            eventDays: updatedEventDays,
          };
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // *********************************
  // *********************************

  //TODO Day Changes and Remove

  const handleDayChange = (e, dayIndex) => {
    const { name, value, type, checked } = e.target;

    setEventData((prevData) => ({
      ...prevData,
      eventDays: prevData.eventDays.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              [name]: type === "checkbox" ? checked : value,
            }
          : day
      ),
    }));
  };

  const handleDayRemove = (dayIndex) => {
    const list = [...eventData.eventDays];
    list.splice(dayIndex, 1);
    setEventData({ ...eventData, eventDays: list });
  };

  const handleDayAdd = () => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      updatedEventDays.push({ ...dayObj, id: 0, eventId: eventId }); // Replace eventId with the actual event ID
      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  //TODO Speakers Changes and Remove

  const handleSpeakerChange = (e, dayIndex, spIndex) => {
    const { name, value } = e.target;
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      updatedEventDays[dayIndex].eventDaySpeakers = updatedEventDays[dayIndex].eventDaySpeakers.map(
        (speaker, index) => {
          if (index === spIndex) {
            return { ...speaker, [name]: value };
          }
          return speaker;
        }
      );
      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  const handleSpeakerRemove = (dayIndex, spIndex) => {
    const list = [...eventData.eventDays];
    list[dayIndex].eventDaySpeakers.splice(spIndex, 1);
    setEventData({ ...eventData, eventDays: list });
  };

  const handleSpeakerAdd = (dayIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentDay = updatedEventDays[dayIndex];

      currentDay.eventDaySpeakers.push({
        id: 0,
        eventDayId: 0,
        speakerId: "",
        startSpeakTime: "",
        endSpeakTime: "",
      });

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  //TODO Questions Changes and Remove

  const handleQuestionChange = (e, dayIndex, questionIndex) => {
    const { name, value } = e.target;
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      updatedEventDays[dayIndex].eventDayQuestions = updatedEventDays[
        dayIndex
      ].eventDayQuestions.map((question, index) => {
        if (index === questionIndex) {
          return { ...question, [name]: value };
        }
        return question;
      });
      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  const handleQuestionRemove = (dayIndex, questionIndex) => {
    const list = [...eventData.eventDays];
    list[dayIndex].eventDayQuestions.splice(questionIndex, 1);
    setEventData({ ...eventData, eventDays: list });
  };

  const handleQuestionAdd = (dayIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentDay = updatedEventDays[dayIndex];

      const newQuestion = {
        id: 0,
        eventDayId: 0,
        questionAr: "",
        questionEn: "",
        point: 0,
        eventDayQuestionAnswers: [], // Initialize an empty array for answers
      };

      // Add one initial answer to the new question
      newQuestion.eventDayQuestionAnswers.push({
        id: 0,
        eventDayQuestionId: 0,
        answerAr: "",
        answerEn: "",
        isTrueAnswer: false,
      });

      currentDay.eventDayQuestions.push(newQuestion);

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  // TODO Answers Changes and Remove

  const handleAnswerChange = (e, dayIndex, questionIndex, answerIndex) => {
    const { name, value, type, checked } = e.target;
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentQuestion = updatedEventDays[dayIndex].eventDayQuestions[questionIndex];

      const updatedAnswers = currentQuestion.eventDayQuestionAnswers.map((answer, index) => {
        if (index === answerIndex) {
          if (type === "checkbox") {
            return { ...answer, [name]: checked };
          } else {
            return { ...answer, [name]: value };
          }
        }
        return answer;
      });

      // Update the answers array for the current question
      currentQuestion.eventDayQuestionAnswers = updatedAnswers;

      return {
        ...prevEventData,
        eventDays: updatedEventDays,
      };
    });
  };

  const handleAnswerAdd = (dayIndex, questionIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentQuestion = updatedEventDays[dayIndex].eventDayQuestions[questionIndex];

      currentQuestion.eventDayQuestionAnswers.push({
        id: 0,
        eventDayQuestionId: 0,
        answerAr: "",
        answerEn: "",
        isTrueAnswer: false,
      });

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  const handleAnswerRemove = (dayIndex, questionIndex, answerIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentQuestion = updatedEventDays[dayIndex].eventDayQuestions[questionIndex];

      // Remove the answer at the specified index
      currentQuestion.eventDayQuestionAnswers.splice(answerIndex, 1);

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  // Submit Function
  async function submit(e) {
    setLoading(true);
    e.preventDefault();
    console.log(eventData); // Testing
    // Send the eventData to the server
    try {
      let result = await axios
        .put(`${BASE}/${ADD_EVENT}`, eventData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          nav("/events");
        });
      setLoading(false);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // TODO Return ----------

  return (
    <>
      {loading && <LoadingScreen status="Saving..." />}
      {getLoading && <LoadingScreen status="Loading..." />}
      <div>
        <h2 className="main-title fw-bold text-muted">
          Event <small>Update The Event</small>
        </h2>
        <form onSubmit={submit}>
          <div className="event-main-data shadow-sm rounded">
            {/* Boxs */}
            <div className="boxs">
              <div className="box">
                <label htmlFor="nameAr">Arabic Name</label>
                <input
                  type="text"
                  id="nameAr"
                  placeholder="Event Name in Arabic"
                  value={eventData.nameAr}
                  required
                  onChange={(e) => handleEventChange(e)}
                />
              </div>

              <div className="box">
                <label htmlFor="nameEn">English Name</label>
                <input
                  type="text"
                  id="nameEn"
                  placeholder="Event Name in English"
                  value={eventData.nameEn}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="descriptionAr">Arabic Description</label>
                <input
                  type="text"
                  id="descriptionAr"
                  placeholder="Event Description in Arabic"
                  value={eventData.descriptionAr}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="descriptionEn">English Description</label>
                <input
                  type="text"
                  id="descriptionEn"
                  placeholder="Event Description in English"
                  value={eventData.descriptionEn}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="startDay">Start Day of Event</label>
                <input
                  type="datetime-local"
                  id="startDay"
                  value={eventData.startDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="endDay">End Day of Event</label>
                <input
                  type="datetime-local"
                  id="endDay"
                  value={eventData.endDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="startSellTicketDay">Start Sell Ticket Day</label>
                <input
                  type="datetime-local"
                  id="startSellTicketDay"
                  value={eventData.startSellTicketDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="endSellTicketDay">Start Sell Ticket Day</label>
                <input
                  type="datetime-local"
                  id="endSellTicketDay"
                  value={eventData.endSellTicketDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="totalPrice">Total Price</label>
                <input
                  type="number"
                  id="totalPrice"
                  value={eventData.totalPrice}
                  onChange={(e) => handleEventChange(e)}
                />
              </div>

              <div className="box-bool">
                <label>Will this event be online?</label>
                <div className="checkbox-wrapper-10">
                  <input
                    className="tgl tgl-flip"
                    type="checkbox"
                    id="isOnline"
                    checked={eventData.isOnline}
                    onChange={(e) => handleEventChange(e)}
                  />
                  <label
                    className="tgl-btn"
                    data-tg-off="No"
                    data-tg-on="Yes"
                    htmlFor="isOnline"
                  ></label>
                </div>
              </div>

              <div className="box-bool">
                <label>Will this event be offline?</label>
                <div className="checkbox-wrapper-10">
                  <input
                    className="tgl tgl-flip"
                    type="checkbox"
                    id="isOffline"
                    checked={eventData.isOffline}
                    onChange={(e) => handleEventChange(e)}
                  />
                  <label
                    className="tgl-btn"
                    data-tg-off="No"
                    data-tg-on="Yes"
                    htmlFor="isOffline"
                  ></label>
                </div>
              </div>
            </div>

            {/* Uploads Container */}
            <div className="">
              <h5 className="text-muted my-4 mt-4 mx-3 fw-bold border-bottom border-secondary pb-2 mb-2">
                Event Images
              </h5>

              {/* Prime Image Upload */}
              <div className="d-flex align-items-center mx-3 my-3 p-0">
                <div className="box-upload">
                  <label htmlFor="primeImg" className="upload ">
                    <i className="fas fa-image"></i>
                    <span>Upload Prime Image</span>
                  </label>
                  <input
                    type="file"
                    id="primeImg"
                    onChange={(e) => handleImageChangeAndSendPrime(e)}
                    hidden
                  />
                </div>
                <div className="mx-4 bg-secondary-subtle p-3 rounded border-secondary">
                  {eventData.displayPrimeImageURL && (
                    <img
                      src={`${eventData.displayPrimeImageURL}`}
                      height={"120px"}
                      alt=""
                      className="rounded"
                    />
                  )}
                </div>
              </div>

              {/* Event Images Upload */}
              <div className="box-upload m-3">
                <label htmlFor="eventImages" className="upload w-100">
                  <i className="fas fa-images"></i>
                  <span>Upload Event Images</span>
                </label>
                <input
                  type="file"
                  id="eventImages"
                  onChange={(e) => handleEventImagesChangeAndSendImages(e)}
                  multiple
                  hidden
                />
              </div>
              <div className="bg-secondary-subtle mx-3 rounded d-flex justify-content-start gap-4 p-4 align-items-center flex-wrap">
                {eventData.eventImages &&
                  eventData.eventImages.map((image, index) => (
                    <div key={index}>
                      {image.displayImageURL && (
                        <img
                          src={`${image.displayImageURL}`}
                          height={"100px"}
                          style={{ margin: "auto" }}
                          alt=""
                          className="rounded"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Event Days */}
          <Accordion defaultActiveKey="0" flush>
            <h4 className="text-muted my-4 mt-4 fw-bold border-bottom border-secondary pb-2 mb-2">
              Event Days
            </h4>
            {eventData.eventDays.map((singleDay, dayIndex) => (
              <div className="event-day" key={dayIndex}>
                <Accordion.Item className="my-2" eventKey={dayIndex}>
                  <Accordion.Header>Day #{dayIndex}</Accordion.Header>
                  <Accordion.Body className=" shadow-sm rounded">
                    <div className="day-content m-0 p-0">
                      {/* Main Event Day Data */}
                      <div className="boxs">
                        <div className="box">
                          <label htmlFor={`nameAr${dayIndex}`}>Arabic Name</label>
                          <input
                            type="text"
                            id={`nameAr${dayIndex}`}
                            name="nameAr"
                            placeholder="Event Name in Arabic"
                            value={singleDay.nameAr}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`nameEn${dayIndex}`}>English Name</label>
                          <input
                            type="text"
                            id={`nameEn${dayIndex}`}
                            name="nameEn"
                            placeholder="Event Name in English"
                            value={singleDay.nameEn}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`descriptionAr${dayIndex}`}>Arabic Description</label>
                          <input
                            type="text"
                            id={`descriptionAr${dayIndex}`}
                            name="descriptionAr"
                            placeholder="Event Description in Arabic"
                            value={singleDay.descriptionAr}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`descriptionEn${dayIndex}`}>English Description</label>
                          <input
                            type="text"
                            id={`descriptionEn${dayIndex}`}
                            name="descriptionEn"
                            placeholder="Event Description in English"
                            value={singleDay.descriptionEn}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`address${dayIndex}`}>Address</label>
                          <input
                            type="text"
                            id={`address${dayIndex}`}
                            name="address"
                            placeholder="Event Address"
                            value={singleDay.address}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`addressGPSLink${dayIndex}`}>Address GPS Link</label>
                          <input
                            type="url"
                            id={`addressGPSLink${dayIndex}`}
                            name="addressGPSLink"
                            placeholder="Location of The Event"
                            value={singleDay.addressGPSLink}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`latitude${dayIndex}`}>Latitude</label>
                          <input
                            type="text"
                            id={`latitude${dayIndex}`}
                            name="latitude"
                            placeholder="Latitude of Location"
                            value={singleDay.latitude}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`longitude${dayIndex}`}>longitude</label>
                          <input
                            type="text"
                            id={`longitude${dayIndex}`}
                            name="longitude"
                            placeholder="Longtude of Location"
                            value={singleDay.longitude}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`eventStartDay${dayIndex}`}>Event Start Day</label>
                          <input
                            type="datetime-local"
                            id={`eventStartDay${dayIndex}`}
                            name="eventStartDay"
                            placeholder="Event Start Day"
                            value={singleDay.eventStartDay}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`noOfTickets${dayIndex}`}>No Of Tickets</label>
                          <input
                            type="number"
                            id={`noOfTickets${dayIndex}`}
                            name="noOfTickets"
                            placeholder="Event End Day"
                            value={singleDay.noOfTickets}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`price${dayIndex}`}>Price</label>
                          <input
                            type="number"
                            id={`price${dayIndex}`}
                            name="price"
                            placeholder="Event Price"
                            value={singleDay.price}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`linkZoom${dayIndex}`}>Link Zoom</label>
                          <input
                            type="link"
                            id={`linkZoom${dayIndex}`}
                            name="linkZoom"
                            placeholder="Zoom Link"
                            value={singleDay.linkZoom}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box-bool">
                          <label>Will this day be online?</label>
                          <div className="checkbox-wrapper-10">
                            <input
                              className="tgl tgl-flip"
                              type="checkbox"
                              id={`isOnline${dayIndex}`}
                              name="isOnline"
                              checked={singleDay.isOnline}
                              onChange={(e) => handleDayChange(e, dayIndex)}
                            />
                            <label
                              className="tgl-btn"
                              data-tg-off="No"
                              data-tg-on="Yes"
                              htmlFor={`isOnline${dayIndex}`}
                            ></label>
                          </div>
                        </div>
                        <div className="box-bool">
                          <label>Will this day be offline?</label>
                          <div className="checkbox-wrapper-10">
                            <input
                              className="tgl tgl-flip"
                              type="checkbox"
                              id={`isOffline${dayIndex}`}
                              name="isOffline"
                              checked={singleDay.isOffline}
                              onChange={(e) => handleDayChange(e, dayIndex)}
                            />
                            <label
                              className="tgl-btn"
                              data-tg-off="No"
                              data-tg-on="Yes"
                              htmlFor={`isOffline${dayIndex}`}
                            ></label>
                          </div>
                        </div>
                      </div>

                      {/* Speakers */}
                      <Accordion defaultActiveKey="0" flush>
                        <h6 className="text-muted my-2 mt-4 fw-bold border-bottom border-secondary pb-2">
                          Event Day Speakers
                        </h6>
                        {eventData.eventDays[dayIndex].eventDaySpeakers.map((speaker, spIndex) => (
                          <div key={spIndex} className="event-day-speaker">
                            <Accordion.Item eventKey={spIndex} className="my-2">
                              <Accordion.Header>Speaker #{spIndex + 1}</Accordion.Header>
                              <Accordion.Body>
                                <div className="boxs">
                                  <div className="box">
                                    <label htmlFor={`speakerId${dayIndex}${spIndex}`}>
                                      Speaker ID
                                    </label>
                                    <input
                                      type="text"
                                      id={`speakerId${dayIndex}${spIndex}`}
                                      name="speakerId"
                                      placeholder="Speaker ID"
                                      value={speaker.speakerId}
                                      onChange={(e) => handleSpeakerChange(e, dayIndex, spIndex)}
                                      required
                                    />
                                  </div>
                                  <div className="box">
                                    <label htmlFor={`startSpeakTime${dayIndex}${spIndex}`}>
                                      Start Speak Time
                                    </label>
                                    <input
                                      type="datetime-local"
                                      id={`startSpeakTime${dayIndex}${spIndex}`}
                                      name="startSpeakTime"
                                      placeholder="Start Speak Time"
                                      value={speaker.startSpeakTime}
                                      onChange={(e) => handleSpeakerChange(e, dayIndex, spIndex)}
                                      required
                                    />
                                  </div>
                                  <div className="box">
                                    <label htmlFor={`endSpeakTime${dayIndex}${spIndex}`}>
                                      End Speak Time
                                    </label>
                                    <input
                                      type="datetime-local"
                                      id={`endSpeakTime${dayIndex}${spIndex}`}
                                      name="endSpeakTime"
                                      placeholder="End Speak Time"
                                      value={speaker.endSpeakTime}
                                      onChange={(e) => handleSpeakerChange(e, dayIndex, spIndex)}
                                      required
                                    />
                                  </div>
                                </div>

                                {/* Button Of Remove Current */}
                                {eventData.eventDays[dayIndex].eventDaySpeakers.length !== 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSpeakerRemove(dayIndex, spIndex)}
                                    className="remove-btn my-0"
                                  >
                                    <span>Remove a Speaker</span>
                                  </button>
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                            {/* // Add More Speaker */}
                            {eventData.eventDays[dayIndex].eventDaySpeakers.length - 1 ===
                              spIndex && (
                              <button
                                type="button"
                                onClick={() => handleSpeakerAdd(dayIndex)}
                                className="add-btn"
                              >
                                <span>Add a Speaker</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </Accordion>

                      {/* Event Questions */}
                      <Accordion defaultActiveKey="0" flush>
                        <h6 className="text-muted my-2 mt-4 fw-bold border-bottom border-secondary pb-2">
                          Event Day Questions
                        </h6>
                        {singleDay.eventDayQuestions.map((question, questionIndex) => (
                          <div key={questionIndex} className="event-day-questin">
                            <Accordion.Item eventKey={questionIndex} className="my-2">
                              <Accordion.Header>Question #{questionIndex + 1}</Accordion.Header>
                              <Accordion.Body>
                                <div className="boxs">
                                  <div className="box">
                                    <label htmlFor={`questionAr${dayIndex}${questionIndex}`}>
                                      Arabic Question
                                    </label>
                                    <input
                                      type="text"
                                      id={`questionAr${dayIndex}${questionIndex}`}
                                      name="questionAr"
                                      placeholder="Question in Arabic"
                                      value={question.questionAr}
                                      onChange={(e) =>
                                        handleQuestionChange(e, dayIndex, questionIndex)
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="box">
                                    <label htmlFor={`questionEn${dayIndex}${questionIndex}`}>
                                      English Question
                                    </label>
                                    <input
                                      type="text"
                                      id={`questionEn${dayIndex}${questionIndex}`}
                                      name="questionEn"
                                      placeholder="Question in English"
                                      value={question.questionEn}
                                      onChange={(e) =>
                                        handleQuestionChange(e, dayIndex, questionIndex)
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="box">
                                    <label htmlFor={`point${dayIndex}${questionIndex}`}>
                                      Point
                                    </label>
                                    <input
                                      type="number"
                                      id={`point${dayIndex}${questionIndex}`}
                                      name="point"
                                      placeholder="Point"
                                      value={question.point}
                                      onChange={(e) =>
                                        handleQuestionChange(e, dayIndex, questionIndex)
                                      }
                                      required
                                    />
                                  </div>
                                </div>

                                {/* Answers Section */}
                                {question.eventDayQuestionAnswers.map((answer, answerIndex) => (
                                  <div key={answerIndex} className="event-day-question-answer">
                                    <div className="boxs">
                                      <div className="box">
                                        <label
                                          htmlFor={`answerAr${dayIndex}${questionIndex}${answerIndex}`}
                                        >
                                          Arabic Answer
                                        </label>
                                        <input
                                          type="text"
                                          id={`answerAr${dayIndex}${questionIndex}${answerIndex}`}
                                          name="answerAr"
                                          placeholder="Answer in Arabic"
                                          value={answer.answerAr}
                                          onChange={(e) =>
                                            handleAnswerChange(
                                              e,
                                              dayIndex,
                                              questionIndex,
                                              answerIndex
                                            )
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="box">
                                        <label
                                          htmlFor={`answerEn${dayIndex}${questionIndex}${answerIndex}`}
                                        >
                                          English Answer
                                        </label>
                                        <input
                                          type="text"
                                          id={`answerEn${dayIndex}${questionIndex}${answerIndex}`}
                                          name="answerEn"
                                          placeholder="Answer in English"
                                          value={answer.answerEn}
                                          onChange={(e) =>
                                            handleAnswerChange(
                                              e,
                                              dayIndex,
                                              questionIndex,
                                              answerIndex
                                            )
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="box-bool">
                                        <label>Is True Answer?</label>
                                        <div className="checkbox-wrapper-10">
                                          <input
                                            className="tgl tgl-flip"
                                            type="checkbox"
                                            id={`isTrueAnswer${dayIndex}${questionIndex}${answerIndex}`}
                                            name="isTrueAnswer"
                                            checked={answer.isTrueAnswer}
                                            onChange={(e) =>
                                              handleAnswerChange(
                                                e,
                                                dayIndex,
                                                questionIndex,
                                                answerIndex
                                              )
                                            }
                                          />
                                          <label
                                            className="tgl-btn"
                                            data-tg-off="No"
                                            data-tg-on="Yes"
                                            htmlFor={`isTrueAnswer${dayIndex}${questionIndex}${answerIndex}`}
                                          ></label>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Button to remove the current answer */}
                                    {question.eventDayQuestionAnswers.length !== 1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAnswerRemove(dayIndex, questionIndex, answerIndex)
                                        }
                                        className="remove-btn"
                                      >
                                        <span>Remove an Answer</span>
                                      </button>
                                    )}

                                    {/* Button to add more answers */}
                                    {question.eventDayQuestionAnswers.length - 1 ===
                                      answerIndex && (
                                      <button
                                        type="button"
                                        onClick={() => handleAnswerAdd(dayIndex, questionIndex)}
                                        className="add-btn d-block m-3 my-0"
                                      >
                                        <span>Add an Answer</span>
                                      </button>
                                    )}
                                  </div>
                                ))}

                                {/* Button to remove the current question */}
                                {singleDay.eventDayQuestions.length !== 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuestionRemove(dayIndex, questionIndex)}
                                    className="remove-btn w-100 mt-3 mb-3 my-0"
                                  >
                                    <span>Remove a Question</span>
                                  </button>
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                            {/* Button to add more questions */}
                            {singleDay.eventDayQuestions.length - 1 === questionIndex && (
                              <button
                                type="button"
                                onClick={() => handleQuestionAdd(dayIndex)}
                                className="add-btn"
                              >
                                <span>Add a Question</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </Accordion>
                    </div>

                    {/* Upload Video */}
                    <h6 className="text-muted my-2 mt-4 fw-bold border-bottom border-secondary pb-2">
                      Event Day Video
                    </h6>
                    <div className="d-flex align-items-center my-3 p-0">
                      <div className="box-upload ">
                        <label htmlFor={`uploadVidoe${dayIndex}`} className="upload">
                          <i className="fas fa-video"></i>
                          <span>Upload Video</span>
                        </label>
                        <input
                          type="file"
                          id={`uploadVidoe${dayIndex}`}
                          onChange={(e) => handleVideoChangeAndSend(e, dayIndex)}
                          hidden
                          className="rounded"
                        />
                      </div>

                      <div className="mx-4 bg-secondary-subtle p-3 rounded border-secondary">
                        {singleDay.displayLinkUploadedVideo && (
                          <video
                            src={`${singleDay.displayLinkUploadedVideo}`}
                            height={"120px"}
                            controls
                            className="rounded"
                          />
                        )}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Button Of Remove Day */}
                {eventData.eventDays.length !== 1 && (
                  <button
                    type="button"
                    onClick={() => handleDayRemove(dayIndex)}
                    className="remove-btn d-block m-0 mb-3"
                  >
                    <span>Remove a Day</span>
                  </button>
                )}

                {/* Button Of Add Day */}
                {eventData.eventDays.length - 1 === dayIndex && (
                  <button type="button" onClick={handleDayAdd} className="add-btn w-100">
                    <span>Add a Day</span>
                  </button>
                )}
              </div>
            ))}
          </Accordion>

          <button type="submit" className="btn btn-primary w-100 mt-4 mb-1">
            Update Event
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
