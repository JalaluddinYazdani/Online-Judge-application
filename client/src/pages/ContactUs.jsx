import React from "react";
import Navbar from "../components/Navbar";
import FormfacadeEmbed from "@formfacade/embed-react";
const ContactUs = () => {
  return (
    <>
      <Navbar />
      <FormfacadeEmbed
        formFacadeURL="https://formfacade.com/include/115495874363399718259/form/1FAIpQLScNVW5iY7BXkEXGhpNiRaxKKWg_i4Vz2rZRSmsBqSH7jWTcOA/classic.js/?div=ff-compose"
        onSubmitForm={() => console.log("Form submitted")}
      />
    </>
  );
};

export default ContactUs;