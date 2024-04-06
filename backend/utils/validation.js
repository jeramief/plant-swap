const { validationResult, check, query } = require("express-validator");

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};

    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";

    next(err);
  }

  next();
};

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  handleValidationErrors,
];

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors,
];

const validateGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("name").trim().notEmpty().withMessage("Group name cannot be empty"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  handleValidationErrors,
];

const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage("Longitude must be within -180 and 180"),
  handleValidationErrors,
];

const validateEvent = [
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isIn(["Online", "In Person", "online", "in person", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be an integer"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat()
    .withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .toDate()
    .isAfter("2021-11-19 10:00:00")
    .withMessage("Start date must be in the future"),
  check("endDate")
    .exists({ checkFalsy: true })
    .toDate()
    .isAfter("2021-11-19 21:00:00")
    .withMessage("End date is less than start date"),
  handleValidationErrors,
];

const validateMembership = [
  check("status")
    .isIn(["member", "co-host"])
    .withMessage("Cannot change a membership status to pending"),
  handleValidationErrors,
];

const validateAttendance = [
  check("status")
    .isIn(["attending"])
    .withMessage("Cannot change a membership status to pending"),
  handleValidationErrors,
];

const validateQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  query("name").optional().isString().withMessage("Name must be a string"),
  query("type")
    .optional()
    .isIn(["Online", "In Person"])
    .withMessage("Type must be 'Online' or 'In Person'"),
  query("startDate")
    .optional()
    .isISO8601("yyyy-mm-dd")
    .withMessage("Start date must be a valid datetime"),
  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateLogin,
  validateGroup,
  validateVenue,
  validateEvent,
  validateMembership,
  validateAttendance,
  validateQuery,
};
