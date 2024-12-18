const mongoose = require("mongoose");
const { userPhoneNoValidation } = require("../config/phoneNoConfig");
const {validatePassword} = require("../config/passwordConfig");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please add your name"],
    },
    email: {
      type: String,
      require: [true, "Please add your email"],
      unique: true,
    },
    phoneNumber:{
      type:String,
      validate: [userPhoneNoValidation, "Please provide a valid phone number"],
    },
    imageUrl:{
      type: String,
      default:"https://res.cloudinary.com/dwprhpk9r/image/upload/v1728546051/uploads/product_1728546048771.png.png",
    },
    auth0Id: {
      type: String,
      unique: true,
      sparse: true, // Allows null values and maintains uniqueness for non-null values
    },
    authProviders: [{
      type: String,
      enum: ['local', 'auth0', 'google']
    }],
    // Keep authProvider for backward compatibility and as primary provider
    authProvider: {
      type: String,
      enum: ['local', 'auth0', 'google'],
      default: 'local'
    },
    password: {
      type: String,
      required: function() {
        return this.authProvider === 'local';
      },
      validate: {
        validator: function(value) {
          // Only validate password if it's a local account
          if (this.authProvider === 'local') {
            const { valid } = validatePassword(value);
            return valid;
          }
          return true;
        },
        message: props => validatePassword(props.value).message,
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userStatus: {
      type: String,
      enum: ['Active', 'Suspended', 'Deactivated'], // Enum for user status
      default: 'Active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    googleId: String, 
    resetToken: String,
  resetTokenExpire: Date,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);
