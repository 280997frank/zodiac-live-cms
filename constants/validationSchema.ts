import { string, mixed, date, boolean, array, object, number } from "yup";

export const requiredString = string().required("Required");
export const requiredUrl = string().url("Invalid URL").required("Required");
export const optionalUrl = string().url("Invalid URL");
export const requiredBoolean = boolean().required("Required");
export const requiredDate = date().required("Required");

export const requiredArrayOfStrings = array().of(string()).min(1, "Required");
export const requiredNumber = number()
  .integer("Not an integer number")
  .required("Required");

export const requiredEmail = string()
  .email("Invalid email address")
  .required("Required");

export const requiredFile = mixed()
  .required("Required")
  .test("arrayBuffer", "Invalid file/URL", (value) => {
    if (typeof value === "string" && value.length > 0) {
      return true;
    }

    if (value !== undefined) {
      return value instanceof window.File;
    }

    return false;
  });

export const decimalNumber = number().test(
  "maxDigitsAfterDecimal",
  "number field must have 2 digits after decimal or less",
  (number: any) => /^\d+(\.\d{1,2})?$/.test(number)
);

export const optionalFile = mixed().test(
  "arrayBuffer",
  "Invalid file/URL",
  (value) => {
    if (typeof value === "string" || typeof value === "undefined") {
      return true;
    }

    if (value !== undefined) {
      return value instanceof window.File;
    }

    return false;
  }
);

export const arrayOfRequiredFiles = array().of(requiredFile).min(1, "Required");

export const arrayOfCaptionedImages = array()
  .of(
    object().shape({
      body: requiredString,
      image: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfPressMedia = array()
  .of(
    object().shape({
      body: requiredString,
      image: requiredFile,
      description: requiredString,
    })
  )
  .min(1, "Required");

export const arrayOfReviews = array()
  .of(
    object().shape({
      text: requiredString,
      description: requiredString,
    })
  )
  .min(1, "Required");

export const arrayOfThumbnails = array()
  .of(
    object().shape({
      image: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfEpisodeGuide = array()
  .of(
    object().shape({
      image: requiredFile,
      label: requiredString,
      thumbnail: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfMain = array()
  .of(
    object().shape({
      image: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfImageFeed = array()
  .of(
    object().shape({
      file: requiredFile,
    })
  )
  .min(1, "Required");
