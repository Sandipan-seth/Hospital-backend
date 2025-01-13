import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available,
    } = req.body;
    const imageFile = req.file;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !available
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check for image file
    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required." });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email." });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Parse address
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Invalid address format. Must be JSON." });
    }

    // Upload image to Cloudinary
    let imageUrl;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    imageUrl = imageUpload.secure_url;

    // Create doctor data
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      available,
      address: parsedAddress,
      date: Date.now(),
      image: imageUrl,
    };

    // Save to database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // Success response
    res
      .status(200)
      .json({ success: "true", message: "Doctor added successfully." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//api for admin login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let token;
      token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.status(200).json({ success:"true",token });
    } else {
      return res.status(400).json({success:"false", error: "Invalid credentials." });
    }


  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export { addDoctor, loginAdmin };
