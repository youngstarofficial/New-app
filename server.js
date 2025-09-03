import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://mercysikhinam:Rmr2306@cluster0.iulxagu.mongodb.net/campus?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Flexible Schema for Students collection
const StudentSchema = new mongoose.Schema({}, { strict: false });
const Student = mongoose.model("Student", StudentSchema, "Students");

// Static branch/district lists
const allBranches = ["AGR","AI","AID","AIM","ANE","AUT","BIO","BME","CHE","CIC","CIV","CME",
  "CS","CSA","CSB","CSC","CSD","CSE","CSG","CSI","CSM","CSN","CSO","CSW","DRG","DTD",
  "ECE","ECI","ECM","EEE","EIE","ETM","FDT","GEO","INF","MCT","MEC","MET","MIN","MMS",
  "MMT","MTE","PHD","PHE","PHM","TEX"];

const allDistricts = ["HNK","HYD","JTL","KGM","KHM","KMR","KRM","MBN","MDL","MED","MHB","NLG",
  "NZB","PDL","RR","SDP","SRC","SRD","SRP","WGL","WNP","YBG"];

// API to get students
app.get("/students", async (req, res) => {
  try {
    const rawData = await Student.find();

    // ✅ Keep one row per branch, all categories as columns
    const students = rawData.map(d => ({
      instituteCode: d.instCode || "N/A",
      instituteName: d.instituteName || "N/A",
      place: d.place || "N/A",
      distCode: d.distCode || "N/A",
      collegeType: d.collegeType || "N/A",
      branchCode: d.branchCode || "N/A",
      branchName: d.branchName || "N/A",
      tuitionFee: d.tuitionFee || 0,
      affiliated: d.affiliated || "N/A",

      ocBoys: d.ocBoys || 0,
      ocGirls: d.ocGirls || 0,
      bcABoys: d.bcABoys || 0,
      bcAGirls: d.bcAGirls || 0,
      bcBBoys: d.bcBBoys || 0,
      bcBGirls: d.bcBGirls || 0,
      bcCBoys: d.bcCBoys || 0,
      bcCGirls: d.bcCGirls || 0,
      bcDBoys: d.bcDBoys || 0,
      bcDGirls: d.bcDGirls || 0,
      bcEBoys: d.bcEBoys || 0,
      bcEGirls: d.bcEGirls || 0,
      scBoys: d.scBoys || 0,
      scGirls: d.scGirls || 0,
      stBoys: d.stBoys || 0,
      stGirls: d.stGirls || 0,
      ewsGenOu: d.ewsGenOu || 0,
      ewsGirlsOu: d.ewsGirlsOu || 0,
    }));

    res.json({ students, allBranches, allDistricts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve frontend from 'public' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
